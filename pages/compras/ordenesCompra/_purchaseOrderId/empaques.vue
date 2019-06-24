<template>
  <div v-if="isReceived()">
  <simple-table-layout>
    <template #title>
      <v-subheader>Listado de empaques recibidos</v-subheader>
    </template>
    <template #actions>
      <v-btn v-if="$isAllowed('organizePurchase')" 
        color="accent" 
        to="/almacen/empaques/nuevoEmpaque" 
        nuxt
      >
        <v-icon small>fa-plus</v-icon>
        <span class="mx-1">Nuevo empaque</span>
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
        :headers="batchHeaders" 
        :items="batches" 
        :search="search" 
        class="elevation-1">
        <template #items="{ item }">
          <td class="text-xs-left">{{ item.nativeId || "Sin ID" }}</td>
          <td class="text-xs-left">{{ formatDate(item.entryDate) }}</td>
          <td class="text-xs-left">{{ formatDate(item.expirationDate) }}</td>
          <td class="text-xs-left">{{ $_.get(item.type, "description", "Sin tipo") }}</td>
        </template>
      </v-data-table>
    </template>
  </simple-table-layout>
  </div>
  <div v-else>
    <v-subheader>
      <strong>La orden de compra aún no ha sido recibida</strong>
    </v-subheader>
  </div>
</template>

<script>
import EmptyListTile from "@/components/common/EmptyListTile";
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
  },
  data: () => ({
    batchHeaders: [
      { text: "ID local", value: "nativeId" },
      { text: "Fecha de Entrada", value: "entryDate" },
      { text: "Fecha de Vencimiento", value: "expirationDate" },
      { text: "Tipo", value: "type" },
    ],
    search: "",
  }),
  computed: {
    ...mapState("purchaseOrders/details", ["purchaseOrder"]),
    batches() {
      return this.purchaseOrder.batches || [];
    },
  },
  methods: {
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
    isReceived() {
      let status = this.purchaseOrder.status;
      if (status) {
        return status.nativeId == "RE";
      } else {
        return false;
      }
    }
  }
};
</script>

<style>
</style>
