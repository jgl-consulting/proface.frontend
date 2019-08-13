<template>
  <v-card class="round-card pa-1">
    <v-card-title primary-title>
      <h2>
        <v-icon medium>{{ menu.icon }}</v-icon>
        <span class="mx-1"></span>
        <span>{{ menu.title }}</span>
      </h2>
    </v-card-title>
    <v-card-text>
      {{ menu.description }}
    </v-card-text>
    <v-card-actions class="justify-center py-3">
      <v-btn color="accent" :to="menu.to" large>
        <v-icon small>fa-ellipsis-v</v-icon>
        <span class="mx-2"></span>
        <span>Ver más</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    menu: Object
  }
}
</script>

<style>

</style>
