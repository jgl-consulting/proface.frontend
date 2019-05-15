<template>
  <v-layout row wrap>
    <v-flex 
      v-for="(menu, idx) in menus" 
      :key="idx"
      md4
    >
      <v-card class="rounded-card pa-1">
        <v-card-title primary-title>
          <h1>
            <v-icon medium>{{ menu.icon }}</v-icon>
            <span class="mx-1"></span>
            <span>{{ menu.title }}</span>
          </h1>
        </v-card-title>
        <v-card-text>
          <h3>{{ menu.description }}</h3>
        </v-card-text>
        <v-card-actions class="justify-center py-3">
          <v-btn color="accent" :to="menu.to" large>
            Ver más
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import menus from '@/util/menus';
export default {
  meta: {
    breadcrumbs: [
      { name: 'Módulos', link: '' }
    ]
  },
  computed: {
    menus: () => menus
  }
}
</script>
