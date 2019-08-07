<template>
  <v-layout row wrap>
    <v-flex md6 px-2>
      <model-detail title="Información" :fields="clientFields" :model="client"></model-detail>
    </v-flex>
    <v-flex md6 px-2>
      <v-subheader>Última compra</v-subheader>
      <model-timeline emptyTitle="El cliente no cuenta con órdenes de venta." :model="saleTraces"></model-timeline>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from "vuex";
import ModelDetail from "@/components/common/ModelDetail";
import ModelTimeline from "@/components/common/ModelTimeline";
export default {
  async fetch({ params: { clientId }, route, store }) {
    const fetchClientAction = "clients/details/fetchClient";
    await store.dispatch(fetchClientAction, { clientId });
  },
  components: {
    ModelDetail,
    ModelTimeline
  },
  data() {
    return {
      clientFields: [
        { key: "nativeId", title: "Código local", icon: "fa-id-card-alt" },
        { key: "address", title: "Dirección", icon: "fa-map-signs" },
        { key: "district", title: "Distrito", icon: "fa-map-marker-alt" },
        {
          key: "type",
          title: "Tipo",
          icon: "fa-user-tag",
          render: type => type ? type.name : "Sin tipo"
        }
      ],
    };
  },
  computed: {
    ...mapState("clients/details", ["client"]),
    saleTraces() {
      if (this.client.sales && this.client.sales.length > 0) {
        const saleOrder = this.client.sales[0];
        return saleOrder.traces;
      } else {
        return [];
      }
    }
  }
};
</script>
<style>
.v-subheader {
  text-transform: uppercase !important;
}
</style>
