<template>
  <simple-table-layout>
    <template #title>
      <h1>Estados de Unidad</h1>
    </template>
    <template #actions>
      <v-btn color="accent" @click="openAddUnitStatusDialog">
        <v-icon small>fa-plus</v-icon>
        <span class="mx-1">Nuevo Estado</span>
      </v-btn>
    </template>
    <template #table>
      <v-data-table
        :headers="headers"
        :items="unitStatuses"
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
            <td class="text-xs-left">{{ props.item.nativeId || "Sin identificador" }}</td>
            <td class="text-xs-left">{{ props.item.description || "Sin descripción" }}</td>
            <td class="text-xs-center">
              <v-icon :color="props.item.color || 'primary'">fa-circle</v-icon>
            </td>
            <td class="text-xs-center">
              <v-icon>{{props.item.icon || 'fa fa-calendar'}}</v-icon>
            </td>
            <td class="text-xs-center" @click.stop="() => {}">
              <v-btn
                class="mx-1"
                color="accent"
                dark
                icon
                flat
                small
                @click.stop="openEditUnitStatusDialog(props.item)"
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
                @click.stop="deleteUnitStatus(props.item)"
              >
                <v-icon small>fa-trash</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </template>
    <template #dialog>
      <save-unit-status-dialog
        v-model="openSaveDialog"
        :unitStatus="unitStatusToSave"
        :mode="dialogMode"
      ></save-unit-status-dialog>
    </template>
  </simple-table-layout>
</template>

<script>
import EmptyListTile from "@/components/common/EmptyListTile";
import SaveUnitStatusDialog from "@/components/unitStatuses/SaveUnitStatusDialog";
import { mapState, mapActions } from "vuex";
export default {
  meta: {
    breadcrumbs: [
      { name: "Módulos", link: "/" },
      { name: "Estados de Unidad", link: "/almacen/estadosUnidad" }
    ]
  },
  components: {
    EmptyListTile,
    SaveUnitStatusDialog
  },
  async fetch({ store }) {},
  data() {
    return {
      title: "Estados de Unidad",
      headers: [
        { text: "Id Local", align: "left", value: "nativeId" },
        { text: "Descripción", align: "left", value: "description" },
        { text: "Color", align: "center", value: "color" },
        { text: "Ícono", align: "center", value: "icon" },
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
      unitStatusToSave: {},
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
        await this.$store.dispatch("unitStatuses/fetchUnitStatuses", params);
      }
    }
  },
  computed: {
    ...mapState("unitStatuses", ["unitStatuses", "page"])
  },
  methods: {
    ...mapActions("unitStatuses", {
      deleteUnitStatusAction: "deleteUnitStatus"
    }),
    openAddUnitStatusDialog() {
      this.openSaveDialog = true;
      this.unitStatusToSave = {};
      this.dialogMode = "nuevo";
    },
    openEditUnitStatusDialog(unitStatus) {
      this.openSaveDialog = true;
      this.unitStatusToSave = unitStatus;
      this.dialogMode = "editar";
    },
    async deleteUnitStatus(unitStatus) {
      try {
        const { nativeId } = unitStatus;
        const res = await this.$confirm(
          `¿Está seguro de borrar el estado '${nativeId}'?`,
          { title: "Advertencia" }
        );
        if (res) {
          await this.deleteUnitStatusAction({ unitStatus });
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

