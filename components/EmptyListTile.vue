<template>
  <v-list-tile>
    <v-list-tile-avatar>
      <v-icon small class="yellow darken-3" color="white">
        fa-search
      </v-icon>
    </v-list-tile-avatar>
    <v-list-tile-content>
      <v-list-tile-title>
        <slot>No hay datos para mostrar</slot>
      </v-list-tile-title>
    </v-list-tile-content>
  </v-list-tile>
</template>