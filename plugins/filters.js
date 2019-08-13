import Vue from 'vue'

Vue.filter('pretty', function (value) {
  return JSON.stringify(value);
});
Vue.filter('twoDecimals', function (number) {
  if (isNaN(number)) {
    return 0.0.toFixed(2);
  }
  return parseFloat(number).toFixed(2);
})
Vue.filter('path', (param, path) => `${path}/${param}`)