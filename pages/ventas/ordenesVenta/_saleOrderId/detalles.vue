<template>
  <simple-table-layout>
    <template #title>
      <v-subheader>Listado de detalle</v-subheader>
    </template>
    <template #actions>
      <v-btn v-if="$isAllowed('organizeSale')" color="accent" @click="openAddSaleDetailDialog">
        <v-icon small>fa-plus</v-icon>
        <span class="mx-1"></span>
        <span>Nuevo detalle</span>
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
        :headers="saleDetailHeaders" 
        :items="saleDetails" 
        :search="search" 
        class="elevation-1">
        <template #items="{ item }">
          <td class="text-xs-left">{{ $_.get(item.product, "name", "Sin producto") }}</td>
          <td class="text-xs-left">{{ item.quantity }}</td>
          <td class="text-xs-left">{{ formatPrice(item.unitPrice) }}</td>
          <td class="text-xs-left">{{ formatPrice(item.salePrice) }}</td>
          <td class="text-xs-left">{{ formatPrice(item.disscount) }}</td>
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
                @click.stop="openEditSaleDetailDialog(item)"
              >
                <v-icon small>fa-pen</v-icon>
              </v-btn>
              <v-btn
                class="mx-1"
                color="deep-purple darken-2"
                dark
                fab
                small
                @click.stop="deleteSaleDetail(item)"
              >
                <v-icon small>fa-trash</v-icon>
              </v-btn>
            </v-speed-dial>
          </td>
        </template>
        <template #footer>
          <td class="text-sm-left" :colspan="saleDetailHeaders.length">
            <h3>Total: S/. {{ saleDetailAmount | twoDecimals }}</h3>
          </td>
        </template>
      </v-data-table>
    </template>
    <template #dialog>
      <save-sale-detail-dialog
        v-model="openSaveDetailDialog"
        :sale-detail="saleDetailToSave"
        :mode="dialogMode"
      ></save-sale-detail-dialog>
    </template>
  </simple-table-layout>
</template>

<script>
import EmptyListTile from "@/components/common/EmptyListTile";
import SaveSaleDetailDialog from "@/components/saleOrders/SaveSaleDetailDialog";
import { mapState, mapActions } from "vuex";
import salePerimeter from '@/security/perimeters/sale-perimeter';
export default {
  routePerimeterAction: 'viewSale',
  perimeters: [
    salePerimeter
  ],
  async fetch({ params: { saleOrderId }, route, store }) {
    await store.dispatch("saleOrders/details/fetchSaleOrder", {
      saleOrderId
    });
    await store.dispatch("saleOrders/details/fetchProducts");
  },
  components: {
    EmptyListTile,
    SaveSaleDetailDialog
  },
  data: () => ({
    saleDetailHeaders: [
      { text: "Producto", value: "product" },
      { text: "Cantidad", value: "quantity" },
      { text: "Precio Unitario", value: "unitPrice" },
      { text: "Precio Neto", value: "salePrice" },
      { text: "Descuento", value: "disscount" },
      { text: "Precio en Soles", value: "localPrice" },
      { text: "Estado", value: "status" },
      { text: "Acciones", value: "id", width: "10%", sortable: false }
    ],
    saleDetailToSave: {
      status: { id: 0 },
      product: { id: 0 }
    },
    search: "",
    openSaveDetailDialog: false,
    dialogMode: "nuevo"
  }),
  computed: {
    ...mapState("saleOrders/details", ["saleOrder"]),
    saleDetails() {
      return this.saleOrder.details || [];
    },
    saleDetailAmount() {
      return this.saleDetails.reduce(
        (totalAmount, { localPrice }) => totalAmount + localPrice,
        0
      );
    }
  },
  methods: {
    ...mapActions("saleOrders/details", {
      deleteSaleDetailAction: "deleteSaleDetail"
    }),
    formatPrice(price) {
      return this.saleOrder.currency
        ? this.saleOrder.currency.symbol + " " + price
        : price;
    },
    openAddSaleDetailDialog() {
      this.openSaveDetailDialog = true;
      this.saleDetailToSave = {
        status: { id: 0, order: 0 },
        product: { id: 0 }
      };
      this.dialogMode = "nuevo";
    },
    openEditSaleDetailDialog(saleDetail) {
      this.openSaveDetailDialog = true;
      this.saleDetailToSave = saleDetail;
      this.dialogMode = "editar";
    },
    async deleteSaleDetail(saleDetail) {
      try {
        const { product } = saleDetail;
        const res = await this.$confirm(
          `¿Está seguro de borrar el detalle del producto '${product.name}'?`,
          { title: "Advertencia" }
        );
        if (res) {
          await this.deleteSaleDetailAction({ saleDetail });

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