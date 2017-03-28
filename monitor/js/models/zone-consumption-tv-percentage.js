(function() {
  'use strict';
  
  var model = Application.modelFactory('zone-consumption-tv-percentage')
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
    var data = Application.models.ZoneConsumptionTv.data.value
    var total = Application.models.TotalEnergyConsumption.data.current
    var result = Math.round(data/total*100)
    console.info("Updating zone-consumption-tv-percentage: "+result)
    return resolve(result)
  }
  
  model.depends_on(['ZoneConsumptionTv', 'TotalEnergyConsumption'])
  
  Application.models.ZoneConsumptionTvPercentage = model
  
}());