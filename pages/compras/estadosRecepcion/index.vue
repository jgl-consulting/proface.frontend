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
        :items="receptionStatuses"
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
            <td class="text-xs-center">
              <v-icon :color="props.item.color || 'primary'">fa-circle</v-icon>
            </td>
            <td class="text-xs-center">
              <v-icon>{{props.item.icon || 'fa fa-calendar'}}</v-icon>
            </td>
            <td class="text-xs-center" @click.stop="() => {}">
              <v-speed-dial direction="left" open-on-hover>
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
                  @click.stop="openEditReceptionStatusDialog(props.item)"
                >
                  <v-icon small>fa-pen</v-icon>
                </v-btn>
                <v-btn
                  class="mx-1"
                  color="deep-purple darken-2"
                  dark
                  fab
                  small
                  @click.stop="deleteReceptionStatus(props.item)"
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

import purchasePerimeter from '@/security/perimeters/purchase-perimeter';
export default {
  routePerimeterAction: 'viewPurchase',
  perimeters: [
    purchasePerimeter
  ],
  meta: {
    breadcrumbs: [
      { name: "Módulos", link: "/" },
      { name: "Estados de Recepción", link: "/compras/estadosRecepcion" }
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
        { text: "Id Local", align: "left", value: "nativeId" },
        { text: "Descripción", align: "left", value: "description" },
        { text: "Color", align: "center", value: "color" },
        { text: "Ícono", align: "center", value: "icon" },
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
      filter: "nativeId:{}*,description:{}*",
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
        await this.$store.dispatch(
          "receptionStatuses/fetchReceptionStatuses",
          params
        );
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
        await this.$store.dispatch(
          "receptionStatuses/fetchReceptionStatuses",
          params
        );
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