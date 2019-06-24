<template>
  <simple-table-layout>
    <template #title>
      <v-subheader>Listado de facturas</v-subheader>
    </template>
    <template #actions>
      <v-btn v-if="$isAllowed('organizePurchase')" color="accent" @click="openAddPurchaseInvoiceDialog">
        <v-icon small>fa-plus</v-icon>
        <span class="mx-1"></span>
        <span>Nueva factura</span>
      </v-btn>
    </template>
    <template #filters>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Búsqueda"
        box
        single-line
        clearable
        clear-icon="fa-times"
        hide-details
      ></v-text-field>
    </template>
    <template #table>
      <v-data-table 
        :headers="purchaseInvoiceHeaders" 
        :items="purchaseInvoices" 
        :search="search" 
        class="elevation-1">
        <template #items="{ item }">
          <td class="text-xs-left">{{ item.nativeId || "Sin identificador" }}</td>
          <td class="text-xs-left">{{ item.description || "Sin descripción" }}</td>
          <td class="text-xs-left">{{ formatDate(item.emissionDate) }}</td>
          <td class="text-xs-left">S/. {{ item.totalPrice }}</td>
          <td class="text-xs-center">
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
                icon
                flat
                small
                @click.stop="openEditPurchaseInvoiceDialog(item)"
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
                @click.stop="deletePurchaseInvoice(item)"
              >
                <v-icon small>fa-trash</v-icon>
              </v-btn>
            </v-speed-dial>
          </td>
        </template>
      </v-data-table>
    </template>
    <template #dialog>
      <save-purchase-invoice-dialog
        v-model="openSaveInvoiceDialog"
        :purchase-invoice="purchaseInvoiceToSave"
        :mode="dialogMode"
      ></save-purchase-invoice-dialog>
    </template>
  </simple-table-layout>
</template>

<script>
import EmptyListTile from "@/components/common/EmptyListTile";
import SavePurchaseInvoiceDialog from "@/components/purchaseOrders/SavePurchaseInvoiceDialog";
import { mapState, mapActions } from "vuex";
import moment from "moment";
import purchasePerimeter from '@/security/perimeters/purchase-perimeter';
export default {
  routePerimeterAction: 'viewPurchase',
  perimeters: [
    purchasePerimeter
  ],
  async fetch({ params: { purchaseOrderId }, route, store }) {
    await store.dispatch("purchaseOrders/details/fetchPurchaseOrder", {
      purchaseOrderId
    });
  },
  components: {
    EmptyListTile,
    SavePurchaseInvoiceDialog
  },
  data: () => ({
    purchaseInvoiceHeaders: [
      { text: "Id Local", value: "nativeId" },
      { text: "Descripción", value: "description" },
      { text: "Fecha de Emisión", value: "emissionDate" },
      { text: "Monto Total", value: "totalPrice" },
      { text: "Acciones", value: "id", align: "center", width: "10%", sortable: false }
    ],
    search: "",
    purchaseInvoiceToSave: {},
    openSaveInvoiceDialog: false,
    dialogMode: "nuevo"
  }),
  computed: {
    ...mapState("purchaseOrders/details", ["purchaseOrder"]),
    purchaseInvoices() {
      return this.purchaseOrder.invoices || [];
    }
  },
  methods: {
    ...mapActions("purchaseOrders/details", {
      deletePurchaseInvoiceAction: "deletePurchaseInvoice"
    }),
    formatDate(date) {
      if (date != undefined) return this.dateMoment(date).format("DD/MM/YYYY");
      return "";
    },
    dateMoment(date) {
      if (date != undefined) {
        const momentDate = moment(date);
        return momentDate.isValid() ? momentDate : moment.now();
      }
      return "";
    },
    openAddPurchaseInvoiceDialog() {
      this.openSaveInvoiceDialog = true;
      this.purchaseInvoiceToSave = {};
      this.dialogMode = "nuevo";
    },
    openEditPurchaseInvoiceDialog(purchaseInvoice) {
      this.openSaveInvoiceDialog = true;
      this.purchaseInvoiceToSave = purchaseInvoice;
      this.dialogMode = "editar";
    },
    async deletePurchaseInvoice(purchaseInvoice) {
      try {
        const res = await this.$confirm(`¿Está seguro de borrar la factura?`, {
          title: "Advertencia"
        });
        if (res) {
          await this.deletePurchaseInvoiceAction({ purchaseInvoice });

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
