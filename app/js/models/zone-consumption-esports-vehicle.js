(function() {
  'use strict';
  
  var model = Application.modelFactory('zone-consumption-esports-vehicle')
  model.valueProperty = "value"
  // model.data.value = "LIVE"
  
  var evehicleRoundtrips = 0.12

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
    var result = Math.round(data/evehicleRoundtrips)
    console.info("Updating zone-consumption-esports-vehicle: "+result)
    return resolve(result)
  }
  
  model.depends_on('ZoneConsumptionEsports')
  
  Application.models.ZoneConsumptionEsportsVehicle = model
  
}());
