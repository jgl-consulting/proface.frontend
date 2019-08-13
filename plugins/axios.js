export default function (ctx) {
  
  const { app, $axios, redirect, route } = ctx;
 
  $axios.onError(error => {
    if (process.browser && window.$nuxt) {
      
      window.$nuxt.$root.$loading.fail();
    }

    if(error.response) {
      if(error.response.status === 500) {
        redirect('/sorry')
      } else if(route.fullPath !== '/login'){
        /* const { message, errors } = error.response.data;
        if(message && errors) {
          const allErrors = errors.map(e => e.errorMessage).join("\n");
          app.$confirm(allErrors, {
            title: message,
            color: "error",
            width: 500
          });
        } else {
          app.$confirm(error, { title: "Ocurrió un error", color: "error", width: 500 });
        } */
      }
    }
  });

  $axios.onRequest(() => {
    if (process.browser && window.$nuxt) {
      window.$nuxt.$root.$loading.start();
    }
  });

  $axios.onResponse(() => {
    if (process.browser && window.$nuxt) {
      window.$nuxt.$root.$loading.finish();
    }
  })
}