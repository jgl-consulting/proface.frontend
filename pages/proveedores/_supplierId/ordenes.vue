<template>
  <v-layout row wrap>
      <h2>Ordenes de compra</h2>
  </v-layout>
</template>

<script>
export default {
  async fetch({ params: { supplierId }, route, store }) {
    const fetchSupplierAction ='suppliers/details/fetchSupplier';
    await store.dispatch(fetchSupplierAction, { supplierId });
  },
}
</script>

<style>

</style>
