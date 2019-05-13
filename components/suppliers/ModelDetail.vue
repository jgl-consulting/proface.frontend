<template>
   <v-list two-line subheader avatar>
    <v-list-tile v-for="field in fields" :key="field.key">
      <v-list-tile-avatar>
        <v-icon small>{{ field.icon }}</v-icon>
      </v-list-tile-avatar>
      <v-list-tile-content>  
        <v-list-tile-title>
          {{ field.title }}
        </v-list-tile-title>
        <v-list-tile-sub-title>
          {{ field | applyRender(model) }}
        </v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</template>

<script>
export default {
  props: {
    fields: Array,
    model: Object
  },
  filters: {
    applyRender(field, data) {
      if(field.render) {
        return field.render(data[field.key]);
      } else {
        return data[field.key]
      }
    }
  }
}
</script>

<style>

</style>
