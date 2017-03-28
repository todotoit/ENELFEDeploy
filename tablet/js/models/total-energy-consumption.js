(function() {
  'use strict';
  
  var model = Application.modelFactory('total-energy-consumption')
  model.valueProperty = "current"
  
  model.model_update = function (resolve, reject) {
    $.getJSON(Application.Env.get('backend_url')+'/totalenergyconsumption')
      .done(function(result) {
        console.info("Updating total-energy-consumption: "+result.time, result)
        resolve(Math.round(result.energy))
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        console.error(textStatus)
        reject(errorThrown)
      })
  }
  
  model.format = function (value) {
    return numeral(value).format('0,0')
  }
  
  Application.models.TotalEnergyConsumption = model
}());
