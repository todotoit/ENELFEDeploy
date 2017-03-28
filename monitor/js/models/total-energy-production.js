(function() {
  'use strict';
  
  var model = Application.modelFactory('total-energy-production')
  model.valueProperty = "current"
  
  model.data.current = "LIVE"
  
  // model.model_update = function (resolve, reject) {
  //   $.getJSON(Application.Env.get('backend_url')+'/totalenergyproduction')
  //     .done(function(result) {
  //       console.info("Updating total-energy-production: "+result.time)
  //       resolve(Math.round(result.power))
  //     })
  //     .fail(function(jqXHR, textStatus, errorThrown) {
  //       console.error(textStatus)
  //       reject(errorThrown)
  //     })
  // }
  
  Application.models.TotalEnergyProduction = model
}());
