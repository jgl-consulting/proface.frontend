<template>
  <div>
    <v-layout row wrap>
      <h1 class="headline-1 mb-3">
        {{ product.name || "Sin nombre" }}
      </h1>
    </v-layout>
    <v-tabs v-model="activeTab" icons-and-text fixed-tabs grow>
      <v-tab 
        v-for="(tab, id) of tabs" 
        :key="id" 
        :to="tab.route" 
        exact
        nuxt
      >
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
import { mapState } from 'vuex';

import purchasePerimeter from '@/security/perimeters/purchase-perimeter';
export default {
  routePerimeterAction: 'viewPurchase',
  perimeters: [
    purchasePerimeter
  ],
  meta: {
      breadcrumbs: [
        { name: 'Módulos', link: '/' },
        { name: 'Productos', link: '/compras/productos' },
         function({ params }){
          return { name: params.productId };
        }
      ]
  },
  asyncData({ route, params }){
    const { path } = route;
    const mainRoute = `/compras/productos/${params.productId}`
    return {
      activeTab: path,
      tabs: [
        { 
          name: 'Datos generales', 
          route: `${mainRoute}`, 
          icon: 'fa-info-circle' 
        },
        { 
          name: 'Unidades', 
          route: `${mainRoute}/unidades`, 
          icon: 'fa-parking' 
        }
      ]
    }
  },
  computed: {
    ...mapState('products/details', ['product'])
  }
}
</script>
<style>
  .object-demo {
    padding: 10px;
    color: #FFFFFF;
    background-color: #37474F;
    border-radius: 8px;
  }
</style>
