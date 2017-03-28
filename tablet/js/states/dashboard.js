(function() {
  'use strict'

  // use this to reference current section DOM tree
  var $currentSection = $('section#dashboard')

  Application.states.dashboard = {
    enter: function() {
      Application.animations.dashboard.expand()
      $('.section_container section').removeClass('visible')
      Application.UI.createStreamgraph('#streamgraph')
      Application.UI.createStreamgraph('#streamgraph').attach()
      TweenMax.to($('.branding'), .6, {css:{"background":"-webkit-linear-gradient(left, #4bbba3, #55be5a)"}, ease:Power3.easeOut} );
    },
    leave: function() {
      Application.UI.setBackgroundColor()
      Application.animations.dashboard.collapse()
      Application.UI.createStreamgraph('#streamgraph').detach()
      $('#'+Application.stateman.current.name).addClass('visible')
    }
  }

}())
