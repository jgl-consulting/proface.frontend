<template>
  <v-layout row wrap>
    <v-flex md6 px-2>
      <model-detail title="Información" :fields="batchFields" :model="batch"></model-detail>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from "vuex";
import ModelDetail from "@/components/common/ModelDetail";
import moment from "moment";
export default {
  async fetch({ params: { batchId }, route, store }) {
    const fetchBatchAction =
      "batches/details/fetchBatch";
    await store.dispatch(fetchBatchAction, { batchId });
  },
  components: {
    ModelDetail,
  },
  data() {
    return {
      batchFields: [
        { key: "nativeId", title: "Código local", icon: "fa-id-card-alt" },
         { 
          key: "entryDate", 
          title: "Fecha de Entrada", 
          icon: "fa-calendar",
          render: entryDate => this.formatDate(entryDate)
        },
         { 
          key: "expirationDate", 
          title: "Fecha de Expiración", 
          icon: "fa-calendar",
          render: expirationDate => this.formatDate(expirationDate)
        },
        {
          key: "purchase",
          title: "Orden de Compra",
          icon: "fa-shopping-cart",
          render: purchase => purchase ? purchase.nativeId : "Sin orden de compra"
        },
        {
          key: "type",
          title: "Tipo",
          icon: "fa-paperclip",
          render: type => type ? type.description : "Sin tipo"
        },
      ]
    };
  },
  computed: {
    ...mapState("batches/details", ["batch"]),
    purchaseTraces() {
      return this.batch.traces;
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
