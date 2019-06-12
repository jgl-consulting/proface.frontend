<template>
    <v-text-field
        v-model="search"
        append-icon="search"
        label="Búsqueda"
        single-line
        clearable
        hide-details
    ></v-text-field>
</template>

<script>
export default {
  props: {
      search: String
  }
}
</script>