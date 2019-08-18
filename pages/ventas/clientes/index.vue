<template>
  <simple-table-layout>
    <template #title>
      <h1>Clientes</h1>
    </template>
    <template #actions>
      <v-btn v-if="$isAllowed('registerSale')" color="accent" @click="openAddClientDialog">
        <v-icon small>fa-plus</v-icon>
        <span class="mx-1"></span>
        <span>Nuevo cliente</span>
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
        :items="clients"
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
            <td class="text-xs-left">{{ props.item.district || "Sin distrito" }}</td>
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
                  v-if="$isAllowed('organizeSale')"
                  class="mx-1"
                  color="accent"
                  dark
                  fab
                  small
                  @click.stop="openEditClientDialog(props.item)"
                >
                  <v-icon small>fa-pen</v-icon>
                </v-btn>
                <v-btn
                  v-if="$isAllowed('organizeSale')"
                  class="mx-1"
                  color="deep-purple darken-2"
                  dark
                  fab
                  small
                  @click.stop="deleteClient(props.item)"
                >
                  <v-icon small>fa-trash</v-icon>
                </v-btn>
              </v-speed-dial>
            </td>
          </tr>
        </template>
      </v-data-table>
    </template>
    <template #dialog>
      <save-client-dialog 
        v-model="openSaveDialog" 
        :client="clientToSave" 
        :mode="dialogMode"
      ></save-client-dialog>
    </template>
  </simple-table-layout>
</template>

<script>
import EmptyListTile from "@/components/common/EmptyListTile";
import SaveClientDialog from "@/components/clients/SaveClientDialog";
import { mapState, mapActions } from "vuex";
import salePerimeter from '@/security/perimeters/sale-perimeter.js';

export default {
  routePerimeterAction: 'viewSale',
  perimeters: [
    salePerimeter
  ],
  meta: {
    breadcrumbs: [
      { name: "Módulos", link: "/" },
      { name: "Clientes", link: "/ventas/clientes" }
    ]
  },
  components: {
    EmptyListTile,
    SaveClientDialog
  },
  async fetch({ store }) {
  },
  data() {
    return {
      title: "Clientes",
      headers: [
        { text: "Id Local", value: "nativeId" },
        { text: "Nombre", value: "name" },
        { text: "Direccion", value: "address" },
        { text: "Distrito", value: "district" },
        { text: "Tipo", value: "type" },
        { text: "Acciones", value: "id", width: "10%", sortable: false }
      ],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 20,
        sortBy: "id"
      },
      expand: false,
      search: "",
      filter:
        "nativeId:{}*,name:{}*,address:{}*,district:{}*,type.name:{}*",
      pageSizes: [20, 30, 50, 100],
      clientToSave: {
        type: { id: 0 },
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
        await this.$store.dispatch("clients/fetchClients", params);
        await this.$store.dispatch("clients/fetchClientTypes", params);
      }
    },
    search: {
      async handler() {
        const { sortBy, descending, page, rowsPerPage } = this.pagination;
        let searchFilter = this.search
          ? this.filter.replace(/{}/g, this.search)
          : "";
        const params = {
          requestPage: page - 1,
          size: rowsPerPage,
          sortBy,
          descending,
          filter: searchFilter
        };
        await this.$store.dispatch("clients/fetchClients", params);
      }
    }
  },
  computed: {
    ...mapState("clients", ["clients", "page", "clientTypes"]),
    exportURL() {
      let searchFilter = this.search
        ? this.filter.replace(/{}/g, this.search)
        : "";
      return `${this.$axios.defaults.baseURL}/api/clients/reports?filter=${searchFilter}`;
    }
  },
  methods: {
    ...mapActions("clients", {
      deleteClientAction: "deleteClient"
    }),
    async openAddClientDialog() {
      await this.$auth.fetchUser();
      if(this.$isAllowed('registerSale')) {
        this.openSaveDialog = true;
        this.clientToSave = {
          type: { id: 0 },
        };
        this.dialogMode = "nuevo";
      } else {
        this.$router.push("/unauthorized");
      }

    },
    async openEditClientDialog(client) {
      await this.$auth.fetchUser();
      if(this.$isAllowed('organizeSale')) {
        this.openSaveDialog = true;
        this.clientToSave = client;
        this.dialogMode = "editar";
      } else {
        this.$router.push("/unauthorized");
      }
    },
    async deleteClient(client) {
      try {
        const { name } = client;
        
        const res = await this.$confirm(`¿Está seguro de borrar al cliente '${name}'?`, { 
          title: "Advertencia" 
        });

        await this.$auth.fetchUser();

        if(this.$isAllowed('organizeSale')) {
          if (res) {
            await this.deleteClientAction({ client });
            await this.$confirm("Borrado correcto!", {
              title: "Éxito",
              color: "success"
            });
          } 
        } else {
          this.$router.push("/unauthorized");
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
      this.$confirm((errors || []).map(e => e.errorMessage).join("\n"), {
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
