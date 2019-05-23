<template>
  <div v-if="hasDates()">
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
            <strong>{{formatDate(model[field.value])}}</strong>
          </v-flex>
          <v-flex>
            <div class="caption">{{field.title}}</div>
          </v-flex>
        </v-layout>
      </v-timeline-item>
    </v-timeline>
  </div>
  <div v-else px-2>
    <v-subheader>
      <strong>{{emptyTitle}}</strong>
    </v-subheader>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: {
    fields: Array,
    emptyTitle: String,
    model: Object
  },
  computed: {
    notNullDates: function() {
      return this.fields.filter(f => {
        return this.model[f.value] != null;
      });
    }
  },
  methods: {
    formatDate(date) {
      if (date != undefined) return this.dateMoment(date).format("DD/MM/YYYY");
      return "";
    },
    dateMoment(date) {
      if (date != undefined) {
        const momentDate = moment(date);
        return momentDate.isValid() ? momentDate : moment.now();
      }
      return "";
    },
    hasDates() {
      return this.fields.some(f => this.model[f.value] != null);
    }
  }
};
</script>