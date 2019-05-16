<template>
  <v-list two-line subheader avatar>
    <v-subheader>
      {{ title }}
    </v-subheader>
    <v-list-tile v-for="field in fields" :key="field.key">
      <slot :name="field.key" :model="model" :field="field">
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
      </slot>
    </v-list-tile>
  </v-list>
</template>

<script>
export default {
  props: {
    title: String,
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