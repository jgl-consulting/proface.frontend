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
    };
  },
  computed: {
    ...mapState("purchaseOrders/details", ["purchaseOrder"]),
    purchaseTraces() {
      return this.purchaseOrder.traces;
    }
  }
};
</script>
<style>
.v-subheader {
  text-transform: uppercase !important;
}
</style>
