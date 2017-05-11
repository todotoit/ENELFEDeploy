(function() {
  'use strict'

  // use this to reference current section DOM tree
  var $currentSection = $('section#city-and-racetrack')

  var carousel = null
  var electricityEffectIntervalId = null
  var $chartBars = null
  var doElectricityAnimation = null;
  var delayedTime = null;
  var smartMeterTl = null;
  var mapMarginTop = 0; 

  Application.states.city_and_racetrack = {
    enter: function() {
      Application.UI.setBackgroundColor()
      $currentSection.addClass('visible')
      // cannot be initialized before section is shown
      Application.UI.latinAmericaSlide = Application.UI.createLatinAmericaSlide('#latinamerica_container')
      Application.UI.baMetersMapSlide = Application.UI.createBaMetersMapSlide('#meters_map_container')
      
      carousel = Application.UI.createCarousel('#carousel-city-and-racetrack');
      carousel.on('changed.owl.carousel', function(e) {
        //ON CHANGE
        Application.animations.city_and_racetrack.background.animate(e.page)
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
          Application.animations.city_and_racetrack.background.expand(slide.$element);
        })
      })

      //first slide visible
      TweenMax.set($('#bg-city-and-racetrack .slide'),{opacity:0, display: 'none'})
      TweenMax.set($('#smartgrid_slide'),{opacity:1, display: 'block'})

      TweenMax.set($("#circuit_consumption_wrap"), {css:{transformPerspective:550, transformStyle:"preserve-3d", opacity:0, display:'none'}})

      initAnimations();
      fillConsumptionChart();
      showMicrogridIdle();
      showSmartgridIdle();

      //basic logic for all buttons
      activateButtons();

      Application.states.cars_and_teams.resetTitleTab();
      setTab();
    },
    leave: function() {
      Application.animations.city_and_racetrack.background.reset()
      // if we are going to dashboard we need to manage exit and animation time
      return new Promise(function (resolve) {
        // if next state is not dashboard, do it quick
        if (Application.stateman.current.name !== "dashboard") {
          $currentSection.removeClass('visible')
          carousel.destroy()  
          killAllAnimations('.electricity')
          doElectricityAnimation = false;
          resolve()
        } else {
          // launch expand dashboard animation
          Application.animations.dashboard.expand()
          setTimeout(function () {
            // wait a bit and resolve
            // we are going to go to dashboard with a little delay
            resolve()
          }, 100)
          setTimeout(function () {
            // we also need to
            // destroy the carousel
            carousel.destroy()
            // kill all animations
            killAllAnimations('.electricity')
            doElectricityAnimation = false;
            // all this should happen slighly after promise is resolved
          }, 300)
        }
        // in every case without delay we can unregister listeners
        unregisterButtons()
        // and we should reset tab style
        resetTab();
        console.log('smartMeterTl.stop()')
        smartMeterTl.stop()
      })
    },
    reset: function() {
      resetAllButtons();
      showSmartgridIdle();
    },
    resetTitleTab: function() {
      resetTab();
    }
  }

  var buttonsActive = false;
  function toggleButtonsActive() {
    buttonsActive = true;
    _.debounce(function() { buttonsActive = false }, 600)();
  }

  function activateButtons(){
    TweenMax.to($('#carousel-city-and-racetrack .slide_plus_btn svg line'), .6, {css:{"stroke":"#e71701"}, ease:Power3.easeOut} );   
    $.each($('.button_wrap'), function(i, el){
      //tap on bars
      $(el).click(showRelatedContent); //EDO quando esco dalla sezione questo fa casino... non funziona, forse non resetta bene :(
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
    //TweenMax.to($(button_wrappers).find('.icon svg'), .6, {css:{margin: 0}, ease:Power3.easeOut} );
    TweenMax.to($(button_wrappers).find('.slide_plus_btn svg'), .6, {css:{rotation: 0}, ease:Power3.easeOut} );
    TweenMax.to($('#carousel-city-and-racetrack .slide_plus_btn svg .line1'), .6, {y:0, x: 0, ease:Power3.easeOut} );
    TweenMax.to($('#carousel-city-and-racetrack .slide_plus_btn svg .line2'), .6, {y:0, x: 0, ease:Power3.easeOut} );
    
    TweenMax.to($(button_wrappers).find('.slide_plus_btn svg'), .6, {css:{rotation: 0}, ease:Power3.easeOut} );

    //TweenMax.to($(button_wrappers).find('.slide_plus_btn svg line'), .6, {css:{"stroke":"#FFF"}, ease:Power3.easeOut} );
    //TweenMax.to($(button_wrappers).find('.slide_plus_btn svg circle'), .6, {css:{"stroke":"#FFF", "fill":"transparent"}, ease:Power3.easeOut} );

    if($(this).hasClass('selected')){
      $(this).removeClass('selected');
      TweenMax.to($(button_wrappers), .6, {css:{opacity: 1, display: 'block'}, ease:Power3.easeOut} );
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
      TweenMax.to($(this), .6, {css:{opacity:1, display: 'block'}, ease:Power3.easeOut} );

      //activate this plus button
      TweenMax.to($(this).find('.slide_plus_btn svg'), .6, {css:{rotation: 360}, ease:Power3.easeOut} );
      TweenMax.to($(this).find('.slide_plus_btn svg .line1'), .6, {y:1.8, x:-1, ease:Power3.easeOut} );
      TweenMax.to($(this).find('.slide_plus_btn svg .line2'), .6, {y:-1.8, x:-1, ease:Power3.easeOut} );

      //TweenMax.to($(this).find('.slide_plus_btn svg'), .6, {css:{rotation: 315}, ease:Power3.easeOut} );
      //TweenMax.to($(this).find('.slide_plus_btn svg line'), .6, {css:{"stroke":"#E61400",'background':'#000'}, ease:Power3.easeOut} );
      //TweenMax.to($(this).find('.slide_plus_btn svg circle'), .6, {css:{"stroke":"#FFF", "fill":"#FFF"}, ease:Power3.easeOut} );

      //TweenMax.to($(this).find('.icon svg'), .6, {css:{marginTop: -10, marginBottom: 10}, ease:Power3.easeOut} );
    }
  }

  function resetAllButtons(){
    resetCurrentSlide()
    console.log("resetAllButtons()");
    //TODO: questo dovrebbe resettare tutto alla situa iniziale
    //reset other SVG buttons
    TweenMax.to($('#carousel-city-and-racetrack .slide_plus_btn svg'), .6, {css:{rotation: 0}, ease:Power3.easeOut} );
    TweenMax.to($('#carousel-city-and-racetrack .slide_plus_btn svg .line1'), .6, {y:0, x: 0, ease:Power3.easeOut} );
    TweenMax.to($('#carousel-city-and-racetrack .slide_plus_btn svg .line2'), .6, {y:0, x: 0, ease:Power3.easeOut} );

    TweenMax.to($('#carousel-city-and-racetrack .button_wrap'), .6, {css:{"opacity":1}, ease:Power3.easeOut} );
    $('#carousel-city-and-racetrack .button_wrap').removeClass('selected');
    
    showMicrogridIdle();
    showSmartgridIdle();
    showEnergyMixIdle()
  }

  function showSlideContent(data_link){
    // emit event for ga
    Application.stateman.emit('content', {name: data_link})
    // 
    switch(data_link){
      case 'smartgrid_idle': showSmartgridIdle();
      break;
      case 'smartgrid_urban': showSmartgridUrban(data_link);
      break;
      case 'smartgrid_latinamerica': showSmartgridLatinamerica(data_link);
      break;
      case 'smartgrid_race': showSmartgridRace(data_link);
      break;
      case 'smartgrid_plan': showSmartgridRace(data_link);
      break;
      case 'microgrid_idle': showMicrogridIdle();
      break;
      case 'fans':
      case 'media':
      case 'facilities':
      case 'paddock': showBuilding(data_link);
      break;
      case 'meters_overview': showBuilding(data_link);
      break;
      case 'energy_mix_idle': showEnergyMixIdle();
      break;
      case 'energy_mix_urban': showEnergyMixUrban(data_link);
      break;
      case 'energy_mix_clean': showEnergyMixClean(data_link);
      break;
      case 'energy_mix_temporary': showEnergyMixTemporary(data_link);
      break;
      default: console.log('missing function for '+data_link);
    }
  }

  // Energy mix
  function showEnergyMixIdle(){
    hideEnergyMixSections()
    showEnergyMixSection('energy_mix_idle')

    TweenMax.to($('#donut_clean, #donut_temporary, #donut_urban'), .6, {css:{opacity: 1}, ease:Power3.easeOut} );
  }

  function showEnergyMixUrban(data_link){
    hideEnergyMixSections()
    showEnergyMixSection(data_link)

    TweenMax.to($('#donut_clean'), .6, {css:{opacity: .3}, ease:Power3.easeOut} );
    TweenMax.to($('#donut_temporary'), .6, {css:{opacity: .3}, ease:Power3.easeOut} );
    TweenMax.to($('#donut_urban'), .6, {css:{opacity: 1}, ease:Power3.easeOut} );
    
  }

  function showEnergyMixTemporary(data_link){
    hideEnergyMixSections()
    showEnergyMixSection(data_link)

    TweenMax.to($('#donut_clean'), .6, {css:{opacity: .3}, ease:Power3.easeOut} );
    TweenMax.to($('#donut_temporary'), .6, {css:{opacity: 1}, ease:Power3.easeOut} );
    TweenMax.to($('#donut_urban'), .6, {css:{opacity: .3}, ease:Power3.easeOut} );

  }

  function showEnergyMixClean(data_link){
    hideEnergyMixSections()
    showEnergyMixSection(data_link)

    TweenMax.to($('#donut_clean'), .6, {css:{opacity: 1}, ease:Power3.easeOut} );
    TweenMax.to($('#donut_temporary'), .6, {css:{opacity: .3}, ease:Power3.easeOut} );
    TweenMax.to($('#donut_urban'), .6, {css:{opacity: .3}, ease:Power3.easeOut} );
  }

  function hideEnergyMixSections(){
    TweenMax.to($('.energy_mix_section'), .6, {css:{opacity: 0, display: 'none'}, ease:Power3.easeOut} );
  }

  function showEnergyMixSection(data_link){
    TweenMax.to($('#'+data_link), .6, {css:{opacity: 1, display: 'block'}, ease:Power3.easeOut} );
  }



  // smartgrid
  function showSmartgridIdle(){
    hideSmartgridSections()
    showSmartgridSection('smartgrid_idle')

    //idle
    TweenMax.set($('#smartgrid_container #illustration_smartgrid_idle_bottomleft_container'), {opacity: 0, display: 'none'});
    TweenMax.set($('#smartgrid_container #illustration_smartgrid_idle_bottomright_container'), {opacity: 0, display: 'none'});
    TweenMax.set($('#smartgrid_container #illustration_smartgrid_idle_topleft_container'), {opacity: 0, display: 'none'});
    TweenMax.set($('#smartgrid_container #illustration_smartgrid_idle_topright_container'), {opacity: 0, display: 'none'});
    TweenMax.set($('#illustration_smartgrid_hand_container'), {opacity: 0, display: 'none'});

    //play aniamtion
    smartMeterTl.restart() //riparte ogni volta
  }

  function showSmartgridUrban(data_link){
    hideSmartgridSections()
    showSmartgridSection(data_link)

    //show 
  }

  function showSmartgridRace(data_link){
    hideSmartgridSections()
    showSmartgridSection(data_link)
  }

  function showSmartgridLatinamerica(data_link){
    hideSmartgridSections()
    showSmartgridSection(data_link)

    TweenMax.set($('#smartgrid_latinamerica #cursor'), {css:{opacity: 0, x: '-=600'}} );
    //TweenMax.to($('#smartgrid_latinamerica #cursor'), 1, {css:{opacity: 1, x: 0}, delay:.5, ease:Power2.easeOut} );
  }

  function hideSmartgridSections(){
    smartMeterTl.stop()
    //smartMeterRaceTl.stop()
    TweenMax.to($('.smartgrid_section'), .6, {css:{opacity: 0, display: 'none'}, ease:Power3.easeOut} );
  }

  function showSmartgridSection(data_link){
    TweenMax.to($('#'+data_link), .6, {css:{opacity: 1, display: 'block'}, ease:Power3.easeOut} );
  }


  // microgrid (map + chart bar)
  function showMicrogridIdle(){
    resetConsumptionMap(true);

    //show content
    TweenMax.to($('.microgrid_section'), .6, {css:{opacity: 0, display: 'none'}, ease:Power3.easeOut} );
    TweenMax.to($('#microgrid_idle'), .6, {css:{opacity: 1, display: 'block'}, delay:.3, ease:Power3.easeOut} );
  }

  
  var buildingCoordinates = {
    'media': 250,
    'paddock': 180,
    'fans': 300,
    'facilities': 140,
    'meters_overview': 105
  }

  var buildingRotationX = {
    'media': 50,
    'paddock': 50,
    'fans': 55,
    'facilities': 50,
    'meters_overview': 55
  }



  function showBuilding(data_link){
    TweenMax.set($('#circuit_consumption_buildings svg > *'), {opacity: .3});

    mapMarginTop = 0;
    if(buildingCoordinates[data_link] >=-80 && buildingCoordinates[data_link] <= 0){
      mapMarginTop = -60;
    }else if(buildingCoordinates[data_link] > 0 && buildingCoordinates[data_link] <= 55){
      mapMarginTop = -20;
    }else if(buildingCoordinates[data_link] > 25 && buildingCoordinates[data_link] <= 55){
      mapMarginTop = -65;
    }else if(buildingCoordinates[data_link] > 80 && buildingCoordinates[data_link] <= 130){
      mapMarginTop = -60;
    }else if(buildingCoordinates[data_link] > 130 && buildingCoordinates[data_link] <= 160){
      mapMarginTop = -10;
    }
    else if(buildingCoordinates[data_link] > 160 && buildingCoordinates[data_link] <= 360){
      mapMarginTop = -60;
    }

    //move circuit
    TweenMax.to($('#circuit_consumption_wrap'), 1.6, {"rotationX":buildingRotationX[data_link], "z":-20, top:mapMarginTop, scaleX:.8, scaleY:.8, ease:Power2.easeInOut})
    TweenMax.to($('#circuit_consumption_wrap div'), 1.6, {"rotationZ":buildingCoordinates[data_link], ease:Power2.easeInOut},'-=3')

    //building
    TweenMax.to($('#circuit_consumption_buildings svg > *'), 1, {css:{opacity: .3}, delay:.6, ease:Power3.easeOut})
    TweenMax.to($('#circuit_consumption svg'), 1, {opacity: .3})

    
    switch(data_link){
      case 'media':
        TweenMax.to($('#circuit_consumption_buildings svg > #building_media'), 1, {css:{opacity: 1}, delay:.6, ease:Power3.easeOut})
        break;
      case 'paddock':
        TweenMax.to($('#circuit_consumption_buildings svg > #building_paddock'), 1, {css:{opacity: 1}, delay:.6, ease:Power3.easeOut})
        break;
      case 'fans':
        TweenMax.to($('#circuit_consumption_buildings svg > #building_fans'), 1, {css:{opacity: 1}, delay:.6, ease:Power3.easeOut})
        break;
      case 'facilities': 
        TweenMax.to($('#circuit_consumption_buildings svg > #building_facilities'), 1, {css:{opacity: 1}, delay:.6, ease:Power3.easeOut})
        break;
      case 'meters_overview':
        TweenMax.to($('#circuit_consumption_buildings svg > #building_e_sports'), 1, {css:{opacity: 1}, delay:.6, ease:Power3.easeOut})
        break;
    }
    

    //show content
    TweenMax.to($('.microgrid_section'), .6, {css:{opacity: 0, display: 'none'}, ease:Power3.easeOut} );
    TweenMax.to($('#microgrid_'+data_link), .6, {css:{opacity: 1, display: 'block'}, delay:.3, ease:Power3.easeOut} );

    if(data_link == "meters_overview"){
      TweenMax.set($('#microgrid_meters_overview_extra_info'), {opacity: 0, display: 'none'} );
      TweenMax.set($('#meters_overview_extra_info_text'), {opacity: 0, display: 'none'} );
      TweenMax.to($('#microgrid_meters_overview_extra_info'), .6, {css:{opacity: 1, display: 'block'}, delay:1.5, ease:Power3.easeOut} );
      TweenMax.to($('#meters_overview_extra_info_text'), .6, {css:{opacity: 1, display: 'block'}, delay:1.5, ease:Power3.easeOut} );
    }else{
      TweenMax.to($('#microgrid_meters_overview_extra_info'), .6, {css:{opacity: 0, display: 'none'}, ease:Power3.easeOut} );
      TweenMax.to($('#meters_overview_extra_info_text'), .6, {css:{opacity: 0, display: 'none'}, ease:Power3.easeOut} );
    }
  }

  function resetConsumptionMap(buildings){
    //reset circuit 3D view
    killAllAnimations('#circuit_consumption_wrap');
    killAllAnimations('#circuit_consumption_buildings');
    TweenMax.to($('#circuit_consumption_wrap'), 1, {"rotationX":"0", "z":0, 'top':'-25px', scaleX:.8, scaleY:.8, ease:Power2.easeInOut})
    TweenMax.to($('#circuit_consumption_wrap div'), 1, {"rotationZ":0, ease:Power2.easeInOut},'-=3')

    if(buildings){
      TweenMax.to($('#circuit_consumption_buildings svg > *'), 1, {opacity: .3})
      TweenMax.to($('#circuit_consumption svg'), 1, {opacity: 1})
    }else{
      TweenMax.to($('#circuit_consumption_buildings svg > *'), 1, {opacity: 0})
      TweenMax.to($('#microgrid_meters_overview_extra_info'), .6, {css:{opacity: 0, display: 'none'}, ease:Power3.easeOut} );
    }
    
  }

  function fillConsumptionChart(){
    //attivo i grafici a barre
    $chartBars = $('#microgrid .bar_wrap')

    // viene fatto all'aggiornamento dei dati da remoto
    // $.each($chartBars, function(i, el){
    //   var v = $(el).find('.bar').attr('data-value');
    //   var datum = $(el).find('.bar').attr('data-percentage');
    //   var percentage = Application.UI.percentage(datum)
    //   $(el).find('.bar').css('height',percentage+"%");
    // })
  }

  function setTab(){
    console.log("city setTab()");
    //change top bar color
    TweenMax.to($('.branding'), .6, {css:{"background":"#E61400"}, ease:Power1.easeOut} );

    TweenMax.to($('#nav-city-and-racetrack .nav_section-titlemini'), .6, {css:{"color":"#FFF"}, ease:Power3.easeOut} );
    TweenMax.to($('#nav-city-and-racetrack'), .6, {css:{"backgroundColor":"transparent"}, ease:Power3.easeOut} );
    TweenMax.to($('#nav-city-and-racetrack .navigationplus svg'), .6, {css:{rotation: 360}, ease:Power3.easeOut} );
    TweenMax.to($('#nav-city-and-racetrack .navigationplus svg line'), .6, {css:{"stroke":"#E61400"}, ease:Power3.easeOut} );
    TweenMax.to($('#nav-city-and-racetrack .navigationplus svg circle'), .6, {css:{"stroke":"#FFF", "fill":"#FFF"}, ease:Power3.easeOut} );
    TweenMax.to($('#nav-city-and-racetrack .navigationplus svg .line1'), .6, {css:{y:3, x:-1}, ease:Power3.easeOut} );
    TweenMax.to($('#nav-city-and-racetrack .navigationplus svg .line2'), .6, {css:{y:-3, x:-1}, ease:Power3.easeOut} );
    $('#nav-city-and-racetrack .navigationplus small').text('close')
    TweenMax.to($('#nav-city-and-racetrack .navigationplus small'), .6, {css:{"color":"#FFF"}, ease:Power3.easeOut} );
  }

  function resetTab(){
    console.log("city resetTab()");
    TweenMax.to($('#nav-city-and-racetrack .nav_section-titlemini'), .6, {css:{"color":"#E61400"}, ease:Power3.easeOut} );
    TweenMax.to($('#nav-city-and-racetrack'), .6, {css:{"backgroundColor":"#F7F7F7"}, ease:Power3.easeOut} );
    TweenMax.to($('#nav-city-and-racetrack .navigationplus svg'), .6, {css:{rotation: 0}, ease:Power3.easeOut} );
    TweenMax.to($('#nav-city-and-racetrack .navigationplus svg line'), .6, {css:{"stroke":"#000"}, ease:Power3.easeOut} );
    TweenMax.to($('#nav-city-and-racetrack .navigationplus svg circle'), .6, {css:{"stroke":"#000", "fill":"transparent"}, ease:Power3.easeOut} );
    TweenMax.to($('#nav-city-and-racetrack .navigationplus svg .line1'), .6, {css:{y:0, x:0}, ease:Power3.easeOut} );
    TweenMax.to($('#nav-city-and-racetrack .navigationplus svg .line2'), .6, {css:{y:0, x:0}, ease:Power3.easeOut} );
    $('#nav-city-and-racetrack .navigationplus small').text('explore')
    TweenMax.to($('#nav-city-and-racetrack .navigationplus small'), .6, {css:{"color":"#0a0a0a"}, ease:Power3.easeOut} );
  }

  
  function initAnimations() {
    doElectricityAnimation = true; //if true the electricity alpha effect starts to loop
    
    //animazione del delirio della mano che switcha lo smart meter
    $('#smartgrid_container #illustration_smartgrid_idle_bottomleft_container .electricity').each(function(i,el){
      electricityEffect(el, .4, 2) //element, velocity, appearance time (lower: often)
    })
    $('#smartgrid_container #illustration_smartgrid_idle_bottomright_container .electricity').each(function(i,el){
      electricityEffect(el, .4, 2) //element, velocity, appearance time (lower: often)
    })
    $('#smartgrid_container #illustration_smartgrid_idle_topright_container .electricity').each(function(i,el){
      electricityEffect(el, .4, 2, true) //element, velocity, appearance time (lower: often)
    })
    $('#smartgrid_container #illustration_smartgrid_idle_topleft_container .electricity').each(function(i,el){
      electricityEffect(el, .4, 2, true) //element, velocity, appearance time (lower: often)
    })

    smartMeterTl = new TimelineMax({delay:0, repeat:-1, repeatDelay:0/*, onComplete:restart*/});
    smartMeterTl.to($('#illustration_smartgrid_idle_topleft_container'), .3, {css:{opacity:1, display:'block'}, ease:Power3.easeOut})
                .to($('#illustration_smartgrid_idle_bottomright_container'), .3, {css:{opacity:1, display:'block'}, ease:Power3.easeOut}, '-=.3')
                .to($('#illustration_smartgrid_hand_container'), .2, {css:{opacity:1, display:'block'}, ease:Power3.easeOut}, '+=3')
                .to($('#illustration_smartgrid_hand_container'), .8, {css:{x:20}, ease:Power3.easeOut}) //568
                .to($('#illustration_smartgrid_hand_container'), .2, {css:{opacity:0, display:'none'}, ease:Power3.easeOut}, '-=.2')
                .to($('#smartmeter_point'), .3, {css:{x:10}, ease:Power3.easeOut}, '-=.6')
                .to($('#illustration_smartgrid_idle_topleft_container'), .3, {css:{opacity:0, display:'none'}, ease:Power3.easeOut})
                .to($('#illustration_smartgrid_idle_bottomright_container'), .3, {css:{opacity:0, display:'none'}, ease:Power3.easeOut}, '-=.3')
                .to($('#illustration_smartgrid_idle_topright_container'), .3, {css:{opacity:1, display:'block'}, ease:Power3.easeOut})
                .to($('#illustration_smartgrid_idle_bottomleft_container'), .3, {css:{opacity:1, display:'block'}, ease:Power3.easeOut}, '-=.3')
                .to($('#illustration_smartgrid_hand_container'), .2, {css:{opacity:1, display:'block'}, ease:Power3.easeOut}, '+=3')
                .to($('#illustration_smartgrid_hand_container'), .8, {css:{x:0}, ease:Power3.easeOut}) //568
                .to($('#illustration_smartgrid_hand_container'), .2, {css:{opacity:0, display:'none'}, ease:Power3.easeOut}, '-=.2')
                .to($('#smartmeter_point'), .3, {css:{x:0}, ease:Power3.easeOut}, '-=.6')
    
    smartMeterTl.stop()
    //smartMeterTl.play() //debug

    $('#circuit_consumption_electricity .electricity').each(function(i,el){
      electricityEffect(el, 1.2, 2.5, true) //element, velocity, appearance time (lower: often), invert_direction
    })

    $('#illustration_microgrid_race_container svg path.electricity').each(function(i,el){
      electricityEffect(el, .6, 4, false, true) //element, velocity, appearance time (lower: often), invert_direction, yoyo
    })

    $('#illustration_microgrid_urban_container svg path.electricity').each(function(i,el){
      electricityEffect(el, .6, 4, false, true) //element, velocity, appearance time (lower: often), invert_direction, yoyo
    })

    /*smartMeterRaceTl = new TimelineMax({delay:0, repeat:-1, repeatDelay:0});
    smartMeterRaceTl.to($('#illustration_microgrid_hand_container'), .2, {css:{opacity:1, display:'block'}, ease:Power3.easeOut}, '+=3')
                    .to($('#illustration_microgrid_hand_container'), .8, {css:{x:20}, ease:Power3.easeOut}) //568
                    .to($('#illustration_microgrid_hand_container'), .2, {css:{opacity:0, display:'none'}, ease:Power3.easeOut}, '-=.2')
                    .to($('#smartmeter_point_racetrack'), .3, {css:{x:10}, ease:Power3.easeOut}, '-=.6')
                    .to($('#illustration_microgrid_hand_container'), .2, {css:{opacity:1, display:'block'}, ease:Power3.easeOut}, '+=3')
                    .to($('#illustration_microgrid_hand_container'), .8, {css:{x:0}, ease:Power3.easeOut}) //568
                    .to($('#illustration_microgrid_hand_container'), .2, {css:{opacity:0, display:'none'}, ease:Power3.easeOut}, '-=.2')
                    .to($('#smartmeter_point_racetrack'), .3, {css:{x:0}, ease:Power3.easeOut}, '-=.6')
    
    smartMeterRaceTl.stop()*/
    //smartMeterRaceTl.play() //debug


    $('#smartgrid_latinamerica .electricity').each(function(i,el){
      electricityEffect(el, .6, 2+i/10, true, true) //element, velocity, appearance time (lower: often), invert_direction
    })

   }

  function killAllAnimations(element) {
    $(element).each(function(i,el){
      TweenMax.killTweensOf(el);
    })
  }

  function electricityEffect(el, time, timeapp, invert_direction, yoyo_setting) {
    if(invert_direction){
      TweenMax.set($(el), {drawSVG:"100% 99%", opacity:0, "stroke-linecap":"round"});
      TweenMax.to($(el), time, {drawSVG:"2% 0%", ease:Linear.easeNone, repeat:-1, yoyo:yoyo_setting});
    }else{
      TweenMax.set($(el), {drawSVG:"0% 2%", opacity:0, "stroke-linecap":"round"});
      TweenMax.to($(el), time, {drawSVG:"98% 100%", ease:Linear.easeNone, repeat:-1, yoyo:yoyo_setting});
    }
    electricityAlphaEffect(el, time, timeapp);
  }

  function electricityAlphaEffect(el, time, timeapp){
    TweenMax.to($(el), .1, {css:{opacity:1}, ease:Linear.easeNone, repeat:1, yoyo: true, repeatDelay:.4});
    if(doElectricityAnimation){
      delayedTime = time*timeapp/2+Math.random()*time*timeapp //ok, just a way to randomize and harmonize
      TweenMax.delayedCall(delayedTime, electricityAlphaEffect, [el, time, timeapp]);
    }
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
      $(el).off("click", showRelatedContent)
    })
  }
  
  

}())
