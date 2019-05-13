<template>
  <v-container pt-0>
    <v-layout row wrap>
      <v-tabs v-model="activeTab" grow>
        <v-tab 
          v-for="(tab, id) of tabs" 
          :key="id" 
          :to="tab.route" 
          exact
          nuxt
        >
          {{ tab.name }}
        </v-tab>
      </v-tabs>
    </v-layout>
    <nuxt/>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
  asyncData({ route }){
    const { path } = route;
    return {
      activeTab: `${path}/perfil`,
      tabs: [
        { name: 'Datos generales', route: `${path}` }
      ]
    }
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
