;(function(window, undefined){
  'use strict'
  
  function init(selector) {
    var $container = $(selector)
    $container.addClass('ba_meters-map')

    $(document).ready(function(){
    	console.log($('svg'))
    })
    

    this.animate = function() {}
    return this
  }
  
  // global interface name
  window.baMetersMap = init

})(window)
