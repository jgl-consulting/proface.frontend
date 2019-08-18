<template>
  <div>
    <v-layout row wrap>
      <h1 class="headline-1 mb-3">
        {{ saleOrder.nativeId || "Sin identificador" }}
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
import salePerimeter from '@/security/perimeters/sale-perimeter';
export default {
  routePerimeterAction: 'viewSale',
  perimeters: [
    salePerimeter
  ],
  meta: {
      breadcrumbs: [
        { name: 'Módulos', link: '/' },
        { name: 'Órdenes de venta', link: '/ventas/ordenesVenta' },
        function({ params }){
          return { name: params.saleOrderId };
        }
      ]
  },
  asyncData({ route, params }){
    const { path } = route;
    const { saleOrderId } = params;
    if(saleOrderId) {
      const mainRoute = `/ventas/ordenesVenta/${saleOrderId}`;
      return {
        activeTab: path,
        tabs: [
          { 
            name: 'Datos generales', 
            route: `${mainRoute}`, 
            icon: 'fa-info-circle' 
          },
          { 
            name: 'Detalles', 
            route: `${mainRoute}/detalles`, 
            icon: 'fa-clipboard' 
          }
        ]
      }
    } else {
      error({ statusCode: 404, message: 'Identificador de la orden de compra no presente' });
    }
  },
  computed: {
    ...mapState('saleOrders/details', ['saleOrder'])
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
