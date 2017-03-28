(function() {
  'use strict';
  
  Application.animations.city_and_racetrack = Application.animations['city_and_racetrack']
    ? Application.animations.city_and_racetrack
    : {}
  
  var previous = 0;

  var backgroundSlides = [
    {
      selector: '#smartgrid_slide',
      animation: hideMap
    },
    {
      selector: '#microgrid_slide',
      animation: showMapWithBuildings
    },
    {
      selector: '#track_slide',
      animation: showMapNoBuildings
    },
    {
      selector: '#energy_mix_slide',
      animation: hideMap
    }
  ]

  var slidesContent = {
    'meters_map': hideMap
  }
  
  Application.animations.city_and_racetrack.background = {
    animate: goTo,
    reset: reset,
    expand: expand,
    collapse: collapse
  }
  
  function reset() {
    previous = 0
  }
  
  function goTo(page) {
    var current = page.index
    move(previous,current)
    previous = current
  }

  function hideSlide(selector) {
    TweenMax.set($(selector), {opacity: 0, display: 'none'});
  }
  function showSlide(selector, callbackAnimation) {
    TweenMax.to($(selector), .6, {css:{opacity: 1, display: 'block'}, delay:.3, ease:Power3.easeOut} );
    if (callbackAnimation) callbackAnimation()
  }

  function expand(slideElement) {
    if (!slideElement.is('.expandable')) return
    if (slideElement.is('.expanded')) return collapse(slideElement);
    var currentSlide = backgroundSlides[previous];
    var showSlideContent = slidesContent[slideElement.find('.slide_content').attr('data-link')];
    // set close svg style
    TweenMax.set(slideElement.find('label > .slide_plus_btn svg'), {css:{rotation: 315}} );
    TweenMax.set(slideElement.find('label > .slide_plus_btn svg line'), {css:{"stroke":"#E61400",'background':'#000'}} );
    TweenMax.set(slideElement.find('label > .slide_plus_btn svg circle'), {css:{"stroke":"#FFF", "fill":"#FFF"}} );
    // label blink
    TweenMax.to(slideElement.find('label'), .6, {css:{opacity: 0}, ease:Power3.easeOut} );
    TweenMax.to(slideElement.find('label'), .6, {css:{opacity: 1}, delay:.6, ease:Power3.easeOut} );
    TweenMax.to(slideElement.find('label > .slide_plus_btn'), .6, {css:{opacity: 1, display: 'block'}, delay:.6, ease:Power3.easeOut} );
    // add expanded class
    TweenMax.to(slideElement, .6, {className:'+=expanded', delay:.2, ease:Power3.easeOut} );
    // hide slide background
    hideSlide(currentSlide.selector);
    // hide buttons and show content
    TweenMax.to(slideElement.find('.buttons'), .6, {css:{opacity: 0, display: 'none'}, ease:Power3.easeOut} );
    TweenMax.to(slideElement.find('.slide_content'), .6, {css:{opacity: 1, display: 'flex'}, delay:.6, ease:Power3.easeOut} );
    showSlideContent();
  }
  function collapse(slideElement) {
    if (!slideElement.is('.expanded')) return
    var currentSlide = backgroundSlides[previous];
    // label blink
    TweenMax.to(slideElement.find('label > .slide_plus_btn'), .6, {css:{opacity: 0, display: 'none'}, ease:Power3.easeOut} );
    TweenMax.to(slideElement.find('label'), .6, {css:{opacity: 0}, ease:Power3.easeOut} );
    TweenMax.to(slideElement.find('label'), .6, {css:{opacity: 1}, delay:.6, ease:Power3.easeOut} );
    // remove expanded class
    TweenMax.to(slideElement, .6, {className:'-=expanded', delay:.2, ease:Power3.easeOut} );
    // show slide background again
    showSlide(currentSlide.selector, currentSlide.animation);
    // hide content and show buttons again
    TweenMax.to(slideElement.find('.slide_content'), .6, {css:{opacity: 0, display: 'none'}, ease:Power3.easeOut} );
    TweenMax.to(slideElement.find('.buttons'), .6, {css:{opacity: 1, display: 'flex'}, delay:.6, ease:Power3.easeOut} );
  }
  
  function move(from,to) {
    //gestione spostamento da una slide all'altra
    Application.states.city_and_racetrack.reset();
    from = backgroundSlides[from]
    to = backgroundSlides[to]
    hideSlide(from.selector)
    showSlide(to.selector, to.animation)
  }

  function resetConsumptionMap(){
    //reset circuit 3D view
    TweenMax.to($('#circuit_consumption_wrap'), 1, {"rotationX":"0", "z":0, 'top':'-25px', scaleX:.8, scaleY:.8, ease:Power2.easeInOut})
    TweenMax.to($('#circuit_consumption_wrap div'), 1, {"rotationZ":0, ease:Power2.easeInOut},'-=3')
    TweenMax.killTweensOf($('#circuit_consumption_buildings svg > *'))    
  }

  function hideMap(){
    resetConsumptionMap()
    TweenMax.to($('#circuit_consumption_wrap'), .6, {css:{opacity: 0, display: 'none'}, ease:Power3.easeOut} );
  }

  function showMapWithBuildings() {
    showMap()
    TweenMax.to($('#circuit_consumption_buildings svg > *'), .6, {opacity: .3})
  }

  function showMapNoBuildings() {
    showMap()
    TweenMax.to($('#circuit_consumption_buildings svg > *'), .6, {opacity: 0})
  }

  function showMap(){
    resetConsumptionMap()
    TweenMax.to($('#circuit_consumption_wrap'), .6, {css:{opacity: 1, display: 'block'}, ease:Power3.easeOut} );
  }

}());
