<template>
  <div>
    {{ user }}
  </div>
</template>

<script>

export default {
  validate ({ params }) {
    return /^\d+$/.test(params.idProveedor)
  },
  async asyncData({ params, $axios}) {
    const { idProveedor } = params;

    const user = await $axios.$get(`/usuarios/${idProveedor}`);

    return { user };
  }
}
</script>

<style>

</style>
