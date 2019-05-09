<template>
  <v-container>
    <v-layout row wrap>
      <v-flex>
        <module-title>
          Módulos
        </module-title>
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
