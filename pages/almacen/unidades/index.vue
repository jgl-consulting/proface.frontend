<template>
  <simple-table-layout>
    <template #title>
      <h1>Unidades</h1>
    </template>
    <template #actions>
      <v-btn color="accent" @click="openAddUnitDialog">
        <v-icon small>fa-plus</v-icon>
        <span class="mx-1">Nueva Unidad</span>
      </v-btn>
    </template>
    <template #table>
      <v-data-table
        :headers="headers"
        :items="units"
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
            <td class="text-xs-left">{{ $_.get(props.item.product, "description", "Sin producto") }}</td>
            <td
              class="text-xs-left"
            >{{ $_.get(props.item.location, "description", "Sin ubicación") }}</td>
            <td class="text-xs-left">{{ $_.get(props.item.batch, "nativeId", "Sin empaque") }}</td>
            <td class="text-xs-left">
              <v-icon
                :color='$_.get(props.item.status, "color", "primary")'
                small
              >{{$_.get(props.item.status, "icon", "fa fa-play-circle")}}</v-icon>
              {{ $_.get(props.item.status, "description", "Sin estado") }}
            </td>
            <td class="text-xs-center" @click.stop="() => {}">
              <v-btn
                class="mx-1"
                color="accent"
                dark
                icon
                flat
                small
                @click.stop="openEditUnitDialog(props.item)"
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
                @click.stop="deleteUnit(props.item)"
              >
                <v-icon small>fa-trash</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </template>
    <template #dialog>
      <save-unit-dialog v-model="openSaveDialog" :unit="unitToSave" :mode="dialogMode"></save-unit-dialog>
    </template>
  </simple-table-layout>
</template>

<script>
import EmptyListTile from "@/components/common/EmptyListTile";
import SaveUnitDialog from "@/components/units/SaveUnitDialog";
import { mapState, mapActions } from "vuex";
export default {
  meta: {
    breadcrumbs: [
      { name: "Módulos", link: "/" },
      { name: "Unidades", link: "/almacen/unidades" }
    ]
  },
  components: {
    EmptyListTile,
    SaveUnitDialog
  },
  async fetch({ store }) {},
  data() {
    return {
      title: "Ubicaciones",
      headers: [
        { text: "Id Local", align: "left", value: "nativeId" },
        { text: "Producto", align: "left", value: "product" },
        { text: "Ubicación", align: "left", value: "location" },
        { text: "Empaque", align: "left", value: "batch" },
        { text: "Estado", align: "left", value: "status" },
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
      unitToSave: {},
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
        await this.$store.dispatch("units/fetchUnits", params);
      }
    }
  },
  computed: {
    ...mapState("units", ["units", "page"])
  },
  methods: {
    ...mapActions("units", {
      deleteUnitAction: "deleteUnit"
    }),
    openAddUnitDialog() {
      this.openSaveDialog = true;
      this.unitToSave = {};
      this.dialogMode = "nuevo";
    },
    openEditUnitDialog(unit) {
      this.openSaveDialog = true;
      this.unitToSave = unit;
      this.dialogMode = "editar";
    },
    async deleteUnit(unit) {
      try {
        const { nativeId } = unit;
        const res = await this.$confirm(
          `¿Está seguro de borrar la unidad '${nativeId}'?`,
          { title: "Advertencia" }
        );
        if (res) {
          await this.deleteUnitAction({ unit });
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

