(function() {
  'use strict';
  
  var model = Application.modelFactory('instant-area-chart-paddock')
  model.valueProperty = "current"
  
  model.model_update = function (resolve, reject) {
    $.getJSON(Application.Env.get('backend_url')+'/graphs/areachart/paddock')
      .done(function(result) {
        console.info("Updating instant-area-chart-paddock: "+result.time, result)
        Application.UI.createAreaChart('#acquafuel_container', result.zones).updateData(result.zones)
        resolve(result.zones)
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        console.error(textStatus)
        reject(errorThrown)
      })
  }
  
  Application.models.InstantAreaChartPaddock = model
}());
