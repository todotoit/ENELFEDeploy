(function() {
  'use strict';
  
  var model = Application.modelFactory('zone-consumption')
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
  
  // model.model_update = function (resolve, reject) {
  //   $.get(Application.Env.get('backend_url')+'/totalenergyconsumption')
  //     .done(function(result) {
  //       console.info("Updating map-consumption: "+result.time)
  //       resolve(Math.round(result.energy))
  //     })
  //     .fail(function(jqXHR, textStatus, errorThrown) {
  //       console.error(textStatus)
  //       reject(errorThrown)
  //     })
  // }
  
  Application.models.ZoneConsumption = model
  
}());
