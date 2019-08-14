<template>
  <v-layout row wrap>
    <v-flex md6 px-2>
      <model-detail title="Información" :fields="purchaseOrderFields" :model="purchaseOrder"></model-detail>
    </v-flex>
    <v-flex md6 px-2>
      <v-subheader>Estado</v-subheader>
      <model-timeline emptyTitle="La orden de compra no tiene seguimiento" :model="purchaseTraces"></model-timeline>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from "vuex";
import ModelDetail from "@/components/common/ModelDetail";
import ModelTimeline from "@/components/common/ModelTimeline";
import moment from "moment";
import purchasePerimeter from '@/security/perimeters/purchase-perimeter';
export default {
  routePerimeterAction: 'viewPurchase',
  perimeters: [
    purchasePerimeter
  ],
  async fetch({ params: { purchaseOrderId }, route, store }) {
    const fetchPurchaseOrderAction =
      "purchaseOrders/details/fetchPurchaseOrder";
    await store.dispatch(fetchPurchaseOrderAction, { purchaseOrderId });
  },
  components: {
    ModelDetail,
    ModelTimeline
  },
  data() {
    return {
      purchaseOrderFields: [
        { key: "nativeId", title: "Código local", icon: "fa-id-card-alt" },
        { 
          key: "creationDate", 
          title: "Fecha de Creación", 
          icon: "fa-calendar",
          render: creationDate => this.formatDate(creationDate)
        },
        {
          key: "supplier",
          title: "Proveedor",
          icon: "fa-truck",
          render: supplier => supplier ? supplier.name : "Sin proveedor"
        },
        { key: "total", title: "Total", icon: "fa-coins" },
        { key: "localTotal", title: "Total en Soles", icon: "fa-coins" }
      ]
    };
  },
  computed: {
    ...mapState("purchaseOrders/details", ["purchaseOrder"]),
    purchaseTraces() {
      return this.purchaseOrder.traces;
    }
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
  }
};
</script>
<style>
.v-subheader {
  text-transform: uppercase !important;
}
</style>
