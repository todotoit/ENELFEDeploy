(function() {
  'use strict';
  
  Application.animations.cars_and_teams = Application.animations['cars_and_teams']
    ? Application.animations.cars_and_teams
    : {}
  
  var previous = 0

  var backgroundSlides = [
    {
      selector: '#battery_slide',
      animation: showBatteryCarAnimation
    },
    {
      selector: '#car_slide',
      animation: showCarAnimation
    },
    {
      selector: '#powertrain_slide',
      animation: showPowertrainAnimation
    },
    {
      selector: '#teams_slide',
      animation: null
    },
    {
      selector: '#acquafuel_slide',
      animation: null
    }
  ]
  var slidesContent = {
    'standings': showTeamsStandings,
    'drivetrains_overview': showDrivetrains
  }
    
  Application.animations.cars_and_teams.background = {
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
    TweenMax.set(slideElement.find('label > .slide_plus_btn svg line'), {css:{"stroke":"#0555FA",'background':'#000'}} );
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
    showSlideContent()
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
    Application.states.cars_and_teams.reset();
    from = backgroundSlides[from]
    to = backgroundSlides[to]
    hideSlide(from.selector)
    showSlide(to.selector, to.animation)
  }

  function showCarAnimation(){
    TweenMax.set($('#car_top svg #car_ill *'), {drawSVG:"0%"});
    TweenMax.to($('#car_top svg #car_ill *'), 1.5, {drawSVG:"100%", delay:.4, ease:Power2.easeOut});
  }

  function showBatteryCarAnimation(){
    TweenMax.to($('#battery_points svg'), .6, {css:{rotation: "-=120"}, repeatDelay:.6, repeat:-1, ease:Power1.easeOut} );

    TweenMax.set($('#battery_carfront svg g path'), {drawSVG:"0%"});
    TweenMax.to($('#battery_carfront svg g path'), 1.5, {drawSVG:"100%", delay:.4, ease:Power2.easeOut});

    TweenMax.set($('#battery_body svg *'), {drawSVG:"0%"});
    TweenMax.to($('#battery_body svg *'), 1.5, {drawSVG:"100%", delay:.4, ease:Power2.easeOut});

    TweenMax.set($('#battery_cover svg g *'), {drawSVG:"0%"});
    TweenMax.to($('#battery_cover svg g *'), 1.5, {drawSVG:"100%", delay:.4, ease:Power2.easeOut});
  }


  function showPowertrainAnimation(){
    TweenMax.set($('#ill_powertrain_bgcar svg *'), {drawSVG:"0%"});
    TweenMax.to($('#ill_powertrain_bgcar svg *'), 1.5, {drawSVG:"100%", delay:.4, ease:Power2.easeOut});

    TweenMax.set($('#ill_powertrain_idle svg *'), {drawSVG:"0%"});
    TweenMax.to($('#ill_powertrain_idle svg *'), 1.5, {drawSVG:"100%", delay:.4, ease:Power2.easeOut});

    TweenMax.set($('#ill_powertrain_wheel svg *'), {drawSVG:"0%"});
    TweenMax.to($('#ill_powertrain_wheel svg *'), 1.5, {drawSVG:"100%", delay:.4, ease:Power2.easeOut});

    TweenMax.set($('#ill_powertrain_inverter svg *'), {drawSVG:"0%"});
    TweenMax.to($('#ill_powertrain_inverter svg *'), 1.5, {drawSVG:"100%", delay:.4, ease:Power2.easeOut});
  }

  function showTeamsStandings() {
    setTimeout(function() {
      Application.UI.Standings.animate()
    }, 500);
  }

  function showDrivetrains() {
    setTimeout(function() {
      Application.UI.Sankey.animate()
    }, 500);
  }

}());
