import VuetifyConfirm from 'vuetify-confirm'
import Vue from 'vue';
export default function ({ app }, inject) {
  Vue.use(VuetifyConfirm,{
    buttonTrueText: 'Aceptar',
    buttonFalseText: 'Cancelar',
    width: 350,
  });
  inject('confirm', Vue.prototype.$confirm);
}