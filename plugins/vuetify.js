import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/es5/util/colors'
import PageBreadcrumbs from '@/components/common/PageBreadcrumbs';
import VuetifyConfirm from 'vuetify-confirm'

Vue.use(Vuetify, {
  iconfont: 'fa',
  theme: {
    primary: colors.teal.lighten1,
    accent: colors.orange.darken2,
    secondary: colors.amber.darken3,
    info: colors.teal.lighten1,
    warning: colors.amber.base,
    error: colors.deepOrange.accent4,
    success: colors.green.darken2
  }
})

// Custom
Vue.component("PageBreadcrumbs", PageBreadcrumbs);

// vuetify-confirm
Vue.use(VuetifyConfirm, {
  buttonTrueText: 'Aceptar',
  buttonFalseText: 'Cancelar',
  width: 350,
})