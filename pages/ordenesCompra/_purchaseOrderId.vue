<template>
  <div>
    <v-layout row wrap>
      <h1 class="headline-1 mb-3">
        {{ purchaseOrder.nativeId }}
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

export default {
  meta: {
      breadcrumbs: [
        { name: 'Módulos', link: '/' },
        { name: 'Órdenes de compra', link: '/ordenesCompra' },
        ({ purchaseOrderId }) => ({ name: purchaseOrderId  })
      ]
  },
  asyncData({ route, params }){
    const { path } = route;
    const mainRoute = `/ordenesCompra/${params.purchaseOrderId}`
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
        },
        { 
          name: 'Costos', 
          route: `${mainRoute}/costos`, 
          icon: 'fa-coins' 
        },
        {
          name: 'Facturas',
          route: `${mainRoute}/facturas`, 
          icon: 'fa-file-invoice-dollar' 
        }
      ]
    }
  },
  computed: {
    ...mapState('purchaseOrders/details', ['purchaseOrder'])
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
