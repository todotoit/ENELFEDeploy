(function() {
  'use strict';
  
  var model = Application.modelFactory('zone-demand-paddock-auxiliary')
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
    $.get(Application.Env.get('backend_url')+'/zonepowerdemand/paddock/pit_utilities')
      .done(function(result) {
        var total = Application.models.ZoneDemandPaddock.data.value
        console.info("Updating zone-demand-paddock-auxiliary: "+result.time, result)
        // var percentage = Math.round((result.power/total)*100)
        // $('#donut_histogram .bar [data-percentage="auxiliary"]').css('width',percentage+"%");
        resolve(Math.round(result.power))
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        console.error(textStatus)
        reject(errorThrown)
      })
  }

  model.depends_on('ZoneDemandPaddock')
  
  Application.models.ZoneDemandPaddockAuxiliary = model
  
}());
