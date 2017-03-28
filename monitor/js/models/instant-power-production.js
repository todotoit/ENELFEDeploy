(function() {
  'use strict';
  
  var model = Application.modelFactory('instant-power-production')
  model.valueProperty = "current"
  
  model.data.current = "LIVE"
  
  // model.model_update = function (resolve, reject) {
  //   $.getJSON(Application.Env.get('backend_url')+'/powerproduction')
  //     .done(function(result) {
  //       console.info("Updating instant-power-production: "+result.time)
  //       resolve(Math.round(result.power))
  //     })
  //     .fail(function(jqXHR, textStatus, errorThrown) {
  //       console.error(textStatus)
  //       reject(errorThrown)
  //     })
  // }
  
  Application.models.InstantPowerProduction = model
}());
