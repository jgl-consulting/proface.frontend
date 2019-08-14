<template>
  <simple-table-layout>
    <template #title>
      <h1>Proveedores</h1>
    </template>
    <template #actions>
      <v-btn color="accent" @click="openAddSupplierDialog">
        <v-icon small>fa-plus</v-icon>
        <span class="mx-1"></span>
        <span>Nuevo proveedor</span>
      </v-btn>
      <v-btn color="red darken-2" dark :href="exportURL" target="_blank">
        <v-icon small>fa-file-pdf</v-icon>
        <span class="mx-1"></span>
        <span>Ver PDF</span>
      </v-btn>
    </template>
    <template #filters>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Búsqueda"
        box
        single-line
        clearable
        clear-icon="fa-times"
        hide-details
      ></v-text-field>
    </template>
    <template #table>
      <v-data-table
        :headers="headers"
        :items="suppliers"
        :expand="expand"
        item-key="id"
        class="elevation-1"
        :total-items="page.totalElements"
        :pagination.sync="pagination"
        :rows-per-page-items="pageSizes"
        rows-per-page-text="Tamaño de página"
        must-sort
      >
        <template v-slot:items="props">
          <tr @click.stop="props.expanded = !props.expanded">
            <td class="text-xs-left">{{ props.item.nativeId || "Sin identificador" }}</td>
            <td class="text-xs-left">{{ props.item.name || "Sin nombre" }}</td>
            <td class="text-xs-left">{{ props.item.address || "Sin dirección" }}</td>
            <td class="text-xs-left">
              <span class="mr-2">{{ $_.get(props.item.country, "iso", "Sin país") }}</span>
              <flag
                :iso='$_.get(props.item.country, "iso", "Sin país")'
                :title='$_.get(props.item.country, "name", "Sin país")'
                :squared="false"
              ></flag>
            </td>
            <td class="text-xs-left">{{ $_.get(props.item.type, "name", "Sin tipo") }}</td>
            <td class="text-xs-left" @click.stop="() => {}">
              <v-speed-dial direction="left" open-on-hover left>
              <template v-slot:activator>
                <v-btn color="secondary" dark fab small>
                  <v-icon small>fa-wrench</v-icon>
                </v-btn>
              </template>
                <v-btn
                  class="mx-1"
                  color="primary"
                  dark
                  fab
                  small
                  nuxt
                  :to="props.item.id | path($route.fullPath)"
                >
                  <v-icon small>fa-ellipsis-v</v-icon>
                </v-btn>
                <v-btn
                  class="mx-1"
                  color="accent"
                  dark
                  fab
                  small
                  @click.stop="openEditSupplierDialog(props.item)"
                >
                  <v-icon small>fa-pen</v-icon>
                </v-btn>
                <v-btn
                  class="mx-1"
                  color="deep-purple darken-2"
                  dark
                  fab
                  small
                  @click.stop="deleteSupplier(props.item)"
                >
                  <v-icon small>fa-trash</v-icon>
                </v-btn>
              </v-speed-dial>
            </td>
          </tr>
        </template>
        <template v-slot:expand="{ item }">
          <v-list avatar>
            <div v-if="$_.isEmpty(item.accounts)">
              <empty-list-tile>No hay cuentas para el proveedor.</empty-list-tile>
            </div>
            <div v-else>
              <account-list-item
                class="my-3"
                v-for="account in item.accounts"
                :key="account | accountFlatId"
                :description="account.description"
                :number="account.number"
                :cci="account.cci"
                :bank="account.bank"
                :currency="account.currency"
              ></account-list-item>
            </div>
          </v-list>
        </template>
      </v-data-table>
    </template>
    <template #dialog>
      <save-supplier-dialog v-model="openSaveDialog" :supplier="supplierToSave" :mode="dialogMode"></save-supplier-dialog>
    </template>
  </simple-table-layout>
</template>

<script>
import EmptyListTile from "@/components/common/EmptyListTile";
import AccountListItem from "@/components/suppliers/AccountListItem";
import SaveSupplierDialog from "@/components/suppliers/SaveSupplierDialog";
import { mapState, mapActions } from "vuex";

