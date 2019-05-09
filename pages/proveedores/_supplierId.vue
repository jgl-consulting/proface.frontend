<template>
  <v-container>
    <v-layout row wrap>
      <v-flex>
        <module-title>
          {{ supplier.name }}
        </module-title>
        <div class="object-demo">
          <pre>
            {{ supplier || pretty }}
          </pre>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

export default {
  async asyncData({ params, $axios}) {
    const { supplierId } = params;
    const supplier = await $axios.$get(`/api/suppliers/${supplierId}`);

    return { supplier };
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
