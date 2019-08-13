<template>
  <v-menu
    ref="datePicker"
    :close-on-content-click="false"
    v-model="datePicker"
    :nudge-right="40"
    lazy
    transition="scale-transition"
    offset-y
    full-width
    max-width="290px"
    min-width="290px"
  >
    <template #activator="{ on }">
      <v-text-field
        v-on="on"
        :value="formatDate(value)"
        :label="label"
        persistent-hint
        :append-icon="appendIcon"
        :prepend-icon="prependIcon"
        @blur="dateModel = parseDate(value)"
        readonly
      ></v-text-field>
    </template>
    <v-date-picker v-model="dateModel" locale="es-PE" no-title @input="datePicker = false"></v-date-picker>
  </v-menu>
</template>

<script>
import moment from "moment";
export default {
  props: {
    value: String,
    label: String,
    appendIcon: String,
    prependIcon: String
  },
  watch: {
    dateModel: {
      handler() {
        const date = this.dateModel;
        if (date) {
          this.$emit("input", date);
        } else {
          this.$emit("input", moment.now());
        }
      }
    }
  },
  data() {
    return {
      datePicker: false,
      dateModel: ""
    };
  },
  methods: {
    formatDate(date) {
      if (date != undefined) {
        return this.dateMoment(date).format("DD/MM/YYYY");
      }
      return "";
    },
    parseDate(date) {
      if (date != undefined) {
        return this.dateMoment(date).format("YYYY-MM-DD");
      }
      return "";
    },
    dateMoment(date) {
      if (date != undefined) {
        const momentDate = moment(date);
        return momentDate.isValid() ? momentDate : moment.now();
      }
      return "";
    }
  },
  created() {
    this.dateModel = this.parseDate(this.value);
  }
};
</script>