import purchasePerimeter from '@/security/perimeters/purchase-perimeter';
export default {
  routePerimeterAction: 'viewPurchase',
  perimeters: [
    purchasePerimeter
  ],
  meta: {
    breadcrumbs: [
      { name: "Módulos", link: "/" },
      { name: "Proveedores", link: "/compras/proveedores" }
    ]
  },
  components: {
    AccountListItem,
    EmptyListTile,
    SaveSupplierDialog
  },
  async fetch({ store }) {
    //const params = { requestPage: 0, size: 20, sortBy: undefined};
    //await store.dispatch("suppliers/fetchSuppliers", params);
    try {
      await store.dispatch("suppliers/fetchCountries");
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      title: "Proveedores",
      headers: [
        { text: "Id Local", value: "nativeId" },
        { text: "Nombre", value: "name" },
        { text: "Direccion", value: "address" },
        { text: "Pais", value: "country" },
        { text: "Tipo", value: "type" },
        { text: "Acciones", value: "id", width: "10%", sortable: false }
      ],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 20, // -1 for All",
        sortBy: "id"
      },
      expand: false,
      search: "",
      filter: "nativeId:{}*,name:{}*,address:{}*,country.name:{}*,type.name:{}*",
      pageSizes: [20, 30, 50, 100],
      supplierToSave: {
        country: { id: 0 },
        contact: { id: 0 }
      },
      openSaveDialog: false,
      dialogMode: "nuevo"
    };
  },
  watch: {
    pagination: {
      async handler() {
        const { sortBy, descending, page, rowsPerPage } = this.pagination;
        const params = {
          requestPage: page - 1,
          size: rowsPerPage,
          sortBy,
          descending
        };
        await this.$store.dispatch("suppliers/fetchSuppliers", params);
      }
    },
    search: {
      async handler() {
        const { sortBy, descending, page, rowsPerPage } = this.pagination;
        let searchFilter = this.search ? this.filter.replace(/{}/g, this.search) : "";
        const params = {
          requestPage: page - 1,
          size: rowsPerPage,
          sortBy,
          descending,
          filter: searchFilter
        };
        await this.$store.dispatch("suppliers/fetchSuppliers", params);
      }
    }
  },
  computed: {
    ...mapState("suppliers", ["suppliers", "page", "countries"]),
    exportURL() {
      let searchFilter = this.search ? this.filter.replace(/{}/g, this.search) : "";
      return `${this.$axios.defaults.baseURL}/api/suppliers/reports?filter=` + searchFilter;
    }
  },
  methods: {
    ...mapActions("suppliers", {
      deleteSupplierAction: "deleteSupplier"
    }),
    openAddSupplierDialog() {
      this.openSaveDialog = true;
      this.supplierToSave = {
        country: { id: 0 },
        contact: { id: 0 }
      };
      this.dialogMode = "nuevo";
    },
    openEditSupplierDialog(supplier) {
      this.openSaveDialog = true;
      this.supplierToSave = supplier;
      this.dialogMode = "editar";
    },
    async deleteSupplier(supplier) {
      try {
        const { name } = supplier;
        const res = await this.$confirm(
          `¿Está seguro de borrar al proveedor '${name}'?`,
          { title: "Advertencia" }
        );
        if (res) {
          await this.deleteSupplierAction({ supplier });
          await this.$confirm("Borrado correcto!", {
            title: "Éxito",
            color: "success"
          });
        }
      } catch (error) {
        this.showError(error);
      }
    },
    optional(object) {
      return object || {};
    },
    showError(error) {
      const { message, errors } = error.response.data;
      this.$confirm(errors.map(e => e.errorMessage).join("\n"), {
        title: message,
        color: "error",
        width: 500
      });
    }
  },
  filters: {
    path: (param, path) => `${path}/${param}`,
    accountFlatId({ id }) {
      return `${id}`;
    }
  }
};
</script>
