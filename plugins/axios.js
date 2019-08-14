

export default function ({ app, $axios, redirect }) {
  
  // A noop loading inteterface for when $nuxt is not yet ready
  const noopLoading = {
    finish: () => { },
    start: () => { },
    fail: () => { },
    set: () => { }
  }

  function loadingComponentExists($process, $window) {
    
    if ($process.browser && $window.$nuxt) {
      return $window.$nuxt.$loading;
    } else {
      return true;
    }
  }
  
  const $loading = ($process, $window) => loadingComponentExists($process,$window) ? $window.$nuxt.$loading : noopLoading;
  
  $axios.onRequest(config => {
    
    if (config && config.progress === false) {
      return;
    }

    if (process.browser && window.$nuxt) {
      $loading(process, window).start();
    }

  });

  $axios.onResponse(response => {

    if(response && response.config && response.config.progress === false){
      return;
    }

    if (process.browser && window.$nuxt) {
      $loading(process, window).finish();
    }
  });

  $axios.onError(error => {
    
    if (error && error.config && error.config.progress === false) {
      return
    } 

    if (process.browser && window.$nuxt) {
      $loading(process, window).fail();
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