(function() {
  'use strict';

  var envs = {
    local: {
      backend_url: "./fake-data"
    },
    development: {
      backend_url: "http://192.168.3.10:5001"
    },
    production: {
      backend_url: "http://backend.enelformulae.todo.to.it"
    },
    beta: {
      backend_url: "http://beta.backend.enelformulae.todo.to.it"
    },
    idle: {
      backend_url: "http://backend.enelformulae.todo.to.it"
    }
  }
  
  Application.environment = 'production'
  if (_.startsWith(window.location.host, "localhost")) {
    if (window.location.port >= "3000") {
      console.debug('localhost detected, forcing environment to "development"')
      Application.environment = 'development'
    } else {
      console.debug('localhost detected, forcing environment to "local"')
      Application.environment = 'local'
    }
  } else if (window.location.hostname === "beta.enelformulae.todo.to.it") {
    console.debug('beta host detected, forcing environment to "beta"')
    Application.environment = 'beta'
  } else if (window.location.hostname === "monitor.enelformulae.todo.to.it") {
    console.debug('monitor host detected, forcing environment to "idle"')
    Application.environment = 'idle'
  }
  
  console.info('Loading app environment '+Application.environment)

  function get_env(path) {
    if (_.isUndefined(envs[Application.environment])) {
      throw new Error("Environment "+Application.environment)
    }
    return _.result(envs[Application.environment], path)
  }

  Application.Env = {
    get: get_env
  }
}());
