<template>
  <simple-table-layout>
    <template #title>
      <h1>Ubicaciones</h1>
    </template>
    <template #actions>
      <v-btn color="accent" @click="openAddLocationDialog">
        <v-icon small>fa-plus</v-icon>
        <span class="mx-1">Nueva Ubicación</span>
      </v-btn>
    </template>
    <template #filters>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Búsqueda"
        single-line
        clearable
        clear-icon="fa-times"
        hide-details
      ></v-text-field>
    </template>
    <template #table>
      <v-data-table
        :headers="headers"
        :items="locations"
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
            <td class="text-xs-center" @click.stop="() => {}">
              <v-speed-dial direction="left" open-on-hover left>
                <template v-slot:activator>
                  <v-btn color="secondary" dark icon flat small>
                    <v-icon small>fa-wrench</v-icon>
                  </v-btn>
                </template>
                <v-btn
                  class="mx-1"
                  color="accent"
                  dark
                  icon
                  flat
                  small
                  @click.stop="openEditLocationDialog(props.item)"
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
                  @click.stop="deleteLocation(props.item)"
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
      <save-location-dialog
        v-model="openSaveDialog"
        :location="locationToSave"
        :mode="dialogMode"
      ></save-location-dialog>
    </template>
  </simple-table-layout>
</template>

<script>
import EmptyListTile from "@/components/common/EmptyListTile";
import SaveLocationDialog from "@/components/locations/SaveLocationDialog";
import { mapState, mapActions } from "vuex";
export default {
  meta: {
    breadcrumbs: [
      { name: "Módulos", link: "/" },
      { name: "Ubicaciones", link: "/almacen/ubicaciones" }
    ]
  },
  components: {
    EmptyListTile,
    SaveLocationDialog
  },
  async fetch({ store }) {
  },
  data() {
    return {
      title: "Ubicaciones",
      headers: [
        { text: "Id Local", align: "left", value: "nativeId" },
        { text: "Descripción", align: "left", value: "description" },
        { text: "Acciones", align: "center", value: "id", width:"10%", sortable: false }
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
      locationToSave: {},
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
        await this.$store.dispatch("locations/fetchLocations", params);
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
        await this.$store.dispatch("locations/fetchLocations", params);
      }
    }
  },
  computed: {
    ...mapState("locations", ["locations", "page"])
  },
  methods: {
    ...mapActions("locations", {
      deleteLocationAction: "deleteLocation"
    }),
    openAddLocationDialog() {
      this.openSaveDialog = true;
      this.locationToSave = {};
      this.dialogMode = "nuevo";
    },
    openEditLocationDialog(location) {
      this.openSaveDialog = true;
      this.locationToSave = location;
      this.dialogMode = "editar";
    },
    async deleteLocation(location) {
      try {
        const { nativeId } = location;
        const res = await this.$confirm(
          `¿Está seguro de borrar la ubicación '${nativeId}'?`,
          { title: "Advertencia" }
        );
        if (res) {
          await this.deleteLocationAction({ location });
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

