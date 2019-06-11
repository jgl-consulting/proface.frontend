<template>
  <div>
    <v-layout row wrap>
      <h1 class="headline-1 mb-3">
        {{ supplier.name }}
        <flag
          class="ml-2"
          :iso="getCountryIso(supplier.country)"
          :title="getCountryName(supplier.country)"
          :squared="false"
        ></flag>
      </h1>
    </v-layout>
    <v-tabs v-model="activeTab" icons-and-text fixed-tabs grow>
      <v-tab v-for="(tab, id) of tabs" :key="id" :to="tab.route" exact nuxt>
        {{ tab.name }}
        <v-icon>{{ tab.icon }}</v-icon>
      </v-tab>
    </v-tabs>
    <v-card flat>
      <nuxt/>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  meta: {
    breadcrumbs: [
      { name: "Módulos", link: "/" },
      { name: "Proveedores", link: "/compras/proveedores" },
      function({ params }) {
        return { name: params.supplierId };
      }
    ]
  },
  asyncData({ route, params }) {
    const { path } = route;
    const mainRoute = `/compras/proveedores/${params.supplierId}`;
    return {
      activeTab: path,
      tabs: [
        {
          name: "Datos generales",
          route: `${mainRoute}`,
          icon: "fa-info-circle"
        },
        {
          name: "Cuentas Bancarias",
          route: `${mainRoute}/cuentas`,
          icon: "fa-piggy-bank"
        },
        {
          name: "Ordenes de compra",
          route: `${mainRoute}/ordenes`,
          icon: "fa-shopping-cart"
        }
      ]
    };
  },
  computed: {
    ...mapState("suppliers/details", ["supplier"])
  },
  methods: {
    getCountryIso(country) {
      return country ? country.iso : "Sin país";
    },
    getCountryName(country) {
      return country ? country.name : "Sin país";
    }
  }
};
</script>
<style>
.object-demo {
  padding: 10px;
  color: #ffffff;
  background-color: #37474f;
  border-radius: 8px;
}
</style>
