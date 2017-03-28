(function() {
  'use strict';
  
  var model = Application.modelFactory('instant-power-consumption-washmachine')
  model.valueProperty = "current"
  
  var washmaschinePerKw = 0.33
  
  model.model_update = function (resolve, reject) {
    var data = Application.models.InstantPowerConsumption.data.current
    var result = Math.round(data/washmaschinePerKw)    
    console.info("Updating instant-power-consumption-washmachine: "+result)
    return resolve(result)
  }
  
  model.depends_on('InstantPowerConsumption')
  
  Application.models.InstantPowerConsumptionWashmachine = model
}());
