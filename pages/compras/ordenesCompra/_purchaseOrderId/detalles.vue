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
        :headers="purchaseDetailHeaders" 
        :items="purchaseDetails" 
        :search="search" 
        class="elevation-1">
        <template #items="{ item }">
          <td class="text-xs-left">{{ $_.get(item.product, "name", "Sin producto") }}</td>
          <td class="text-xs-left">{{ item.quantity }}</td>
          <td class="text-xs-left">{{ formatPrice(item.unitPrice) }}</td>
          <td class="text-xs-left">{{ formatPrice(item.purchasePrice) }}</td>
          <td class="text-xs-left">{{ formatPrice(item.disscount) }}</td>
          <td class="text-xs-left">{{ formatPrice(item.finalPrice) }}</td>
          <td class="text-xs-left">{{ 'S/. ' + item.localPrice }}</td>
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
                @click.stop="openEditPurchaseDetailDialog(item)"
              >
                <v-icon small>fa-pen</v-icon>
              </v-btn>
              <v-btn
                class="mx-1"
                color="deep-purple darken-2"
                dark
                fab
                small
                @click.stop="deletePurchaseDetail(item)"
              >
                <v-icon small>fa-trash</v-icon>
              </v-btn>
            </v-speed-dial>
          </td>
        </template>
        <template #footer>
          <td class="text-sm-left" :colspan="purchaseDetailHeaders.length">
            <h3>Total: S/. {{ purchaseDetailAmount | twoDecimals }}</h3>
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
      { text: "Acciones", value: "id", width: "10%", sortable: false }
    ],
    purchaseDetailToSave: {
      status: { id: 0 },
      product: { id: 0 }
    },
    search: "",
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
        (totalAmount, { localPrice }) => totalAmount + localPrice,
        0
      );
    }
  },
  methods: {
    ...mapActions("purchaseOrders/details", {
      deletePurchaseDetailAction: "deletePurchaseDetail"
    }),
    formatPrice(price) {
      return this.purchaseOrder.currency
        ? this.purchaseOrder.currency.symbol + " " + price
        : price;
    },
    openAddPurchaseDetailDialog() {
      this.openSaveDetailDialog = true;
      this.purchaseDetailToSave = {
        status: { id: 0, order: 0 },
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
    }
  }
};
</script>

<style>
</style>
