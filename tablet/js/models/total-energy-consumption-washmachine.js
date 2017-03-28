(function() {
  'use strict';
  
  var model = Application.modelFactory('total-energy-consumption-washmachine')
  model.valueProperty = "current"
  
  var washmaschinePerKw = 0.33
  
  model.model_update = function (resolve, reject) {
    var data = Application.models.TotalEnergyConsumption.data.current
    var result = Math.round(data/washmaschinePerKw)    
    console.info("Updating total-energy-consumption-washmachine: "+result)
    return resolve(result)
  }
  
  model.depends_on('TotalEnergyConsumption')
  
  Application.models.TotalEnergyConsumptionWashmachine = model
}());
