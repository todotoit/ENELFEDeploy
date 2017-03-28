(function() {
  'use strict';

  var $sidebar = $('#sidebar')

  Application.animations.sidebar = Application.animations['sidebar']? Application.animations.sidebar : {}

  Application.animations.sidebar = {
    selectDonutArea: selectDonutArea
  }

  var currentSelected = null

  function getCurrentSelector() {
    return '#donut_area_' + currentSelected.toLowerCase()
  }

  function show(name) {
    currentSelected = name
    var zoneSelector = getCurrentSelector()
    $sidebar.find(zoneSelector).show()
    TweenMax.to($(zoneSelector), .6, {css:{opacity: 1}, ease:Power3.easeOut});
  }

  function swapArea(callback, params) {
    var zoneSelector = getCurrentSelector()
    TweenMax.to($(zoneSelector), .6, {css:{opacity: 0}, ease:Power3.easeOut, onComplete: function() {
      $(zoneSelector).hide()
      callback(params)
    }});
  }

  function selectDonutArea(d) {
    Application.stateman.emit('event', {name: 'tap_on_donut: ' + d.name})
    if (!currentSelected) return show(d.name)
    else if (currentSelected === d.name) return show(d.name)
    else swapArea(show, d.name)
  }

  function init() {
    $sidebar.find('.donut_area_data').hide()
  }

  init()

}());
