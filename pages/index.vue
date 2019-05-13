<template>
  <v-container>
    <v-layout row wrap>
      <v-flex>
        <h1>Index</h1>
        <nuxt-child></nuxt-child>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  async fetch ({ store }) {
    // store.dispatch('loadCurrentTitle', 'Inicio');
  }
}
</script>
