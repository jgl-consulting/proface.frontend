<template>
  <v-layout row wrap>
    <v-breadcrumbs 
      large 
      class="px-0" 
      divider="/" 
      :items="this.displayBreadcrumbs">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item nuxt :to="item.href" exact>
          {{ item.text }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
    <v-spacer></v-spacer>
    <slot name="actions"></slot>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters(['displayBreadcrumbs']),
  }

}
</script>

<style>

</style>
