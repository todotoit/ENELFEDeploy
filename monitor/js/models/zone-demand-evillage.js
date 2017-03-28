(function() {
  'use strict';
  
  var model = Application.modelFactory('zone-demand-evillage')
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
    $.get(Application.Env.get('backend_url')+'/zonepowerdemand/evillage')
      .done(function(result) {
        var total = Application.models.InstantPowerConsumption.data.current
        console.info("Updating zone-demand-evillage: "+result.time, result)
        var percentage = Math.round((result.power/total)*100)
        $('#microgrid .bar_wrap [data-percentage="evillage"]').css('height',percentage+"%");
        resolve(Math.round(result.power))
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        console.error(textStatus)
        reject(errorThrown)
      })
  }

  model.depends_on('InstantPowerConsumption')

  
  Application.models.ZoneDemandEvillage = model
  
}());
