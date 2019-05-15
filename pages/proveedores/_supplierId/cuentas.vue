<template>
  <v-layout row wrap>
      <h2>Cuentas bancarias</h2>
  </v-layout>
</template>

<script>
export default {
  async fetch({ params: { supplierId }, route, store }) {
    const fetchSupplierAction ='suppliers/details/fetchSupplier';
    const supplier = await store.dispatch(fetchSupplierAction, { supplierId });
  }
}
</script>

<style>

</style>
