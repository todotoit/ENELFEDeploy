(function() {
  'use strict';
  
  var model = Application.modelFactory('zone-consumption-hospitality')
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
    $.get(Application.Env.get('backend_url')+'/zoneenergyconsumption/hospitality')
      .done(function(result) {
        console.info("Updating zone-consumption-hospitality: "+result.time, result)
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
  
  Application.models.ZoneConsumptionHospitality = model
  
}());
