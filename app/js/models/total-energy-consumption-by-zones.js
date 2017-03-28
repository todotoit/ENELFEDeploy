(function() {
  'use strict';
  
  var model = Application.modelFactory('total-energy-consumption-by-zones')
  model.valueProperty = "current"
  
  model.model_update = function (resolve, reject) {
    $.getJSON(Application.Env.get('backend_url')+'/zoneenergyconsumption')
      .done(function(result) {
        console.info("Updating total-energy-consumption-by-zones: "+result.time, result)
        Application.UI.createDonutChart('#donut_consumption', result.zones).update(result.zones)
        resolve(result.zones)
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        console.error(textStatus)
        reject(errorThrown)
      })
  }

  Application.models.TotalEnergyConsumptionByZones = model
}());
