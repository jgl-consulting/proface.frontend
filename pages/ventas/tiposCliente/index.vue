<template>
  <simple-table-layout>
    <template #title>
      <h1>Tipos de Cliente</h1>
    </template>
    <template #actions>
      <v-btn color="accent" @click="openAddClientTypeDialog">
        <v-icon small>fa-plus</v-icon>
        <span class="mx-1">Nuevo Tipo de Cliente</span>
      </v-btn>
    </template>
    <template #filters>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Búsqueda"
        single-line
        box
        clearable
        clear-icon="fa-times"
        hide-details
      ></v-text-field>
    </template>
    <template #table>
      <v-data-table
        :headers="headers"
        :items="clientTypes"
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
            <td class="text-xs-left">{{ props.item.name || "Sin descripción" }}</td>
            <td class="text-xs-center" @click.stop="() => {}">
              <v-speed-dial direction="left" open-on-hover left>
                <template v-slot:activator>
                  <v-btn color="secondary" dark fab small>
                    <v-icon small>fa-wrench</v-icon>
                  </v-btn>
                </template>
                <v-btn
                  class="mx-1"
                  color="accent"
                  dark
                  fab
                  small
                  @click.stop="openEditClientTypeDialog(props.item)"
                >
                  <v-icon small>fa-pen</v-icon>
                </v-btn>
                <v-btn
                  class="mx-1"
                  color="deep-purple darken-2"
                  dark
                  fab
                  small
                  @click.stop="deleteClientType(props.item)"
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
      <save-client-type-dialog
        v-model="openSaveDialog"
        :clientType="clientTypeToSave"
        :mode="dialogMode"
      ></save-client-type-dialog>
    </template>
  </simple-table-layout>
</template>

<script>
import EmptyListTile from "@/components/common/EmptyListTile";
import SaveClientTypeDialog from "@/components/clientTypes/SaveClientTypeDialog";
import { mapState, mapActions } from "vuex";
export default {
  meta: {
    breadcrumbs: [
      { name: "Módulos", link: "/" },
      { name: "Tipos de Cliente", link: "/ventas/tiposCliente" }
    ]
  },
  components: {
    EmptyListTile,
    SaveClientTypeDialog
  },
  async fetch({ store }) {
  },
  data() {
    return {
      title: "Tipos de Cliente",
      headers: [
        { text: "Descripción", align: "left", value: "name" },
        { text: "Acciones", align: "center", value: "id", width: "10%", sortable: false }
      ],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 20, // -1 for All",
        sortBy: "id"
      },
      expand: false,
      search: "",
      filter: "name:{}*",
      pageSizes: [20, 30, 50, 100],
      clientTypeToSave: {},
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
        await this.$store.dispatch("clientTypes/fetchClientTypes", params);
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
        await this.$store.dispatch("clientTypes/fetchClientTypes", params);
      }
    }
  },
  computed: {
    ...mapState("clientTypes", ["clientTypes", "page"])
  },
  methods: {
    ...mapActions("clientTypes", {
      deleteClientTypeAction: "deleteClientType"
    }),
    openAddClientTypeDialog() {
      this.openSaveDialog = true;
      this.clientTypeToSave = {};
      this.dialogMode = "nuevo";
    },
    openEditClientTypeDialog(clientType) {
      this.openSaveDialog = true;
      this.clientTypeToSave = clientType;
      this.dialogMode = "editar";
    },
    async deleteClientType(clientType) {
      try {
        const { name } = clientType;
        const res = await this.$confirm(
          `¿Está seguro de borrar el tipo '${name}'?`,
          { title: "Advertencia" }
        );
        if (res) {
          await this.deleteClientTypeAction({ clientType });
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
  }
};
</script>

