(function() {
	'use strict'
  
  Application.cacheBust()
  
  // initialize all models
  _.each(Application.models, function (v,k) {
    console.debug('init '+v.name)
    Application.models[k].init()
  })
  
  window.oncontextmenu = function(event) {
    if ($(event.target).closest('#streamgraph').length > 0) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
   };

	$(document).ready(function () {

    //TEST FULLSCREEN
    if (bowser.mobile || bowser.tablet) $('#fullscreen').css({'display': 'none'})
    $('#fullscreen').click(function(){
      requestFullscreen(document.documentElement)
    })
    function requestFullscreen(ele) {
          if (ele.requestFullscreen) {
              ele.requestFullscreen();
          } else if (ele.webkitRequestFullscreen) {
              ele.webkitRequestFullscreen();
          } else if (ele.mozRequestFullScreen) {
              ele.mozRequestFullScreen();
          } else if (ele.msRequestFullscreen) {
              ele.msRequestFullscreen();
          } else {
              // Fallback
              console.log('Fullscreen API is not supported.');
          }
      };
    


    // fastclick
    $(function() {
      FastClick.attach(document.body);
    });

		//
    // StateMan bootstrap
    //
    Application.stateman.start()
    // go to welcome if no state is active
    if (Application.stateman.current.name === '') {
      Application.stateman.go('dashboard')
    } else if (Application.stateman.current.name !== 'dashboard') {
      Application.animations.dashboard.collapse()
    }

    //DISABLE SCROLL
    var firstMove;

    window.addEventListener('touchstart', function (e) {
        Application.stateman.emit('event', {name: 'all tap'})
        firstMove = true;
    }, { passive: false });

    window.addEventListener('touchend', function (e) {
        firstMove = true;
    }, { passive: false });

    window.addEventListener('touchmove', function (e) {
        if (firstMove) {
            e.preventDefault();
            firstMove = false;
        }
    }, { passive: false });
    
    // update all models
    // _.each(Application.models, function (v,k) {
    //   console.debug('init '+v.name)
    //   Application.models[k].update()
    // })
    update_all_models()
		
    // var schedule = later.parse.cron('4,9,14,19,24,29,34,39,44,49,54,59 * * * *')
    var schedule = later.parse.text('every '+ Application.sampling_rate +' mins')
    console.info("Setting schedule: ", schedule)
    function updateModels() {
      console.info('later', Date.now())
      Application.UI.createStreamgraph('#streamgraph').update()
      update_all_models()
    }
    // later.setInterval(updateModels, schedule)

    function update_all_models() {      
      Application.models.InstantPowerConsumption.update()
      Application.models.TotalEnergyConsumption.update()

      // charts
      Application.models.TotalEnergyConsumptionByZones.update()
      Application.models.InstantAreaChartPaddock.update()
      
      Application.models.ZoneConsumptionEsports.update()
      Application.models.ZoneDemandEsports.update()
      Application.models.ZoneConsumptionHospitality.update()
      Application.models.ZoneDemandHospitality.update()
      Application.models.ZoneConsumptionEvillage.update()
      Application.models.ZoneDemandEvillage.update()
      Application.models.ZoneConsumptionTv.update()
      Application.models.ZoneDemandTv.update()
      Application.models.ZoneConsumptionPaddock.update()
      Application.models.ZoneDemandPaddock.update()
      
      Application.models.ZoneConsumption.render()
      Application.models.ZoneConsumptionVehicle.render()
    }
    
    // If app is IDLE mode start idle animation
    // Application.environment = 'idle' // to test
    if (Application.environment == 'idle') {
      // in idle mod disable touch
      $('html').addClass('untouchable')
      window.ga = function() { console.info('Google analytics is disabled for idle mod'); return }
      Application.animations.idle.background.createIdle()
      Application.animations.idle.background.start()
    } else {
      window.addEventListener('touchstart', invalidIdleTimeout)
      window.addEventListener('click', invalidIdleTimeout)
      Application.idleTimeout = startIdleTimeout()
    }

    var idleSection = 'dashboard'
    function startIdleTimeout() {
      var time = Application.idle_time * 1000 * 60 // millis to minutes
      console.time('idle state in')
      return setTimeout(function() {
        // emit event for ga
        // emitting event here permits to start a new ga session
        // even if the current state is already dashboard
        Application.stateman.emit('idle')
        //
        if (Application.stateman.active.currentName === idleSection) return
        console.timeEnd('idle state in')
        Application.stateman.go(idleSection)
      }, time);
    }

    function invalidIdleTimeout() {
      if (!Application.idleTimeout) return
      clearTimeout(Application.idleTimeout)
      Application.idleTimeout = startIdleTimeout()
    }

	})

}())
