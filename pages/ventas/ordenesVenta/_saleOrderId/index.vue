<template>
  <v-layout row wrap>
    <v-flex md6 px-2>
      <ModelDetail 
        title="Información" 
        :fields="saleOrderFields" 
        :model="saleOrder">
      </ModelDetail>
    </v-flex>
    <!-- 
    <v-flex md6 px-2>
      <v-subheader>Estado</v-subheader>
      <model-timeline emptyTitle="La orden de venta no tiene seguimiento" :model="saleTraces"></model-timeline>
    </v-flex> 
    -->
  </v-layout>
</template>

<script>
import moment from "moment";
import { mapState } from "vuex";

import ModelDetail from "@/components/common/ModelDetail";
import ModelTimeline from "@/components/common/ModelTimeline";
import salePerimeter from '@/security/perimeters/sale-perimeter';

export default {
  routePerimeterAction: 'viewSale',
  perimeters: [
    salePerimeter
  ],
  async fetch({ params: { saleOrderId }, route, store }) {
    const fetchSaleOrderAction = "saleOrders/details/fetchSaleOrder";
    await store.dispatch(fetchSaleOrderAction, { saleOrderId });
  },
  components: {
    ModelDetail,
    ModelTimeline
  },
  data() {
    return {
      saleOrderFields: [
        { key: "nativeId", title: "Código local", icon: "fa-id-card-alt" },
        { 
          key: "creationDate", 
          title: "Fecha de Creación", 
          icon: "fa-calendar",
          render: creationDate => this.formatDate(creationDate)
        },
        {
          key: "client",
          title: "Cliente",
          icon: "fa-truck",
          render: client => client ? client.name : "Sin cliente"
        },
        { key: "localTotal", title: "Total en Soles", icon: "fa-coins" }
      ]
    };
  },
  computed: {
    ...mapState("saleOrders/details", ["saleOrder"]),
    saleTraces() {
      return this.saleOrder.traces;
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
