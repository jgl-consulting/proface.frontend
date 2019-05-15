<template>
  <v-layout row wrap>
    <v-breadcrumbs 
      large 
      class="px-0" 
      divider="/" 
      :items="this.breadcrumbs">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item nuxt :to="item.link" exact :disabled="!item.link">
          {{ item.name }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
    <v-spacer></v-spacer>
    <slot name="actions"></slot>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState(['breadcrumbs']),
  }

}
</script>

<style>
  .disabled {
    color: lightgrey;
    pointer-events: none;
  }
</style>
