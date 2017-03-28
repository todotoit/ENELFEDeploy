(function() {
  'use strict';
  
  var model = Application.modelFactory('zone-consumption-vehicle')
  model.valueProperty = "value"
  model.data.value = "LIVE"

  model.animateRender = function (element, value) {
    var parent = element.parent()
    function changeText(element, value) {
      element.text(value)
      TweenMax.to(parent, .3, {opacity:1, ease:Power3.easeOut})
    }
    TweenMax.to(parent, .3, {opacity:0, ease:Power3.easeOut, onComplete:changeText, onCompleteParams:[element,value]});
  }
  
  model.model_update = function (resolve, reject) {
    debugger
    var data = Application.models.ZoneConsumption.data.value
    var result = Math.round(data/0.12)
    console.info("Updating zone-consumption-vehicle: "+result)
    return resolve(result)
  }
  
  model.depends_on('ZoneConsumption')
  
  Application.models.ZoneConsumptionVehicle = model
  
}());
