<template>
  <v-layout row wrap>
    <v-flex md6 px-2>
      <model-detail title="Información" :fields="purchaseOrderFields" :model="purchaseOrder"></model-detail>
    </v-flex>
    <v-flex md6 px-2>
      <v-subheader>Estado</v-subheader>
      <model-timeline :fields="stateFields" :model="purchaseOrder"></model-timeline>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from "vuex";
import ModelDetail from "@/components/common/ModelDetail";
import ModelTimeline from "@/components/common/ModelTimeline";
export default {
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
          key: "supplier",
          title: "Proveedor",
          icon: "fa-truck",
          render: supplier => supplier.name
        }
      ],
      stateFields: [
        {
          key: 1,
          value: "creationDate",
          title: "Fecha de Emisión",
          icon: "fa-calendar-plus"
        },
        {
          key: 2,
          value: "quotationDate",
          title: "Fecha de Presupuesto",
          icon: "fa-calendar-alt"
        },
        {
          key: 3,
          value: "billingDate",
          title: "Fecha de Facturación",
          icon: "fa-calendar-day"
        },
        {
          key: 4,
          value: "receptionDate",
          title: "Fecha de Recepción",
          icon: "fa-calendar-check"
        },
        {
          key: 5,
          value: "cancellationDate",
          title: "Fecha de Cancelación",
          icon: "fa-calendar-times"
        }
      ]
    };
  },
  computed: {
    ...mapState("purchaseOrders/details", ["purchaseOrder"])
  }
};
</script>
<style>
.v-subheader {
  text-transform: uppercase !important;
}
</style>
