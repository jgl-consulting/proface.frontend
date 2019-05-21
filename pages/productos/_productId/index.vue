<template>
  <v-layout row wrap>
    <v-flex md6 px-2>
      <model-detail title="Información" :fields="productFields" :model="product"></model-detail>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from "vuex";
import ModelDetail from "@/components/products/ModelDetail";
export default {
  async fetch({ params, route, store }) {
    const { productId } = params;
    const product = await store.dispatch("products/details/fetchProduct", {
      productId
    });
    store.dispatch("addParams", [product, route.path]);
  },
  components: {
    ModelDetail
  },
  data() {
    return {
      productFields: [
        { key: "nativeId", title: "Código local", icon: "fa-id-card-alt" },
        { key: "description", title: "Descripción", icon: "fa-edit" },
        { key: "currency", title: "Moneda", icon: "fa-money-bill" },
        {
          key: "salePrice",
          title: "Precio de Venta",
          icon: "fa-coins"
        },
        {
          key: "line",
          title: "Línea",
          icon: "fa-box",
          render: line => line.name
        }
      ]
    };
  },
  computed: {
    ...mapState("products/details", ["product"])
  }
};
</script>