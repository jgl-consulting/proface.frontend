<template>
  <simple-table-layout>
    <template #title>
      <v-subheader>Listado de costos</v-subheader>
    </template>
    <template #actions>
      <v-btn color="accent" @click="openAddPurchaseCostDialog">
        <v-icon small>fa-plus</v-icon>
        <span class="mx-1"></span>
        <span>Nuevo costo</span>
      </v-btn>
    </template>
    <template #table>
      <v-data-table :headers="purchaseCostHeaders" :items="purchaseCosts" class="elevation-1">
        <template #items="{ item }">
          <td class="text-xs-left">{{ item.id }}</td>
          <td class="text-xs-left">{{ item.description }}</td>
          <td class="text-xs-left">{{ item.totalCost }}</td>
          <td class="text-xs-center">
            <v-btn
              class="mx-1"
              color="accent"
              dark
              icon
              flat
              small
              @click.stop="openEditPurchaseCostDialog(item)"
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
              @click.stop="deletePurchaseCost(item)"
            >
              <v-icon small>fa-trash</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </template>
    <template #dialog>
      <save-purchase-cost-dialog
        v-model="openSaveCostDialog"
        :purchase-cost="purchaseCostToSave"
        :mode="dialogMode"
      ></save-purchase-cost-dialog>
    </template>
  </simple-table-layout>
</template>

<script>
import EmptyListTile from "@/components/common/EmptyListTile";
import SavePurchaseCostDialog from "@/components/purchaseOrders/SavePurchaseCostDialog";
import { mapState, mapActions } from "vuex";

export default {
  async fetch({ params: { purchaseOrderId }, route, store }) {
    await store.dispatch("purchaseOrders/details/fetchPurchaseOrder", {
      purchaseOrderId
    });
  },
  components: {
    EmptyListTile,
    SavePurchaseCostDialog
  },
  data: () => ({
    purchaseCostHeaders: [
      { text: "Id", value: "id" },
      { text: "Descripción", value: "description" },
      { text: "Monto", value: "totalCost" },
      { text: "Acciones", value: "id", align: "center", sortable: false }
    ],
    purchaseCostToSave: {},
    openSaveCostDialog: false,
    dialogMode: "nuevo"
  }),
  computed: {
    ...mapState("purchaseOrders/details", ["purchaseOrder"]),
    purchaseCosts() {
      return this.purchaseOrder.costs || [];
    }
  },
  methods: {
    ...mapActions("purchaseOrders/details", {
      deletePurchaseCostAction: "deletePurchaseCost"
    }),
    openAddPurchaseCostDialog() {
      this.openSaveCostDialog = true;
      this.purchaseCostToSave = {};
      this.dialogMode = "nuevo";
    },
    openEditPurchaseCostDialog(purchaseCost) {
      this.openSaveCostDialog = true;
      this.purchaseCostToSave = purchaseCost;
      this.dialogMode = "editar";
    },
    async deletePurchaseCost(purchaseCost) {
      try {
        const res = await this.$confirm(`¿Está seguro de borrar el costo?`, {
          title: "Advertencia"
        });
        if (res) {
          await this.deletePurchaseCostAction({ purchaseCost });

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
