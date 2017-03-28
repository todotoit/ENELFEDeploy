(function() {
  'use strict';
  
  var model = Application.modelFactory('zone-consumption-paddock-charging')
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
    $.get(Application.Env.get('backend_url')+'/zoneenergyconsumption/paddock/car_charging')
      .done(function(result) {
        var total = Application.models.ZoneConsumptionPaddock.data.value
        console.info("Updating zone-consumption-paddock-charging: "+result.time, result)
        var percentage = Math.round((result.energy/total)*100)
        $('#donut_histogram .bar_container [data-percentage="charging"]').css('width',percentage+"%");
        resolve(Math.round(result.energy))
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        console.error(textStatus)
        reject(errorThrown)
      })
  }

  model.depends_on('ZoneConsumptionPaddock')
  
  Application.models.ZoneConsumptionPaddockCharging = model
  
}());
