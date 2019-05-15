<template>
  <v-layout row wrap>
      <h2>Ordenes de compra</h2>
  </v-layout>
</template>

<script>
export default {
  async fetch({ params, route, store }) {
    const { supplierId } = params;
    const supplier = await store.dispatch('suppliers/details/fetchSupplier', { supplierId });
    store.dispatch('addParams', [ supplier, route.path ]);
  },
}
</script>

<style>

</style>
