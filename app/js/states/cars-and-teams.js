(function() {
  'use strict'

  // use this to reference current section DOM tree
  var $currentSection = $('section#cars-and-teams')

  var carousel,
      brakesAnimationInterval,
      boostAnimationInterval,
      powerTl = null

  Application.states.cars_and_teams = {
    enter: function() {
      Application.UI.setBackgroundColor()
      $currentSection.addClass('visible')
      // cannot be initialized before section is shown
      Application.UI.Standings = Application.UI.createStandings('#chart_standings')
      Application.UI.AreaChart = Application.UI.createAreaChart('#acquafuel_container')
      Application.UI.Sankey = Application.UI.createSankey('#chart_sankey')

      carousel = Application.UI.createCarousel('#carousel-cars-and-teams');
  		carousel.on('changed.owl.carousel', function(e) {
  		  //ON CHANGE
        Application.animations.cars_and_teams.background.animate(e.page);
        resetCurrentSlide()
        toggleButtonsActive()

        // emit event for ga
        Application.stateman.emit('section', {name:e.page.index})
        // 
      })
      _.each(carousel.slides, function(slide) {
        slide.expandOn('click', function(e) {
          //ON CLICK ON EXPANDABLE LABEL
          carousel.currentSlide = slide;
          // emit event for ga
          var panel = slide.$element.find('.slide_content').attr('data-link')
          Application.stateman.emit('content', {name: panel})
          //
          Application.animations.cars_and_teams.background.expand(slide.$element);
        })
      })

      Application.states.city_and_racetrack.resetTitleTab();
      setTab();

      //first slide visible
      TweenMax.set($('#bg-cars-and-teams .slide'), {opacity: 0, display:'none'});
      TweenMax.set($('#battery_slide'), {opacity: 1, display:'block'});
      
      
      showBatteryIdle();
      showCarIdle();
      showTeamsIdle();
      showPowertrainIdle();
      initAnimations();

      //basic logic for all buttons
      activateButtons();

    },
    leave: function() {
      Application.animations.cars_and_teams.background.reset()
      $currentSection.removeClass('visible')
      resetAllButtons()
      resetTab()
      // in every case without delay we can unregister listeners
      unregisterButtons()
      carousel.destroy()
    },
    reset: function() {
      resetAllButtons();
    },
    resetTitleTab: function() {
      resetTab();
    }
  }

  function initAnimations(){
    powerTl = new TimelineMax({delay:0, repeat:-1, repeatDelay:0/*, onComplete:restart*/});
    powerTl.to($('#phone_battery_line3'), .3, {css:{opacity:1}, ease:Power3.easeOut})
           .to($('#phone_battery_line2'), .3, {css:{opacity:1}, ease:Power3.easeOut})
           .to($('#phone_battery_line1'), .3, {css:{opacity:1}, ease:Power3.easeOut})
           .to($('#phone_battery_line0'), .3, {css:{opacity:1}, ease:Power3.easeOut}, '-=.3')
           .to($('#phone_center'), .5, {css:{x:'-120px'}, delay:.2, ease:Power3.easeOut})
           .to($('#phone_left'), .5, {css:{x:'-60px'}, ease:Power3.easeOut}, '-=0.5')
           .to($('#phone_right'), .5, {css:{x:'-60px'}, ease:Power3.easeOut}, '-=0.5')
           .to($('#phone_right_first'), .5, {css:{x:'-60px'}, ease:Power3.easeOut}, '-=0.5')
    powerTl.stop()

    showBatteryCarAnimation()

    TweenMax.set($('#battery_body_container'), {opacity: 0});
    TweenMax.to($('#battery_body_container'), 0.6, {opacity:1, delay:.4, ease:Power3.easeOut});

    TweenMax.to($('#battery_points svg'), .6, {css:{rotation: "-=120"}, repeatDelay:1, repeat:-1, ease:Power1.easeInOut} );


    TweenMax.to($('#ill_powertrain_wheel svg'), .6, {css:{rotation: "-=360"}, repeat:-1, ease:Linear.easeNone} );
    TweenMax.to($('#inverter_el'), .2, {css:{x:'-=15'}, repeatDelay:.3, repeat:-1, ease:Power3.easeInOut, yoyo: true} );
    TweenMax.to($('#ill_powertrain_traverse_element svg'), .3, {css:{rotation: "-=360"}, repeat:-1, ease:Linear.easeNone} );
  }

  var buttonsActive = false;
  function toggleButtonsActive() {
    buttonsActive = true;
    _.debounce(function() { buttonsActive = false }, 600)();
  }

  function activateButtons(){    
    $.each($('.button_wrap'), function(i, el){
      //tap on bars
      $(el).click(showRelatedContent);
    })
  }
  
  function showRelatedContent(e) {
    // debounce double click
    // else animations will messing up
    e.preventDefault();
    if (buttonsActive) return;
    toggleButtonsActive();

    var buttons = $(this).parent('.buttons');
    var button_wrappers = $(buttons).children('div');
    
    //reset other SVG buttons
    TweenMax.to($(button_wrappers).find('.slide_plus_btn svg'), .6, {css:{rotation: 0}, ease:Power3.easeOut} );
    TweenMax.to($('#carousel-cars-and-teams .slide_plus_btn svg .line1'), .6, {y:0, x: 0, ease:Power3.easeOut} );
    TweenMax.to($('#carousel-cars-and-teams .slide_plus_btn svg .line2'), .6, {y:0, x: 0, ease:Power3.easeOut} );

    TweenMax.to($(button_wrappers).find('.icon'), .6, {css:{margin: 0}, ease:Power3.easeOut} );

    if($(this).hasClass('selected')){
      $(this).removeClass('selected');
      TweenMax.to($(button_wrappers), .6, {css:{opacity: 1}, ease:Power3.easeOut} );
      
      //RESET IDLE VIEW OF CURRENT SLIDE
      showSlideContent(buttons.attr('data-link'));
    }else{
      $(button_wrappers).removeClass('selected');
      $(this).addClass('selected');

      //understand which button is pressed and show related content in slide;
      showSlideContent($(this).attr('data-link'));

      //make other buttons alpha .4
      TweenMax.to($(button_wrappers), .6, {css:{opacity: .4}, ease:Power3.easeOut} ); //EDO fa un effetto strano che non riesco a capire...

      //make this buttons alpha 1
      TweenMax.to($(this), .6, {css:{opacity:1}, ease:Power3.easeOut} );

      //activate this plus button
      TweenMax.to($(this).find('.slide_plus_btn svg'), .6, {css:{rotation: 360}, ease:Power3.easeOut} );
      TweenMax.to($(this).find('.slide_plus_btn svg .line1'), .6, {y:1.8, x:-1, ease:Power3.easeOut} );
      TweenMax.to($(this).find('.slide_plus_btn svg .line2'), .6, {y:-1.8, x:-1, ease:Power3.easeOut} );
    }
  }

  function resetAllButtons(){
    resetCurrentSlide()
    //TODO: questo dovrebbe resettare tutto alla situa iniziale
    //reset other SVG buttons
    TweenMax.to($('#carousel-cars-and-teams .slide_plus_btn svg'), .6, {css:{rotation: 0}, ease:Power3.easeOut} );
    TweenMax.to($('#carousel-cars-and-teams .slide_plus_btn svg .line1'), .6, {y:0, x: 0, ease:Power3.easeOut} );
    TweenMax.to($('#carousel-cars-and-teams .slide_plus_btn svg .line2'), .6, {y:0, x: 0, ease:Power3.easeOut} );

    TweenMax.to($('#carousel-cars-and-teams .button_wrap'), .6, {css:{"opacity":1}, ease:Power3.easeOut} );
    $('#carousel-cars-and-teams .button_wrap').removeClass('selected');
    TweenMax.killTweensOf($('#battery_points svg'));
    powerTl.stop()

    showBatteryIdle();
    showCarIdle();
    showTeamsIdle();
    showPowertrainIdle();
    showAcquafuelIdle();
  }

  function showSlideContent(data_link){
    // emit event for ga
    Application.stateman.emit('content', {name: data_link})
    // 
    switch(data_link){
      case 'battery_idle': showBatteryIdle();
      break;
      case 'battery_power': showBatteryPower(data_link)
      break;
      case 'battery_boost': showBatteryBoost(data_link);
      break;
      case 'battery_brakes': showBatteryBrakes(data_link);
      break;
      case 'battery_recharge': showBatteryRecharge(data_link);
      break;
      case 'car_idle': showCarIdle();
      break;
      case 'car_engine': showCarEngine(data_link);
      break;
      case 'car_tyres': showCarTyres(data_link);
      break;
      case 'car_sound': showCarSound(data_link);
      break;
      case 'teams_idle': showTeamsIdle(data_link);
      break;
      case 'teams_abt': 
      case 'teams_andretti': 
      case 'teams_virgin': 
      case 'teams_faraday': 
      case 'teams_jaguar': 
      case 'teams_mahindra': 
      case 'teams_nextev': 
      case 'teams_renault': 
      case 'teams_techeetah': 
      case 'teams_venturi': showTeams(data_link);
      break;
      case 'powertrain_idle': showPowertrainIdle();
      break;
      case 'powertrain_longitudinal': showPowertrainLongitudinal(data_link);
      break;
      case 'powertrain_traverse1': showPowertrainTraverse1(data_link);
      break;
      case 'powertrain_traverse2': showPowertrainTraverse2(data_link);
      break;
      case 'acquafuel_idle': showAcquafuelIdle();
      break;
      case 'acquafuel_charging': showAcquafuelSlide(data_link);
      break;
      case 'acquafuel_auxiliary': showAcquafuelSlide(data_link);
      break;
      default: console.log('missing function for '+data_link);
    }
  }

  function showBatteryCarAnimation(){
    TweenMax.set($('#battery_carfront svg g path'), {drawSVG:"0%"});
    TweenMax.to($('#battery_carfront svg g path'), 1.5, {drawSVG:"100%", delay:.4, ease:Power2.easeOut});

    TweenMax.set($('#battery_body svg *'), {drawSVG:"0%"});
    TweenMax.to($('#battery_body svg *'), 1.5, {drawSVG:"100%", delay:.4, ease:Power2.easeOut});

    TweenMax.set($('#battery_cover svg g *'), {drawSVG:"0%"});
    TweenMax.to($('#battery_cover svg g *'), 1.5, {drawSVG:"100%", delay:.4, ease:Power2.easeOut});
  }


  //batteries
  function showBatteryIdle(){
    hideBatterySections()

    TweenMax.to($('#battery_body_container'), .6, {css:{opacity:1, display:'block'}, ease:Power3.easeInOut});
    showBatterySection('battery_idle');
  }

  function showBatteryPower(data_link){
    console.log('pippp')
    hideBatterySections()
    showBatterySection(data_link)

    TweenMax.to($('#battery_body_container'), .6, {css:{opacity: 1, display: 'block'}, ease:Power3.easeOut} );
    TweenMax.to($('#battery_power_phone'), .6, {css:{opacity: 1, display: 'block'}, ease:Power3.easeOut} );

    powerAnimation();
  }

  function showBatteryBoost(data_link){
    hideBatterySections()
    showBatterySection(data_link)

    TweenMax.to($('#battery_body_container'), .6, {css:{opacity:1, display:'block'}, ease:Power3.easeInOut});
    TweenMax.to($('#battery_boost_simon'), .6, {css:{opacity: 1, display: 'block'}, ease:Power3.easeOut} );

    boostAnimation();
    boostAnimationInterval = setInterval(boostAnimation, 2200);
  }

  function showBatteryBrakes(data_link){
    hideBatterySections()
    showBatterySection(data_link)

    TweenMax.killTweensOf($('#battery_brake'))
    TweenMax.killTweensOf($('#battery_brake_points'))

    TweenMax.to($('#battery_body_container'), .6, {css:{opacity:1, display:'block'}, ease:Power3.easeInOut});
    TweenMax.to([$('#battery_brake'),$('#battery_brake_points')], .6, {css:{opacity: 1, display: 'block'}, ease:Power3.easeOut} );

    brakesAnimation();
    brakesAnimationInterval = setInterval(brakesAnimation, 2200);
  }

  function showBatteryRecharge(data_link){
    hideBatterySections()
    showBatterySection(data_link)

    rechargeAnimation()
  }

  function showBatterySection(data_link){
    TweenMax.to($('#'+data_link), .6, {css:{opacity: 1, display: 'block'}, delay:.3, ease:Power3.easeOut} );
  }

  function hideBatterySections(){
    TweenMax.to($('.battery_section'), .6, {css:{opacity: 0, display: 'none'}, ease:Power3.easeOut} );

    TweenMax.to([
      $('#battery_brake'),
      $('#battery_clocks'),
      $('#battery_boost_simon'),
      $('#battery_carnormal'),
      $('#battery_brake_points'),
      $('#battery_power_phone')], 
      .3, {css:{opacity: 0, display: 'none'}, ease:Power3.easeOut} );

    //reset scale
    TweenMax.to($('#battery_carfront svg'), .6, {css:{scaleX:1, scaleY:1, y:0, x:0}, ease:Power3.easeOut});
    

    //kill animations
    TweenMax.killTweensOf($('#battery_cover svg'),{y:true})
    TweenMax.to($('#battery_cover svg'),.2,{css:{y:0}, ease:Power3.easeOut});

    clearInterval(brakesAnimationInterval);
    clearInterval(boostAnimationInterval);
  }

  function brakesAnimation(){
    TweenMax.set($('#battery_brake_points svg'), {rotation: 0} );
    TweenMax.to($('#battery_brake_points svg'), 1.5, {css:{rotation: 360}, ease:Power3.easeOut} );

    //shake
    //TweenMax.to($('#battery_cover svg'), 0.1, {y:"+=5", yoyo:true, repeat:7, delay: .4, ease:Power1.easeOut});
    //TweenMax.to($('#battery_cover svg'), 0.1, {y:"-=5", yoyo:true, repeat:7, delay: .4, ease:Power1.easeOut});

    TweenMax.to($('#battery_cover svg'), 1.5, {y:-20, delay: 0, ease:Power3.easeOut});
    TweenMax.to($('#battery_cover svg'), .5, {y:+0, delay: 1.5, ease:Power1.easeOut});
  }

  function boostAnimation(){
    TweenMax.to($('#battery_cover svg'), .2, {y:-8, yoyo:true, repeat:5, ease:Power1.easeOut});
    TweenMax.set($('#battery_boost_simon #flash_circle'), {fill:'transparent'});
    TweenMax.to($('#battery_boost_simon #flash_circle'), .5, {fill:'#FFFFFF', yoyo:true, repeat:1,repeatDelay:.2, ease:Power3.easeOut});

    //TweenMax.to($('#battery_cover svg'), 1.5, {y:"-=40", delay: 0, ease:Power3.easeOut});
    //TweenMax.to($('#battery_cover svg'), .7, {y:"+=40", delay: 1.5, ease:Power1.easeOut});
  }

  function rechargeAnimation(){
    TweenMax.to($('#battery_body_container'), .4, {css:{opacity:0, display:'none'}, ease:Power2.easeInOut});
    TweenMax.to($('#battery_carfront'), .6, {css:{opacity:1, display: 'block'}, ease:Power3.easeOut} );
    TweenMax.to($('#battery_carfront svg'), .6, {css:{scaleX: 0.75, scaleY: 0.75, x:-162, y:10}, ease:Power3.easeOut} );
    TweenMax.to($('#battery_carnormal'), .6, {css:{opacity: 1, display: 'block'}, delay:.6, ease:Power3.easeOut} );

    TweenMax.set($('.battery_clock_fill'), {width:1});
    TweenMax.set($('.battery_clock'), {rotation:0});

    TweenMax.to($('#battery_clocks'), .6, {css:{opacity: 1, display: 'block'}, delay:.6, ease:Power3.easeOut, onComplete:rechargeClockAnimation} );
  }

  function rechargeClockAnimation(){
    var d = 1;
        
    TweenMax.to($('#battery_clock2'), 7.3*d, {css:{rotation:360*5.5}, ease:Linear.easeNone} );
    TweenMax.to($('#battery_clockbattery2 .battery_clock_fill'), 7.3*d, {css:{width:28}, ease:Linear.easeNone} );
    
    TweenMax.to($('#battery_clock1'), 1*d, {css:{rotation:270}, ease:Linear.easeNone} );
    TweenMax.to($('#battery_clockbattery1 .battery_clock_fill'), 1*d, {css:{width:28}, ease:Linear.easeNone} );
  }

  function powerAnimation(){
    powerTl.play()
  }


  //car
  function showCarIdle(){
    hideCarSections();
    showCarSection('car_idle');
  }

  function showCarEngine(data_link){
    hideCarSections()
    showCarSection(data_link)

    TweenMax.to($('#car_top svg #car_engine_ill'), .6, {css:{opacity: 1, display:"block"}, ease:Power3.easeOut} );
    engineAnimation();
  }

  function showCarTyres(data_link){
    hideCarSections()
    showCarSection(data_link)

    TweenMax.to($('#car_top svg #car_tyres_ill'), .6, {css:{opacity: 1, display:"block"}, ease:Power3.easeOut} );
    TweenMax.to($('#car_top svg .copertone'), .6, {css:{opacity: .3, display:"block"}, ease:Power3.easeOut} );

    TweenMax.set($('#car_top svg .copertone'), {opacity:.3});
    $('#car_top svg .copertone').each(function(i, el){
      TweenMax.set(el, {x:0, opacity:.3});
      TweenMax.to(el, 0.3, {x:-21, opacity:.3, repeat:-1, ease:Linear.easeNone});
    })
    
  }

  function showCarSound(data_link){
    hideCarSections()
    showCarSection(data_link) 

    TweenMax.to([$('#car_top svg #car_sound1'),$('#car_top svg #car_sound2')], .6, {css:{opacity: 1, display:"block"}, ease:Power3.easeOut} );
    soundAnimation();
  }

  function hideCarSections(){
    TweenMax.to([
      $('#car_top svg #car_tyres_ill'),
      $('#car_top svg .copertone'),
      $('#car_top svg #car_sound1'),
      $('#car_top svg #car_sound2'),
      $('#car_top svg #car_engine_ill')],
      .4, {css:{opacity: 0, display: 'none'}, ease:Power3.easeOut});
    TweenMax.to($('.car_section'), .6, {css:{opacity: 0, display: 'none'}, ease:Power3.easeOut} );

    //kill animations
    /*$('#car_top svg .copertone').each(function(i, el){
      TweenMax.killTweensOf($('#car_top svg .copertone'));
    })
    TweenMax.killTweensOf($('#car_top svg #car_engine_ill'));*/
  }

  function showCarSection(data_link){
    TweenMax.to($('#'+data_link), .6, {css:{opacity: 1, display: 'block'}, delay:.3, ease:Power3.easeOut} );
    if(data_link == "car_idle"){ //if is not idle: car is alpha .1
      TweenMax.to($('#car_top svg #car_ill'), .6, {css:{opacity: 1}, ease:Power3.easeOut} );
    }else{ //else car is alpha 1

      TweenMax.to($('#car_top svg #car_ill'), .6, {css:{opacity: .3}, ease:Power3.easeOut} );
    }
  }

  function soundAnimation(){
    TweenMax.set($('#car_sound1 path'),{opacity:"1", x:0})
    $('#car_sound1 path').each(function(i, el){
      TweenMax.to($(el), 1, {css:{opacity: 1, x: -5}, delay:.1*i, yoyo:true, repeat:-1, ease:Power3.easeOut} );
      TweenMax.to($(el), 1, {css:{opacity: .5, x: 5}, delay:.1*i, yoyo:true, repeat:-1, ease:Power3.easeOut} );
    })

    TweenMax.set($('#car_sound2 path'),{opacity:"1", x:0})
    $('#car_sound2 path').each(function(i, el){
      TweenMax.to($(el), 1, {css:{opacity: 1, x: 5}, delay:.1*i, yoyo:true, repeat:-1, ease:Power3.easeOut} );
      TweenMax.to($(el), 1, {css:{opacity: .5, x: -5}, delay:.1*i, yoyo:true, repeat:-1, ease:Power3.easeOut} );
    })
  }

  function engineAnimation(){
    TweenMax.set($('#car_engine_ill'), {scale: 1, y:0, x:0})
    TweenMax.to($('#car_engine_ill'), 1, {css:{scale: 1.05, y:-3, x:-2}, repeat:-1, yoyo:true, ease:Power1.easeOut})
  }



  //teams
  function showTeamsIdle(){
    animateCarProfile('show');

    TweenMax.to($('#car_cursor'), .4, {css:{opacity: 0, left: '-300px'}, ease:Power2.easeIn})
    hideTeamsSections()
    TweenMax.to($('#teams_idle'), .6, {css:{opacity: 1, display: 'block'}, delay:.3, ease:Power3.easeOut} );
  }

  function showTeams(data_link){
    showTeamsSection($('#'+data_link));
  }

  function showTeamsSection(el){
    animateCarProfile('hide');

    hideTeamsSections();
    TweenMax.to($('#car_cursor'), .4, {css:{opacity: 0, left: -300}, ease:Power2.easeIn})
    TweenMax.to($('#car_cursor'), 1, {css:{opacity: 1, left: -100}, delay:.5, ease:Power3.easeOut})

    if(el){
      TweenMax.to(el, .6, {css:{opacity: 1, display: 'block'}, delay:.3, ease:Power3.easeOut} );
      TweenMax.set($(el).find('.car_profile'), {opacity:0, left:300});
      TweenMax.to($(el).find('.car_profile'), .8, {css:{opacity: 1, left:280}, delay:.7, ease:Power3.easeOut} );
    }
  }

  function hideTeamsSections(){
    TweenMax.to($('.teams_section'), .6, {css:{opacity: 0, display: 'none'}, ease:Power3.easeOut} );
  }

  function animateCarProfile(toState){
    if(toState == 'show'){
      TweenMax.set($('#idle_car_profile svg g > *'), {drawSVG:"0%"});
      TweenMax.to($('#idle_car_profile svg g#traccia > *'), 1.5, {drawSVG:"100%", delay:.4, ease:Power2.easeOut});
    }else if(toState == 'hide'){
      TweenMax.to($('#idle_car_profile svg g#traccia > *'), 1.5, {drawSVG:"0%", delay:0, ease:Power2.easeOut});
    }
  }

  //powertrain
  function showPowertrainIdle(){
    hidePowertrainSections()
    showPowertrainSection('powertrain_idle');
    TweenMax.to([
      $('#ill_powertrain_idle'),
      $('#ill_powertrain_longitudinal')],
      .4, {css:{opacity: 1, display: 'block'}, ease:Power3.easeOut});
  }

  function showPowertrainSection(data_link){
    TweenMax.to($('#'+data_link), .6, {css:{opacity: 1, display: 'block'}, delay:.3, ease:Power3.easeOut} );
  }

  function showPowertrainLongitudinal(data_link){
    hidePowertrainIdleIll();
    hidePowertrainSections();
    showPowertrainSection(data_link)
    TweenMax.to('#ill_powertrain_longitudinal', .6, {opacity:1, display:"block", ease:Power3.easeOut});
  }

  function showPowertrainTraverse1(data_link){
    hidePowertrainIdleIll();
    hidePowertrainSections();
    showPowertrainSection(data_link)
    TweenMax.to('#ill_powertrain_traverse1', .6, {opacity:1, display:"block", ease:Power3.easeOut});
    TweenMax.to('#ill_powertrain_traverse_element', .6, {opacity:1, display:"block", ease:Power3.easeOut});
  }

  function showPowertrainTraverse2(data_link){
    hidePowertrainIdleIll();
    hidePowertrainSections();
    showPowertrainSection(data_link)
    TweenMax.to('#ill_powertrain_traverse2', .6, {opacity:1, display:"block", ease:Power3.easeOut});
    TweenMax.to('#ill_powertrain_traverse_element', .6, {opacity:1, display:"block", ease:Power3.easeOut});
  }

  function hidePowertrainIdleIll(){
    TweenMax.to([
      $('#ill_powertrain_idle'),
      $('#ill_powertrain_longitudinal')],
      .4, {css:{opacity: 0, display: 'none'}, ease:Power3.easeOut});
  }

  function hidePowertrainSections(){
    TweenMax.to([
      $('#ill_powertrain_traverse1'),
      $('#ill_powertrain_traverse2'),
      $('#ill_powertrain_traverse_element')],
      .4, {css:{opacity: 0, display: 'none'}, ease:Power3.easeOut});
    TweenMax.to($('.powertrain_section'), .6, {css:{opacity: 0, display: 'none'}, ease:Power3.easeOut} );
  }

  function showAcquafuelIdle() {
    Application.UI.AreaChart.selectAll();
    TweenMax.to([
      $('#acquafuel_auxiliary'),
      $('#acquafuel_charging')],
      .4, {css:{opacity: 0, display: 'none'}, ease:Power3.easeOut});
    TweenMax.to('#acquafuel_idle', .6, {opacity:1, display:"block", delay: .4, ease:Power3.easeOut});
  }

  function showAcquafuelSlide(data_link) {
    switch(data_link) {
      case 'acquafuel_charging': {
        Application.UI.AreaChart.select('car_charging');
        TweenMax.to([
          $('#acquafuel_idle'),
          $('#acquafuel_auxiliary')],
          .4, {css:{opacity: 0, display: 'none'}, ease:Power3.easeOut});
        TweenMax.to('#acquafuel_charging', .6, {opacity:1, display:"block", delay: .4, ease:Power3.easeOut});
      }
      break;
      case 'acquafuel_auxiliary': {
        Application.UI.AreaChart.select('pit_utilities');
        TweenMax.to([
          $('#acquafuel_idle'),
          $('#acquafuel_charging')],
          .4, {css:{opacity: 0, display: 'none'}, ease:Power3.easeOut});
        TweenMax.to('#acquafuel_auxiliary', .6, {opacity:1, display:"block", delay: .4, ease:Power3.easeOut});
      }
      break;
    }
  }

  ///////////////////////

  function setTab(){
    console.log("cars setTab()");
    //change top bar color
    TweenMax.to($('.branding'), .6, {css:{"background":"#0555FA"}, ease:Power3.easeOut} );

    TweenMax.to($('#nav-cars-and-teams .nav_section-titlemini'), .6, {css:{"color":"#FFF"}, ease:Power3.easeOut} );
    TweenMax.to($('#nav-cars-and-teams'), .6, {css:{"backgroundColor":"transparent"}, ease:Power3.easeOut} );
    TweenMax.to($('#nav-cars-and-teams .navigationplus svg'), .6, {css:{"margin-top":"5px", rotation: 360}, ease:Power3.easeOut} );
    TweenMax.to($('#nav-cars-and-teams .navigationplus svg line'), .6, {css:{"stroke":"#0555FA"}, ease:Power3.easeOut} ); 
    TweenMax.to($('#nav-cars-and-teams .navigationplus svg circle'), .6, {css:{"stroke":"#fff", "fill":"#fff"}, ease:Power3.easeOut} );
    TweenMax.to($('#nav-cars-and-teams .navigationplus svg .line1'), .6, {css:{y:3, x:-1}, ease:Power3.easeOut} );
    TweenMax.to($('#nav-cars-and-teams .navigationplus svg .line2'), .6, {css:{y:-3, x:-1}, ease:Power3.easeOut} );
    $('#nav-cars-and-teams .navigationplus small').text('close')
    TweenMax.to($('#nav-cars-and-teams .navigationplus small'), .6, {css:{"color":"#FFF"}, ease:Power3.easeOut} );
  }

  function resetTab(){
    console.log("cars resetTab()");
    TweenMax.to($('#nav-cars-and-teams .nav_section-titlemini'), .6, {css:{"color":"#0555FA"}, ease:Power3.easeOut} );
    TweenMax.to($('#nav-cars-and-teams'), .6, {css:{"backgroundColor":"#F7F7F7"}, ease:Power3.easeOut} );
    TweenMax.to($('#nav-cars-and-teams .navigationplus svg'), .6, {css:{rotation: 0}, ease:Power3.easeOut} );
    TweenMax.to($('#nav-cars-and-teams .navigationplus svg line'), .6, {css:{"stroke":"#000"}, ease:Power3.easeOut} );
    TweenMax.to($('#nav-cars-and-teams .navigationplus svg circle'), .6, {css:{"stroke":"#000", "fill":"transparent"}, ease:Power3.easeOut} );
    TweenMax.to($('#nav-cars-and-teams .navigationplus svg .line1'), .6, {css:{y:0, x:0}, ease:Power3.easeOut} );
    TweenMax.to($('#nav-cars-and-teams .navigationplus svg .line2'), .6, {css:{y:0, x:0}, ease:Power3.easeOut} );
    $('#nav-cars-and-teams .navigationplus small').text('explore')
    TweenMax.to($('#nav-cars-and-teams .navigationplus small'), .6, {css:{"color":"#0a0a0a"}, ease:Power3.easeOut} );
  }

  function resetCurrentSlide() {
    if (!carousel.currentSlide) return
    // hide label svg
    TweenMax.to(carousel.currentSlide.$element.find('label > .slide_plus_btn'), .3, {css:{opacity: 0, display: 'none'}} );
    // show buttons
    TweenMax.to(carousel.currentSlide.$element.find('.buttons'), .3, {css:{opacity: 1, display: 'flex'}, delay:.3} );
    // hide content
    TweenMax.to(carousel.currentSlide.$element.find('.slide_content'), .3, {css:{opacity: 0, display: 'none'}} );
    // remove expanded class
    TweenMax.to(carousel.currentSlide.$element, .6, {className:'-=expanded', delay:.3, ease:Power3.easeOut} );
  }

  function unregisterButtons() {
    $.each($('.button_wrap'), function(i, el){
      $(el).off('click', showRelatedContent)
    })
  }

}())
