

export default function ({ app, $axios, redirect }) {
  
  // A noop loading inteterface for when $nuxt is not yet ready
  const noopLoading = {
    finish: () => { },
    start: () => { },
    fail: () => { },
    set: () => { }
  }

  function isManualPageLoading(window) {
    return window.$nuxt.$root.$loading.manual !== undefined && window.$nuxt.$root.$loading.manual === false;
  }
  
  const $loading = ($window) => isManualPageLoading($window) ? noopLoading : $window.$nuxt.$root.$loading;
  
  $axios.onRequest(config => {
    
    if (config && config.progress === false) {
      return;
    }
    if (process.browser && window.$nuxt) {
      $loading(window).start();
    }

  });

  $axios.onResponse(response => {

    if(response && response.config && response.config.progress === false){
      return;
    }

    if (process.browser && window.$nuxt) {
      $loading(window).finish();
    }

  });

  $axios.onError(error => {
    
    if (error && error.config && error.config.progress === false) {
      return
    } 

    if (process.browser && window.$nuxt) {
      $loading(window).fail();
    }
    
    if(error.response) {
      if(error.response.status === 500) {
        redirect('/sorry');
      } else if(error.response.status === 401) {
        redirect('/unauthorized');
      } 
      /* 
      else if(route.fullPath !== '/login'){
        const { message, errors } = error.response.data;
        if(message && errors) {
          const allErrors = errors.map(e => e.errorMessage).join("\n");
          app.$confirm(allErrors, {
            title: message,
            color: "error",
            width: 500
          });
        } else {
          app.$confirm(error, { title: "Ocurrió un error", color: "error", width: 500 });
        }
      } 
      */
    }
  });

  function logRequest() {
    console.log(`Request [${currentRequest}]`);
  }
}