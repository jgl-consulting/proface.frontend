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
      <v-data-table :headers="purchaseCostHeaders" :items="purchaseCosts" :search="search" class="elevation-1">
        <template #items="{ item }">
          <td class="text-xs-left">{{ item.description || "Sin descripción" }}</td>
          <td class="text-xs-left">{{ $_.get(item.currency, "symbol", "S/.") + ' ' + item.totalCost }}</td>
          <td class="text-xs-left">{{ 'S/. ' + item.localCost }}</td>
          <td class="text-xs-center">
            <v-speed-dial direction="left" open-on-hover>
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
            </v-speed-dial>
          </td>
        </template>
        <template #footer>
          <td class="text-sm-left" :colspan="purchaseCostHeaders.length">
            <h3>Total: S/. {{ purchaseCostAmount | twoDecimals }}</h3>
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
    await store.dispatch("purchaseOrders/details/fetchCurrencies");
  },
  components: {
    EmptyListTile,
    SavePurchaseCostDialog
  },
  data: () => ({
    purchaseCostHeaders: [
      { text: "Descripción", value: "description" },
      { text: "Monto", value: "totalCost" },
      { text: "Monto en Soles", value: "localCost" },
      { text: "Acciones", value: "id", align: "center", width: "10%", sortable: false }
    ],
    purchaseCostToSave: {
      currency: { id: 0 }
    },
    search: "",
    openSaveCostDialog: false,
    dialogMode: "nuevo"
  }),
  computed: {
    ...mapState("purchaseOrders/details", ["purchaseOrder"]),
    purchaseCosts() {
      return this.purchaseOrder.costs || [];
    },
    purchaseCostAmount() {
      return this.purchaseCosts.reduce(
        (totalAmount, { localCost }) => totalAmount + localCost,
        0
      );
    }
  },
  methods: {
    ...mapActions("purchaseOrders/details", {
      deletePurchaseCostAction: "deletePurchaseCost"
    }), 
    openAddPurchaseCostDialog() {
      this.openSaveCostDialog = true;
      this.purchaseCostToSave = {
        currency: { id: 0 }
      };
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
