(function() {
  'use strict';
  
  var model = Application.modelFactory('instant-power-consumption')
  model.valueProperty = "current"
  
  model.data.history = []
  // model.data.current = 454
  
  model.model_update = function (resolve, reject) {
    $.getJSON(Application.Env.get('backend_url')+'/totalpowerdemand')
      .done(function(result) {
        console.info("Updating instant-power-consumption: "+result.time, result)
        resolve(Math.round(result.power))
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        console.error(textStatus)
        reject(errorThrown)
      })
  }
  
  Application.models.InstantPowerConsumption = model
}());
