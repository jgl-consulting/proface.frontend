import Vue from 'vue'

Vue.filter('pretty', function (value) {
  return JSON.stringify(value);
});

Vue.filter('path', (param, path) => `${path}/${param}`)