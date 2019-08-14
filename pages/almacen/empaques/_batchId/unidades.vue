<template>
  <simple-table-layout>
    <template #title>
      <v-subheader>Listado de unidades</v-subheader>
    </template>
    <template #actions>
      <v-btn  v-if="$isAllowed('organizeWarehouse')" color="accent" @click="openAddUnitDialog">
        <v-icon small>fa-plus</v-icon>
        <span class="mx-1"></span>
        <span>Nueva unidad</span>
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
        :headers="unitHeaders" 
        :items="units" 
        :search="search" 
        class="elevation-1">
        <template #items="{ item }">
          <td class="text-xs-left">{{ item.nativeId || "Sin identificador" }}</td>
          <td class="text-xs-left">{{ $_.get(item.product, "name", "Sin producto") }}</td>
          <td class="text-xs-left">{{ $_.get(item.location, "description", "Sin ubicación") }}</td>
          <td class="text-xs-left">
            <v-icon
              :color='$_.get(item.status, "color", "primary")'
              small
            >{{$_.get(item.status, "icon", "fa fa-calendar")}}</v-icon>
            {{ $_.get(item.status, "description", "Sin estado") }}
          </td>
          <td class="text-xs-left">
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
                @click.stop="openEditUnitDialog(item)"
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
                @click.stop="deleteUnit(item)"
              >
                <v-icon small>fa-trash</v-icon>
              </v-btn>
            </v-speed-dial>
          </td>
        </template>
      </v-data-table>
    </template>
    <template #dialog>
      <save-unit-dialog
        v-model="openSaveUnitDialog"
        :unit="unitToSave"
        :mode="dialogMode"
      ></save-unit-dialog>
    </template>
  </simple-table-layout>
</template>

<script>
import EmptyListTile from "@/components/common/EmptyListTile";
import SaveUnitDialog from "@/components/batches/SaveUnitDialog";
import { mapState, mapActions } from "vuex";

import warehousePerimeter from '@/security/perimeters/warehouse-perimeter';
export default {
  routePerimeterAction: 'viewWarehouse',
  perimeters: [
    warehousePerimeter
  ],
  async fetch({ params: { batchId }, route, store }) {
    await store.dispatch("batches/details/fetchBatch", {
      batchId
    });
    await store.dispatch("batches/details/fetchProducts");
    await store.dispatch("batches/details/fetchLocations");
    await store.dispatch("batches/details/fetchUnitStatuses")
  },
  components: {
    EmptyListTile,
    SaveUnitDialog
  },
  data: () => ({
    unitHeaders: [
      { text: "Identificador", value: "nativeId" },
      { text: "Producto", value: "product" },
      { text: "Ubicación", value: "location" },
      { text: "Estado", value: "status" },
      { text: "Acciones", value: "id", width: "10%", sortable: false }
    ],
    unitToSave: {
      status: { id: 0 },
      product: { id: 0 },
      location: { id: 0 }
    },
    search: "",
    openSaveUnitDialog: false,
    dialogMode: "nuevo"
  }),
  computed: {
    ...mapState("batches/details", ["batch"]),
    units() {
      return this.batch.units || [];
    },
  },
  methods: {
    ...mapActions("batches/details", {
      deleteUnitAction: "deleteUnit"
    }),
    openAddUnitDialog() {
      this.openSaveUnitDialog = true;
      this.unitToSave = {
        product: { id: 0 },
        location: { id : 0 }
      };
      this.dialogMode = "nuevo";
    },
    openEditUnitDialog(unit) {
      this.openSaveUnitDialog = true;
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
    showError(error) {
      const { message, errors } = this.$_.get(error, "response.data", {
        message: "Error inesperado",
        errors: [error.message]
      });

      this.$confirm(errors.map(e => e.errorMessage).join("\n"), {
        title: message,
        color: "error",
        width: 500
      });
    }
  }
};
</script>

<style>
</style>
