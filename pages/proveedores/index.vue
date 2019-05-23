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
      >
        <template v-slot:items="props">
          <tr @click.stop="props.expanded = !props.expanded">
            <td class="text-xs-left">{{ props.item.id }}</td>
            <td class="text-xs-left">{{ props.item.nativeId }}</td>
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-left">{{ props.item.address }}</td>
            <td class="text-xs-left">
              <span class="mr-2">{{ props.item.country.iso }}</span>
              <flag :iso="props.item.country.iso" :title="props.item.country.name" :squared="false"></flag>
            </td>
            <td class="text-xs-left">{{ props.item.type.name }}</td>
            <td class="text-xs-left" @click.stop="() => {}">
              <v-btn
                class="mx-1"
                color="primary"
                dark
                icon
                flat
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
                icon
                flat
                small
                @click.stop="openEditSupplierDialog(props.item)"
              >
                <v-icon small>fa-pen</v-icon>
              </v-btn>
              <v-btn
                class="mx-1"
                color="deep-purple darken-2"
                dark
                icon
                flat
                small
                @click.stop="deleteSupplier(props.item)"
              >
                <v-icon small>fa-trash</v-icon>
              </v-btn>
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
export default {
  meta: {
    breadcrumbs: [
      { name: "Módulos", link: "/" },
      { name: "Proveedores", link: "/proveedores" }
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
    await store.dispatch("suppliers/fetchCountries");
  },
  data() {
    return {
      title: "Proveedores",
      headers: [
        {
          text: "Id",
          align: "left",
          value: "id"
        },
        { text: "Id Local", value: "nativeId" },
        { text: "Nombre", value: "name" },
        { text: "Direccion", value: "address" },
        { text: "Pais", value: "country" },
        { text: "Tipo", value: "type" },
        { text: "Acciones", value: "id", sortable: false }
      ],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 20, // -1 for All",
        sortBy: "id"
      },
      expand: false,
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
    }
  },
  computed: {
    ...mapState("suppliers", ["suppliers", "page", "countries"])
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
