import VuetifyLoaderPlugin from 'vuetify-loader/lib/plugin'
import pkg from './package'
import colors from 'vuetify/es5/util/colors'
export default {
  mode: 'spa',
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Lato:300,400,500,700|Material+Icons'
      },
      {
        rel: 'stylesheet',
        href: 'https://use.fontawesome.com/releases/v5.7.2/css/all.css'
      }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: '@/components/common/Loading.vue'
  /* 
  { 
    color: colors.deepOrange.darken2,
    continuous: true,
    height: '3px'
  } 
  */
  ,
  /*
  ** Global CSS
  */
  css: [
    '~/assets/style/app.styl',
    '~/assets/style/main.styl'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vuetify',
    '@/plugins/services',
    '@/plugins/flags',
    '@/plugins/lodash',
    '@/plugins/filters',
    '@/plugins/kindergarten',
    '@/plugins/confirm',
    '@/plugins/axios',
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/auth',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: 'https://proface-api.herokuapp.com/'
  },

  /*
  ** Build configuration
  */
  build: {
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ['~assets/style/variables.styl']
      }
    },
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
      }
    }
  },
  auth: {
    redirect: {
      login: '/login',
      logout: '/',
      home: '/'
    },
    strategies: {
      local: {
        endpoints: {
          login: { 
            url: '/oauth/token', 
            method: 'post', 
            propertyName: 'access_token',
            auth: {
              username: 'proface.api',
              password: 'proface'
            },
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            progress: false
          },
          logout: false,
          user: { url: '/oauth/info', method: 'get', propertyName: "user" }
        },
        tokenRequired: true,
        tokenType: 'Bearer',
      }
    }
  },
  router: {
    middleware: [
      'auth', 
      'page-title',
      'kindergarten',
    ]
  }
}
