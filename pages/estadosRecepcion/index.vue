<template>
  <simple-table-layout>
    <template #title>
      <h1>Estados de Recepción</h1>
    </template>
    <template #actions>
      <v-btn color="accent" @click="openAddReceptionStatusDialog">
        <v-icon small>fa-plus</v-icon>
        <span class="mx-1">Nuevo Estado</span>
      </v-btn>
    </template>
    <template #table>
      <v-data-table
        :headers="headers"
        :items="receptionStatuses"
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
            <td class="text-xs-left">{{ props.item.description }}</td>
            <td class="text-xs-center"><v-icon :color="props.item.color">fa-circle</v-icon></td>
            <td class="text-xs-center"><v-icon>{{props.item.icon}}</v-icon></td>
            <td class="text-xs-center" @click.stop="() => {}">
              <v-btn
                class="mx-1"
                color="accent"
                dark
                icon
                flat
                small
                @click.stop="openEditReceptionStatusDialog(props.item)"
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
                @click.stop="deleteReceptionStatus(props.item)"
              >
                <v-icon small>fa-trash</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </template>
    <template #dialog>
      <save-reception-status-dialog
        v-model="openSaveDialog"
        :reception-status="receptionStatusToSave"
        :mode="dialogMode"
      ></save-reception-status-dialog>
    </template>
  </simple-table-layout>
</template>

<script>
import EmptyListTile from "@/components/common/EmptyListTile";
import SaveReceptionStatusDialog from "@/components/receptionStatuses/SaveReceptionStatusDialog";
import { mapState, mapActions } from "vuex";
export default {
  meta: {
    breadcrumbs: [
      { name: "Módulos", link: "/" },
      { name: "Estados de Recepción", link: "/estadosRecepcion" }
    ]
  },
  components: {
    EmptyListTile,
    SaveReceptionStatusDialog
  },
  async fetch({ store }) {
    //const params = { requestPage: 0, size: 20, sortBy: undefined };
    //await store.dispatch("receptionStatuses/fetchReceptionStatuses", params);
  },
  data() {
    return {
      title: "Estados de Recepción",
      headers: [
        { text: "Id", align: "left", value: "id" },
        { text: "Id Local", align: "left", value: "nativeId" },
        { text: "Descripción", align: "left", value: "description" },
        { text: "Color", align: "center", value: "color" },
        { text: "Ícono", align: "center", value: "icon"},
        { text: "Acciones", align: "center", value: "id", sortable: false }
      ],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 20, // -1 for All",
        sortBy: "id"
      },
      expand: false,
      pageSizes: [20, 30, 50, 100],
      receptionStatusToSave: {},
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
        await this.$store.dispatch("receptionStatuses/fetchReceptionStatuses", params);
      }
    }
  },
  computed: {
    ...mapState("receptionStatuses", ["receptionStatuses", "page"])
  },
  methods: {
    ...mapActions("receptionStatuses", {
      deleteReceptionStatusAction: "deleteReceptionStatus"
    }),
    openAddReceptionStatusDialog() {
      this.openSaveDialog = true;
      this.receptionStatusToSave = {};
      this.dialogMode = "nuevo";
    },
    openEditReceptionStatusDialog(receptionStatus) {
      this.openSaveDialog = true;
      this.receptionStatusToSave = receptionStatus;
      this.dialogMode = "editar";
    },
    async deleteReceptionStatus(receptionStatus) {
      try {
        const { description } = receptionStatus;
        const res = await this.$confirm(
          `¿Está seguro de borrar el estado '${description}'?`,
          { title: "Advertencia" }
        );
        if (res) {
          await this.deleteReceptionStatusAction({ receptionStatus });
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