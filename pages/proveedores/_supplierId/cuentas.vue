<template>
<v-card>
    <v-layout row wrap>
       
    </v-layout>
  </v-card>
</template>

<script>
export default {
  async fetch({ params, route, store }) {
    const { supplierId } = params;
    
    const supplier = await store.dispatch('suppliers/details/fetchSupplier', { 
      supplierId 
    })
    
    store.dispatch('addParams', [ supplier, route.path ]);
  }
}
</script>

<style>

</style>
