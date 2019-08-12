<template>
  <simple-table-layout>
  <template #title>
    <h1>Estados de Venta</h1>
  </template>
  <template #actions>
    <v-btn color="accent" @click="openAddClientDialog">
    <v-icon small>fa-plus</v-icon>
    <span class="mx-1"></span>
    <span>Nuevo Estado de Venta</span>
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
    :items="saleStatuses"
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
      <td class="text-xs-left">{{ props.item.description || "Sin descripción" }}</td>
      <td class="text-xs-left">
        <v-icon :color="props.item.color || 'primary'">fa-circle</v-icon>
      </td>
      <td class="text-xs-left">
        <v-icon>{{  props.item.icon }}</v-icon>
      </td>
      <td class="text-xs-left">{{ props.item.order }}</td>
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
          @click.stop="openEditClientDialog(props.item)"
        >
          <v-icon small>fa-pen</v-icon>
        </v-btn>
        <v-btn
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
  <!-- 
  <template #dialog>
    <save-client-dialog 
    v-model="openSaveDialog" 
    :client="clientToSave" 
    :mode="dialogMode"
    ></save-client-dialog>
  </template>
  -->
  </simple-table-layout> 
</template>

<script>
import EmptyListTile from "@/components/common/EmptyListTile";
import { mapState, mapActions } from "vuex";

export default {
  meta: {
  breadcrumbs: [
    { name: "Módulos", link: "/" },
    { name: "Estados de Venta", link: "/ventas/estadosVenta" }
  ]
  },
  components: {
  EmptyListTile
  },
  async fetch({ store }) {
  },
  data() {
  return {
    title: "Clientes",
      headers: [
      { text: "Id Local", value: "nativeId" },
      { text: "Descripcion", value: "description" },
      { text: "Color", value: "color" },
      { text: "Icono", value: "icon" },
      { text: "Orden", value: "Order" },
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
    filter: "nativeId:{}*,description:{}*,color:{}*,icon:{}*",
    pageSizes: [20, 30, 50, 100],
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
        await this.$store.dispatch("saleStatuses/fetchSaleStatuses", params);
      }
    },
    search: {
      async handler() {
        try{
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
  
          await this.$store.dispatch("saleStatuses/fetchSaleStatuses", params);
        } catch (error) {
          this.showError(error);
        }
      }
    }
  },
  computed: {
    ...mapState("saleStatuses", ["saleStatuses", "page"])
  },
  methods: {
    /* 
    ...mapActions("clients", {
      deleteClientAction: "deleteClient"
    }), 
    */
    openAddClientDialog() {
      this.openSaveDialog = true;
      this.clientToSave = {
      type: { id: 0 },
      };
      this.dialogMode = "nuevo";
    },
    openEditClientDialog(client) {
      this.openSaveDialog = true;
      this.clientToSave = client;
      this.dialogMode = "editar";
    },
    async deleteClient(client) {
      try {
      const { name } = client;
      const res = await this.$confirm(
        `¿Está seguro de borrar al cliente '${name}'?`,
        { title: "Advertencia" }
      );
      if (res) {
        await this.deleteClientAction({ client });
        await this.$confirm("Borrado correcto!", {
        title: "Éxito",
        color: "success"
        });
      }
      } catch (error) {
      this.showError(error);
      }
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
