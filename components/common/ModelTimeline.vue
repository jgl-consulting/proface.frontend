<template>
  <div v-if="hasTraces()">
    <v-timeline align-top dense>
      <v-timeline-item
        v-for="trace in orderedTraces"
        :color='$_.get(trace.status, "color", "primary")'
        :key="trace.id"
        :icon='$_.get(trace.status, "icon", "fa fa-calendar")'
        fill-dot
        small
      >
        <v-layout pt-3>
          <v-flex xs3>
            <strong>{{formatDate(trace.statusDate)}}</strong>
          </v-flex>
          <v-flex>
            <div class="caption">{{ $_.get(trace.status, "description", "Sin estado") }}</div>
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
    emptyTitle: String,
    model: Array
  },
  computed: {
    orderedTraces: function() {
      return this.model
        .filter(m => {
          return m.statusDate != null;
        })
        .sort((a, b) => {
          return a.statusDate < b.statusDate ? 1 : -1;
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
    hasTraces() {
      return this.model.length > 0;
    },
  }
};
</script>