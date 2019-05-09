import Vue from 'vue'

Vue.filter('pretty', function pretty(value) {
  return JSON.stringify(value);
});