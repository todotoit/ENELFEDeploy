(function() {
  'use strict';
  
  var model = Application.modelFactory('zone-consumption-hospitality-percentage')
  model.valueProperty = "value"
  // model.data.value = "LIVE"

  model.animateRender = function (element, value) {
    var parent = element.parent()
    function changeText(element, value) {
      element.text(value)
      TweenMax.to(parent, .3, {opacity:1, ease:Power3.easeOut})
    }
    TweenMax.to(parent, .3, {opacity:0, ease:Power3.easeOut, onComplete:changeText, onCompleteParams:[element,value]});
  }
  
  model.model_update = function (resolve, reject) {
    var data = Application.models.ZoneConsumptionHospitality.data.value
    var total = Application.models.TotalEnergyConsumption.data.current
    var result = Math.round(data/total*100)
    console.info("Updating zone-consumption-hospitality-percentage: "+result)
    return resolve(result)
  }
  
  model.depends_on(['ZoneConsumptionHospitality', 'TotalEnergyConsumption'])
  
  Application.models.ZoneConsumptionHospitalityPercentage = model
  
}());
