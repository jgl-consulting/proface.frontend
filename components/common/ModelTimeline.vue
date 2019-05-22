<template>
  <v-timeline align-top dense>
    <v-timeline-item
      v-for="field in notNullDates"
      :key="field.key"
      :icon="field.icon"
      color="primary"
      fill-dot
      small
    >
        <v-layout pt-3>
            <v-flex xs3>
              <strong>{{model[field.value]}}</strong>
            </v-flex>
            <v-flex>
              <div class="caption">{{field.title}}</div>
            </v-flex>
        </v-layout>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
export default {
  props: {
    fields: Array,
    model: Object
  },
  computed: {
    notNullDates: function() {
        return this.fields.filter(f => {
            return this.model[f.value] != null;
        })
    }
  }
};
</script>