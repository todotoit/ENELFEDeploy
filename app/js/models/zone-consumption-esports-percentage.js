(function() {
  'use strict';
  
  var model = Application.modelFactory('zone-consumption-esports-percentage')
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
    var data = Application.models.ZoneConsumptionEsports.data.value
    var total = Application.models.TotalEnergyConsumption.data.current
    var result = Math.round(data/total*100)
    console.info("Updating zone-consumption-esports-percentage: "+result)
    return resolve(result)
  }
  
  model.depends_on(['ZoneConsumptionEsports', 'TotalEnergyConsumption'])
  
  Application.models.ZoneConsumptionEsportsPercentage = model
  
}());
