<template>
  <v-card>
    <v-card-title primary-title>
      <h1>
        {{ product.name }}
      </h1>
    </v-card-title>
    <v-layout row wrap>
        <v-flex xs7>
          <model-detail
            :fields="productFields"
            :model="product"
          ></model-detail>
        </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import ModelDetail from '@/components/products/ModelDetail';
export default {
  async fetch({ params, route, store }) {
    const { productId } = params;  
    const product = await store.dispatch('products/details/fetchProduct', { 
      productId 
    })
    store.dispatch('addParams', [ product, route.path ]);
  },
  components: {
    ModelDetail
  },
  data(){
    return {
      productFields: [
        { key: 'nativeId', title: 'Código local', icon: 'fa-id-card-alt' },
        { key: 'description', title: 'Descripción', icon:'fa-edit'},
        { 
          key: 'line', 
          title: 'Línea', 
          icon: 'fa-box',
          render: line => line.name
        }
      ]
    }
  },
  computed: {
    ...mapState('products/details', [
      'product'
    ])
  },
}
</script>