;(function(window, undefined){
  'use strict'

  function init(selector) {

    var $container = $(selector)
    $container.addClass('latinamerica-map')

    this.animate =function() {}
    
    return this
  }
  
  // global interface name
  window.latinAmericaSlide = init

})(window)
