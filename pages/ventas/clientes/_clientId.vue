<template>
  <div>
    <v-layout row wrap>
      <h1 class="headline-1 mb-3">{{ client.name || "Sin nombre" }}</h1>
    </v-layout>
    <v-tabs v-model="activeTab" icons-and-text fixed-tabs grow>
      <v-tab v-for="(tab, id) of tabs" :key="id" :to="tab.route" exact nuxt>
        {{ tab.name }}
        <v-icon>{{ tab.icon }}</v-icon>
      </v-tab>
    </v-tabs>
    <v-card flat>
      <nuxt />
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  meta: {
    breadcrumbs: [
      { name: "Módulos", link: "/" },
      { name: "Clientes", link: "/ventas/clientes" },
      function({ params }) {
        return { name: params.clientId };
      }
    ]
  },
  asyncData({ route, params }) {
    const { path } = route;
    const mainRoute = `/ventas/clientes/${params.clientId}`;
    return {
      activeTab: path,
      tabs: [
        {
          name: "Datos generales",
          route: `${mainRoute}`,
          icon: "fa-info-circle"
        },
        {
          name: "Ordenes de compra",
          route: `${mainRoute}/ordenes`,
          icon: "fa-cash-register"
        }
      ]
    };
  },
  computed: {
    ...mapState("clients/details", ["client"])
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
