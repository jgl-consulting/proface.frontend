<template>
  <div>
    {{ proveedor }}
  </div>
</template>

<script>

export default {
  async asyncData({ params, $axios}) {
    const { idProveedor } = params;
    const { _embedded } = await $axios.$get(`/api/proveedor/${idProveedor}`);

    return { proveedor: _embedded };
  }
}
</script>

<style>

</style>
