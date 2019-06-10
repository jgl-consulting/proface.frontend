<template>
  <simple-table-layout>
    <template #title>
      <v-subheader>Listado de productos solicitados</v-subheader>
    </template>
    <template #actions>
      <v-btn color="accent" @click="openAddPurchaseDetailDialog">
        <v-icon small>fa-plus</v-icon>
        <span class="mx-1"></span>
        <span>Solicitar nuevo producto</span>
      </v-btn>
    </template>
    <template #table>
      <v-data-table :headers="purchaseDetailHeaders" :items="purchaseDetails" class="elevation-1">
        <template #items="{ item }">
          <td class="text-xs-left">{{ item.product.name }}</td>
          <td class="text-xs-left">{{ item.quantity }}</td>
          <td class="text-xs-left">{{ formatPrice(item.unitPrice) }}</td>
          <td class="text-xs-left">{{ formatPrice(item.purchasePrice) }}</td>
          <td class="text-xs-left">{{ formatPrice(item.disscount) }}</td>
          <td class="text-xs-left">{{ formatPrice(item.finalPrice) }}</td>
          <td class="text-xs-left">{{ 'S/. ' + item.localPrice }}</td>
          <td class="text-xs-left">
            <v-icon :color="getColor(item.status)" small>{{getIcon(item.status)}}</v-icon>
            {{item.status.description}}
          </td>
          <td class="text-xs-left">
            <v-btn
              class="mx-1"
              color="accent"
              dark
              icon
              flat
              small
              @click.stop="openEditPurchaseDetailDialog(item)"
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
              @click.stop="deletePurchaseDetail(item)"
            >
              <v-icon small>fa-trash</v-icon>
            </v-btn>
          </td>
        </template>
        <template #footer>
          <td class="text-sm-left" :colspan="purchaseDetailHeaders.length">
            <h3>Total: S/. {{ purchaseDetailAmount.toFixed(2) }}</h3>
          </td>
        </template>
      </v-data-table>
    </template>
    <template #dialog>
      <save-purchase-detail-dialog
        v-model="openSaveDetailDialog"
        :purchase-detail="purchaseDetailToSave"
        :mode="dialogMode"
      ></save-purchase-detail-dialog>
    </template>
  </simple-table-layout>
</template>

<script>
import EmptyListTile from "@/components/common/EmptyListTile";
import SavePurchaseDetailDialog from "@/components/purchaseOrders/SavePurchaseDetailDialog";
import { mapState, mapActions } from "vuex";

export default {
  async fetch({ params: { purchaseOrderId }, route, store }) {
    await store.dispatch("purchaseOrders/details/fetchPurchaseOrder", {
      purchaseOrderId
    });
    await store.dispatch("purchaseOrders/details/fetchProducts");
    await store.dispatch("purchaseOrders/details/fetchReceptionStatuses");
  },
  components: {
    EmptyListTile,
    SavePurchaseDetailDialog
  },
  data: () => ({
    purchaseDetailHeaders: [
      { text: "Producto", value: "product" },
      { text: "Cantidad", value: "quantity" },
      { text: "Precio Unitario", value: "unitPrice" },
      { text: "Precio Neto", value: "purchasePrice" },
      { text: "Descuento", value: "disscount" },
      { text: "Precio Final", value: "finalPrice" },
      { text: "Precio en Soles", value: "totalPrice" },
      { text: "Estado", value: "status" },
      { text: "Acciones", value: "id", sortable: false }
    ],
    purchaseDetailToSave: {
      status: { id: 0 },
      product: { id: 0 }
    },
    openSaveDetailDialog: false,
    dialogMode: "nuevo"
  }),
  computed: {
    ...mapState("purchaseOrders/details", ["purchaseOrder"]),
    purchaseDetails() {
      return this.purchaseOrder.details || [];
    },
    purchaseDetailAmount() {
      return this.purchaseDetails.reduce(
        (totalAmount, { localPrice }) =>
          totalAmount + localPrice,
        0
      );
    }
  },
  methods: {
    ...mapActions("purchaseOrders/details", {
      deletePurchaseDetailAction: "deletePurchaseDetail"
    }),
    formatPrice(price) {
      return this.purchaseOrder.currency.symbol + ' ' + price;
    },
    openAddPurchaseDetailDialog() {
      this.openSaveDetailDialog = true;
      this.purchaseDetailToSave = {
        status: { id: 0 },
        product: { id: 0 }
      };
      this.dialogMode = "nuevo";
    },
    openEditPurchaseDetailDialog(purchaseDetail) {
      this.openSaveDetailDialog = true;
      this.purchaseDetailToSave = purchaseDetail;
      this.dialogMode = "editar";
    },
    async deletePurchaseDetail(purchaseDetail) {
      try {
        const { product } = purchaseDetail;
        const res = await this.$confirm(
          `¿Está seguro de borrar el detalle del producto '${product.name}'?`,
          { title: "Advertencia" }
        );
        if (res) {
          await this.deletePurchaseDetailAction({ purchaseDetail });

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
    },
    getColor(status) {
      return status.color || "primary";
    },
    getIcon(status) {
      return status.icon || "fa fa-calendar";
    }
  }
};
</script>

<style>
</style>
