<template>
  <v-list-tile>
    <v-list-tile-avatar>
      <v-icon class="orange darken-3" color="white">
        fa-piggy-bank
      </v-icon>
    </v-list-tile-avatar>
    <v-list-tile-content>
      <v-list-tile-title>
        {{ description }}
      </v-list-tile-title>
      <v-list-tile-sub-title>
        {{ number }}(CCI: {{ cci }}) - {{ bank.name }}({{bank.country.name}})
      </v-list-tile-sub-title>
    </v-list-tile-content>
    <v-list-tile-action>
      <span>{{ currency }}</span>
    </v-list-tile-action>
  </v-list-tile>
</template>
<script>
export default {
  props: {
    description: String,
    number: String,
    cci: String,
    bank: Object,
    currency: String
  }
}
</script>

<style>

</style>
