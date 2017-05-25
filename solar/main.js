(function (angular) {
  'use strict'

  /**
    StackedAreaChart
  **/

  angular
    .module('StackedAreaChart', [
      'MainApp'
    ])

}(window.angular));

(function (angular, jq) {
  'use strict'

  /**
  **/

  angular
    .module('StackedAreaChart')
    .component('areaChart', {
      templateUrl: '../js/components/stackedAreaChart/template.html',
      controller: AreaChartCtrl,
      controllerAs: 'areaChart',
      bindings: {
        datasource: '<'
      }
    })

  /* @ngInject */
  function AreaChartCtrl($scope, $element, $attrs, d3, _) {
    var ctrl = this

    // https://github.com/angular/angular.js/issues/14433
    // for the issue above we decided to use just $onChanges
    // ctrl.$onInit = init
    ctrl.$onChanges = update

    // -------- SVG ELEMENTS ---------
    var svg, box, w, h, p,                    // svg config
        axY, axX,                             // axis and scales config
        areas, lns, interpolation = 'linear', // chart paths config
        delay = 100, duration = 300           // animation config

    // -------- SCALES ---------
    var Y = d3.scale.linear()
    var X = d3.time.scale()

    // -------- AXIS ---------
    var formatY = d3.format('.1f')
    var axisY   = d3.svg.axis()
                    .scale(Y)
                    .orient('left')
                    .tickSize(2)
                    .tickFormat(function(d,i) {
                      if(i === 0) return
                      return formatY(d)
                    })

    var formatX = d3.time.format('%H:%M')
    var axisX   = d3.svg.axis()
                    .scale(X)
                    .orient('bottom')
                    .tickSize(2)
                    .ticks(d3.time.hours)
                    .tickFormat(function(d,i) {
                      if(i === 0) return
                      return formatX(d)
                    })

    // -------- STACK ---------
    var stack = d3.layout.stack()
                  .values(function(d) { return d.values })
                  .x(function(d) { return moment(d.h) })
                  .y(function(d) { return d.v })

    // -------- STACKED AREAS ---------
    var area = d3.svg.area()
                 .x(function(d) { return p + X(moment(d.h)) })
                 .y0(function(d) { return p + Y(d.y0) })
                 .y1(function(d) { return p + Y(d.y+d.y0) })
                 .interpolate(interpolation)

    // -------- TOP LINE ---------
    var topLine = d3.svg.line()
                    .x(function(d, i){ return p + X(moment(d.h)) })
                    .y(function(d, i){ return p + Y(d.v) })
                    .interpolate(interpolation)

    function _emptyData(data) {
      var values = data.values
      var emptydata = {
        key: data.key,
        values: values.map(function(d){ return { h: d.h, v: 0 } })
      }
      return emptydata
    }

    function init() {
      console.log('init areaChart')
      var data = ctrl.datasource

      // -------- INITIALIZE CHART ---------
      svg = d3.select($element.find('svg').get(0))
      box = svg.attr('viewBox').split(' ')
      w   = +box[2] // width
      h   = +box[3] // height
      p   = 30      // padding
      // create path for each area
      areas = svg.append('g')
      _.times(data.length, function(i) {
        areas.append('path').attr('class', 'area area'+(i+1))
      })
      // create path for top line
      lns = svg.append('g').append('path')
      // create path for axis
      axY = svg.append('g')
               .attr('transform', 'translate('+p+', '+p+')')
               .attr('class', 'axis')
      axX = svg.append('g')
               .attr('transform', 'translate('+p+', '+(h-p)+')')
               .attr('class', 'axis')

      // Initialize chart with emptyData
      var emptydata = _.map(data, function(d) {
        return _emptyData(d)
      })
      emptydata = stack(emptydata)

      // -------- DATA MAP ---------
      var emptyValues  = _(emptydata).groupBy('key').mapValues(function(d){ return d[0].values }).merge().values().flatten().value()
      var emptyTotData = _(emptyValues).groupBy('h').map(function(d){ return { h:d[0].h, v:_.sumBy(d,'v') } }).value()
      var max = 0
      // update scales domain and range
      var xDomain = d3.extent(data[0].values, function(d) { return moment(d.h) })
      X.domain(xDomain)
       .range([0, w-(p*2)])
      var yDomain = [0, max]
      Y.domain(yDomain)
       .range([h-(p*2), 0])
      // update charts
      areas.selectAll('path')
           .data(emptydata)
           .attr('d', function(d){ return area(d.values) })
      lns.attr('d', topLine(emptyTotData))
         .style('fill', 'none')
         .style('stroke', 'white')
         .style('stroke-width', 0)
      // update axis data
      axY.call(axisY)
      axX.call(axisX)
    }

    function update(changedObj) {
      var prevData = changedObj.datasource.previousValue
      var data     = changedObj.datasource.currentValue
      // !!
      // https://github.com/angular/angular.js/issues/14433
      // for some weird reason component $onChanges is called before $onInit
      // so we assume that if we don't have prevData the components is never being initialized
      if (_.isEmpty(prevData)) init()
      console.log('update areaChart')
      data = stack(data)

      // -------- DATA MAP ---------
      var values  = _(data).groupBy('key').mapValues(function(d){ return d[0].values }).merge().values().flatten().value()
      var totData = _(values).groupBy('h').map(function(d){ return { h:d[0].h, v:_.sumBy(d,'v') } }).value()
      var max     = _.maxBy(totData, 'v').v
      // update scales domain and range
      var xDomain = d3.extent(data[0].values, function(d) { return moment(d.h) })
      X.domain(xDomain)
       .range([0, w-(p*2)])
      var yDomain = [0, max]
      Y.domain(yDomain)
       .range([h-(p*2), 0])
      // update charts
      areas.selectAll('path')
           .data(data)
           .transition()
           .delay(delay)
           .duration(duration)
           .attr('d', function(d){
              return area(d.values)
            })
      var strokeWidth = data.length
      // check empty data set
      _.each(data, function(d) { if (_.every(d.values, {v: 0})) strokeWidth-- })
      // if data set is complete add 1 point to stroke
      if (strokeWidth === data.length) strokeWidth+=1
      lns.transition()
         .delay(delay)
         .duration(duration)
         .attr('d', topLine(totData))
         .style('stroke-width', strokeWidth)
      // update axis data
      axY.transition().delay(delay).call(axisY)
      axX.transition().delay(delay).call(axisX)
    }
  }
}(window.angular, window.angular.element));

(function (angular) {
  'use strict'

  /**
    BatteryAnimation
  **/

  angular
    .module('BatteryAnimation', [
      'MainApp'
    ])

}(window.angular));

(function (angular, jq) {
  'use strict'

  /**
  **/

  angular
    .module('BatteryAnimation')
    .component('carBattery', {
      templateUrl: '../js/components/batteryAnimation/assets/svg/car_battery.svg',
      controller: BatteryAnimationCtrl,
      controllerAs: 'carBattery',
      bindings: {}
    })

  /* @ngInject */
  function BatteryAnimationCtrl($scope, $element, $attrs, TweenMax) {
    var ctrl = this
    ctrl.componentPath = '../js/components/batteryAnimation'
    ctrl.svgPath = ctrl.componentPath + '/assets/svg'

    // https://github.com/angular/angular.js/issues/14433
    // for the issue above we decided to use just $onChanges
    ctrl.$onInit = init
    // ctrl.$onChanges = update

    // -------

    // init after dom loaded
    function init() {
      carAnimation()
      batteryAnimation()
    }
    // function update(changedObj) {}

    function carAnimation() {
      TweenMax.set('g#car_front path', { drawSVG:"0%" })
      TweenMax.to('g#car_front path',  1.5, { drawSVG:"100%", delay:.4, ease:Power2.easeOut })
    }

    function batteryAnimation() {
      TweenMax.set('g#battery_body *',    { drawSVG:"0%" })
      TweenMax.set('g#battery_cover *', { drawSVG:"0%" })
      TweenMax.to('g#battery_body *',     1.5, { drawSVG:"100%", delay:.4, ease:Power2.easeOut })
      TweenMax.to('g#battery_cover *',  1.5, { drawSVG:"100%", delay:.4, ease:Power2.easeOut })
      TweenMax.to('g#rotating_points',      .6, { css: { rotation: "-=120", transformOrigin:"50% 50%" }, repeatDelay:.6, repeat:-1, ease:Power1.easeOut })
    }

    // event handlers
    // $scope.$on('svg:all-loaded', function() {
    //   console.log('init animation')
    //   carAnimation()
    //   batteryAnimation()
    // })

    // deregister event handlers
    // $scope.$on events will be automatically deleted on $destroy
    // $scope.$on('$destroy', function () {})
  }

}(window.angular, window.angular.element));

(function (angular) {
  'use strict'

  /**
    BatteryAnimation
  **/

  angular
    .module('NightDayAnimation', [
      'MainApp'
    ])

}(window.angular));

(function (angular, jq) {
  'use strict'

  /**
  **/

  angular
    .module('NightDayAnimation')
    .component('carNightday', {
      templateUrl: '../js/components/nightdayAnimation/assets/svg/illustration_daynight.svg',
      controller: NightDayAnimationCtrl,
      controllerAs: 'carNightday',
      bindings: {}
    })

  /* @ngInject */
  function NightDayAnimationCtrl($scope, $element, $attrs, TweenMax) {
    var ctrl = this
    ctrl.componentPath = '../js/components/nightdayAnimation'
    ctrl.svgPath = ctrl.componentPath + '/assets/svg'

    // https://github.com/angular/angular.js/issues/14433
    // for the issue above we decided to use just $onChanges
    ctrl.$onInit = init
    // ctrl.$onChanges = update

    var animationTiming = 6 //seconds

    // -------

    // init after dom loaded
    function init() {
      skyAnimation()
      carAnimation()
    }
    // function update(changedObj) {}

    function skyAnimation() {
      TweenMax.to('g#sky',  animationTiming, { css: { rotation: "+=280", transformOrigin:"50% 50%" }, ease:Linear.easeNone })
      TweenMax.to('g#sun_rays',  3, { css: { rotation: "-=360", transformOrigin:"50% 50%" }, ease:Linear.easeNone, repeat:-1 })
      TweenMax.to('#moon',  animationTiming, { css: { rotation: "-=280", transformOrigin:"50% 50%" }, ease:Linear.easeNone })

    }

    function carAnimation(){
      TweenMax.from(['g#wheel_rear','g#wheel_front','#car'],  2, { css: { x: "-=1360" }, ease:Power2.easeOut})

      TweenMax.to(['g#wheel_rear','g#wheel_front'],  .7, { css: { rotation: "+=360", transformOrigin:"50% 50%" }, ease:Linear.easeNone, repeat:-1 })
    
      TweenMax.to(['g#wheel_rear','g#wheel_front','#car'],  2, { css: { x: "+=1360" }, ease:Power2.easeIn, delay: animationTiming-.5 })
    }



    // event handlers
    // $scope.$on('svg:all-loaded', function() {
    //   console.log('init animation')
    //   carAnimation()
    //   batteryAnimation()
    // })

    // deregister event handlers
    // $scope.$on events will be automatically deleted on $destroy
    // $scope.$on('$destroy', function () {})
  }

}(window.angular, window.angular.element));

(function (angular) {
  'use strict'

  /**
    BatteryAnimation
  **/

  angular
    .module('V2GAnimation', [
      'MainApp'
    ])

}(window.angular));

(function (angular, jq) {
  'use strict'

  /**
  **/

  angular
    .module('V2GAnimation')
    .component('carV2g', {
      templateUrl: '../js/components/v2gAnimation/assets/svg/illustration_v2g.svg',
      controller: V2GAnimationCtrl,
      controllerAs: 'carV2g',
      bindings: {}
    })

  /* @ngInject */
  function V2GAnimationCtrl($scope, $element, $attrs, TweenMax) {
    var ctrl = this
    ctrl.componentPath = '../js/components/v2gAnimation'
    ctrl.svgPath = ctrl.componentPath + '/assets/svg'

    // https://github.com/angular/angular.js/issues/14433
    // for the issue above we decided to use just $onChanges
    ctrl.$onInit = init
    // ctrl.$onChanges = update

    var v2gTimeline = null

    // -------

    // init after dom loaded
    function init() {
      v2gTimeline = new TimelineMax({repeat:-1});
      streetAnimation()
    }
    // function update(changedObj) {}

    function streetAnimation() {
      v2gTimeline.set($('#background_container'), {x:-50, ease:Expo.easeOut})
      v2gTimeline.set($('#cable'), {css:{opacity:0}})
      v2gTimeline.set($('#cable_electricity_in'), {css:{opacity:0}})
      v2gTimeline.set($('#cable_electricity_out'), {css:{opacity:0}})


      v2gTimeline.to($('#background_container'),3, {x:'-=530', ease:Power2.easeInOut})

                 .from([$('#cara'),$('#carb')],1, {y:'+=100', ease:Power1.easeOut}, "-=2")
                 .to([$('#cara'),$('#carb')],1, {y:'-=300', ease:Power1.easeIn}, "-=.5")

                 .to($('#cable'),.5, {css:{opacity:.3}, ease:Power2.easeOut})
                 .to($('#cable_electricity_out'),.5, {css:{opacity:1}, ease:Power2.easeOut}, "-=.5")
                 .to($('#battery'),2, {css:{scaleX:.2}, ease:Linear.easeNone}, "-=.5")

                 .to($('#cable'),.5, {css:{opacity:0}, ease:Power2.easeOut})
                 .to($('#cable_electricity_out'),.5, {css:{opacity:0}, ease:Power2.easeOut}, "-=.5")

                 .to($('#background_container'),3, {x:'-=430', ease:Power2.easeInOut})
                 .to($('#battery'),1, {css:{scaleX:.35}, ease:Linear.easeNone}, "-=2")

                 .to($('#cable'),.5, {css:{opacity:.3}, ease:Power2.easeOut})
                 .to($('#cable_electricity_in'),.5, {css:{opacity:1}, ease:Power2.easeOut}, "-=.5")
                 .to($('#battery'),2, {scaleX:1, ease:Linear.easeNone}, "-=.5")

                 .to($('#cable'),.5, {css:{opacity:0}, ease:Power2.easeOut})
                 .to($('#cable_electricity_in'),.5, {css:{opacity:0}, ease:Power2.easeOut}, "-=.5")
    }


    // event handlers
    // $scope.$on('svg:all-loaded', function() {
    //   console.log('init animation')
    //   carAnimation()
    //   batteryAnimation()
    // })

    // deregister event handlers
    // $scope.$on events will be automatically deleted on $destroy
    $scope.$on('$destroy', function () {
      v2gTimeline.kill()
      v2gTimeline.clear()
      TweenMax.killAll()
    })
  }

}(window.angular, window.angular.element));

(function (angular) {
  'use strict'

  /**
    BatteryAnimation
  **/

  angular
    .module('Solar25kmAnimation', [
      'MainApp'
    ])

}(window.angular));

(function (angular, jq) {
  'use strict'

  /**
  **/

  angular
    .module('Solar25kmAnimation')
    .component('solar25km', {
      templateUrl: '../js/components/solar25kmAnimation/assets/svg/illustration_solar.svg',
      controller: solarAnimationCtrl,
      controllerAs: 'solar25km',
      bindings: {}
    })

  /* @ngInject */
  function solarAnimationCtrl($scope, $element, $attrs, TweenMax) {
    var ctrl = this
    ctrl.componentPath = '../js/components/solar25kmAnimation'
    ctrl.svgPath = ctrl.componentPath + '/assets/svg'

    // https://github.com/angular/angular.js/issues/14433
    // for the issue above we decided to use just $onChanges
    ctrl.$onInit = init
    // ctrl.$onChanges = update

    // -------

    // init after dom loaded
    function init() {
      mexicoAnimation()
    }
    // function update(changedObj) {}

    function mexicoAnimation() {
      TweenMax.set('#mexico path', { drawSVG:"0%" })
      TweenMax.to('#mexico path',  1.5, { drawSVG:"100%", delay:.4, ease:Power1.easeOut, onComplete:mexicoAnimationReverse })

    }

    function mexicoAnimationReverse() {
      TweenMax.to('#mexico path',  1.5, { drawSVG:"0%", delay:.4, ease:Power1.easeOut, onComplete:mexicoAnimation })

    }


    // event handlers
    // $scope.$on('svg:all-loaded', function() {
    //   console.log('init animation')
    //   carAnimation()
    //   batteryAnimation()
    // })

    // deregister event handlers
    // $scope.$on events will be automatically deleted on $destroy
    // $scope.$on('$destroy', function () {})
  }

}(window.angular, window.angular.element));

(function (angular) {
  'use strict'

  /**
    BatteryAnimation
  **/

  angular
    .module('SolarMexicoAnimation', [
      'MainApp'
    ])

}(window.angular));

(function (angular, jq) {
  'use strict'

  /**
  **/

  angular
    .module('SolarMexicoAnimation')
    .component('solarMexico', {
      templateUrl: '../js/components/solarMexicoAnimation/assets/svg/illustration_solarmexico.svg',
      controller: NightDayAnimationCtrl,
      controllerAs: 'solarMexico',
      bindings: {}
    })

  /* @ngInject */
  function NightDayAnimationCtrl($scope, $element, $attrs, TweenMax) {
    var ctrl = this
    ctrl.componentPath = '../js/components/solarMexicoAnimation'
    ctrl.svgPath = ctrl.componentPath + '/assets/svg'

    // https://github.com/angular/angular.js/issues/14433
    // for the issue above we decided to use just $onChanges
    ctrl.$onInit = init
    // ctrl.$onChanges = update

    var solarMexicoTimeline = null

    // -------

    // init after dom loaded
    function init() {
      solarMexicoTimeline = new TimelineMax({repeat:-1});
      skyAnimation()
    }
    // function update(changedObj) {}

    function skyAnimation() {
      solarMexicoTimeline.set([$('#light1'),$('#light2'),$('#light3'),$('#light4')], {css:{opacity:0}})

      solarMexicoTimeline.to('#sky',  2, { css: { rotation: "+=180", transformOrigin:"50% 50%" }, ease:Power1.easeInOut,  delay:2 })
                         .to('#sun_rays',  2, { css: { rotation: "-=180", transformOrigin:"50% 50%" }, ease:Power1.easeInOut}, '-=2')
                         .to('#moon',  2, { css: { rotation: "-=180", transformOrigin:"50% 50%" }, ease:Power1.easeInOut }, '-=2')
                         .to($('#village'), 2, {css:{opacity:.3}, ease:Power1.easeOut}, '-=2')

                         .to($('#light1'), 1, {css:{opacity:.95}, ease: RoughEase.ease.config({ template:  Power0.easeNone, strength: 1, points: 20, taper: "none", randomize:  true, clamp: false})})
                         .to($('#light2'), 1, {css:{opacity:.95}, ease: RoughEase.ease.config({ template:  Power0.easeNone, strength: 1, points: 20, taper: "none", randomize:  true, clamp: false})}, '-=.8')
                         .to($('#light3'), 1, {css:{opacity:.95}, ease: RoughEase.ease.config({ template:  Power0.easeNone, strength: 1, points: 20, taper: "none", randomize:  true, clamp: false})}, '-=.6')
                         .to($('#light4'), 1, {css:{opacity:.95}, ease: RoughEase.ease.config({ template:  Power0.easeNone, strength: 1, points: 20, taper: "none", randomize:  true, clamp: false})}, '-=.7')


                         .to('#sky',  2, { css: { rotation: "+=180", transformOrigin:"50% 50%" }, ease:Power1.easeInOut, delay:2 })
                         .to($('#village'), 2, {css:{opacity:1}, ease:Power1.easeOut}, '-=2')
                         .to('#sun_rays',  2, { css: { rotation: "-=180", transformOrigin:"50% 50%" }, ease:Power1.easeInOut}, '-=2')
                         .to('#moon',  2, { css: { rotation: "-=180", transformOrigin:"50% 50%" }, ease:Power1.easeInOut }, '-=2')
                         .to([$('#light1'),$('#light2'),$('#light3'),$('#light4')], 1, {css:{opacity:0}, ease:Power1.easeOut}, '-=2')
    }


    // event handlers
    // $scope.$on('svg:all-loaded', function() {
    //   console.log('init animation')
    //   carAnimation()
    //   batteryAnimation()
    // })

    // deregister event handlers
    // $scope.$on events will be automatically deleted on $destroy
    $scope.$on('$destroy', function () {
      solarMexicoTimeline.kill()
      solarMexicoTimeline.clear()
      TweenMax.killAll()
    })
  }

}(window.angular, window.angular.element));

(function (angular) {
  'use strict'

  /**
    BatteryAnimation
  **/

  angular
    .module('FastRechargeAnimation', [
      'MainApp'
    ])

}(window.angular));

(function (angular, jq) {
  'use strict'

  /**
  **/

  angular
    .module('FastRechargeAnimation')
    .component('fastRecharge', {
      templateUrl: '../js/components/fastRechargeAnimation/assets/svg/illustration_fastcharge.svg',
      controller: FastRechargeCtrl,
      controllerAs: 'fastRecharge',
      bindings: {}
    })

  /* @ngInject */
  function FastRechargeCtrl($scope, $element, $attrs, TweenMax) {
    var ctrl = this
    ctrl.componentPath = '../js/components/fastRechargeAnimation'
    ctrl.svgPath = ctrl.componentPath + '/assets/svg'

    // https://github.com/angular/angular.js/issues/14433
    // for the issue above we decided to use just $onChanges
    ctrl.$onInit = init
    // ctrl.$onChanges = update

    // -------

    // init after dom loaded
    function init() {
      chargeAnimation()
    }
    // function update(changedObj) {}

    function chargeAnimation() {
       TweenMax.set(['#fast','#slow'], { css: { scaleY: "1", transformOrigin:'0% 100%'}})
       TweenMax.to('#fast',  2, { css: { scaleY: ".05", transformOrigin:'0% 100%'}, ease:Linear.easeNone, delay:.2 })
       TweenMax.to('#slow',  6, { css: { scaleY: ".05", transformOrigin:'0% 100%'}, ease:Linear.easeNone, delay:.2, onComplete:resetAnimation })
    }

    function resetAnimation(){
      TweenMax.to(['#fast','#slow'],  .4, { css: { scaleY: "1", transformOrigin:'0% 100%'}, ease:Linear.easeNone, delay:.5, onComplete:chargeAnimation })
    }


    // event handlers
    // $scope.$on('svg:all-loaded', function() {
    //   console.log('init animation')
    //   carAnimation()
    //   batteryAnimation()
    // })

    // deregister event handlers
    // $scope.$on events will be automatically deleted on $destroy
    $scope.$on('$destroy', function () {
      TweenMax.killAll()
    })
  }

}(window.angular, window.angular.element));

(function (angular) {
  'use strict'

  /**
    BatteryAnimation
  **/

  angular
    .module('EnelStandAnimation', [
      'MainApp'
    ])

}(window.angular));

(function (angular, jq) {
  'use strict'

  /**
  **/

  angular
    .module('EnelStandAnimation')
    .component('enelStand', {
      templateUrl: '../js/components/enelstandAnimation/assets/svg/illustration_enel_stand.svg',
      controller: enelStandCtrl,
      controllerAs: 'enelStand',
      bindings: {}
    })

  /* @ngInject */
  function enelStandCtrl($scope, $element, $attrs, TweenMax) {
    var ctrl = this
    ctrl.componentPath = '../js/components/enelstandAnimation'
    ctrl.svgPath = ctrl.componentPath + '/assets/svg'

    // https://github.com/angular/angular.js/issues/14433
    // for the issue above we decided to use just $onChanges
    ctrl.$onInit = init
    // ctrl.$onChanges = update

    var solarMexicoTimeline = null

    // -------

    // init after dom loaded
    function init() {
      solarMexicoTimeline = new TimelineMax({repeat:-1});
      standAnimation()
    }
    // function update(changedObj) {}

    function standAnimation() {
      TweenMax.set(['path','line','circle','rect'], { drawSVG:"0%" })
      TweenMax.to(['path','line','circle','rect'],  1.5, { drawSVG:"100%", delay:.4, ease:Power2.easeOut })

      TweenMax.from('#enel_logo',  1, { opacity:0, x:'-=45', delay:1, ease:Power2.easeOut })
    }


    // event handlers
    // $scope.$on('svg:all-loaded', function() {
    //   console.log('init animation')
    //   carAnimation()
    //   batteryAnimation()
    // })

    // deregister event handlers
    // $scope.$on events will be automatically deleted on $destroy
    $scope.$on('$destroy', function () {
      solarMexicoTimeline.kill()
      solarMexicoTimeline.clear()
      TweenMax.killAll()
    })
  }

}(window.angular, window.angular.element));

(function (angular) {
  'use strict'

  /**
    BatteryAnimation
  **/

  angular
    .module('EfficiencyAnimation', [
      'MainApp'
    ])

}(window.angular));

(function (angular, jq) {
  'use strict'

  /**
  **/

  angular
    .module('EfficiencyAnimation')
    .component('efficiency', {
      templateUrl: '../js/components/efficiencyAnimation/assets/svg/illustration_efficiency.svg',
      controller: EfficiencyCtrl,
      controllerAs: 'efficiency',
      bindings: {}
    })

  /* @ngInject */
  function EfficiencyCtrl($scope, $element, $attrs, TweenMax) {
    var ctrl = this
    ctrl.componentPath = '../js/components/efficiencyAnimation'
    ctrl.svgPath = ctrl.componentPath + '/assets/svg'

    // https://github.com/angular/angular.js/issues/14433
    // for the issue above we decided to use just $onChanges
    ctrl.$onInit = init
    // ctrl.$onChanges = update

    // -------

    // init after dom loaded
    function init() {
      efficiencyAnimation()
    }
    // function update(changedObj) {}

    function efficiencyAnimation() {
      TweenMax.to('#heat',  1.5, { css: { rotation: "40", transformOrigin:'50% 50%'}, ease:Power2.easeOut })
      TweenMax.to('#electric',  3, { css: { rotation: "80", transformOrigin:'50% 50%'}, ease:Power2.easeOut, onComplete:resetAnimation })
    
    }

    function resetAnimation() {
      TweenMax.to(['#heat','#electric'],  1, {  css: { rotation: "0", transformOrigin:'50% 50%'}, ease:Power2.easeOut, delay:4, onComplete:efficiencyAnimation })
    }


    // event handlers
    // $scope.$on('svg:all-loaded', function() {
    //   console.log('init animation')
    //   carAnimation()
    //   batteryAnimation()
    // })

    // deregister event handlers
    // $scope.$on events will be automatically deleted on $destroy
    $scope.$on('$destroy', function () {
      TweenMax.killAll()
    })
  }

}(window.angular, window.angular.element));

(function (angular) {
  'use strict'

  /**
    SnippetManager
  **/

  angular
    .module('SnippetManager', [
      'MainApp',
      'BatteryAnimation',
      'NightDayAnimation',
      'V2GAnimation',
      'Solar25kmAnimation',
      'SolarMexicoAnimation',
      'FastRechargeAnimation',
      'EnelStandAnimation',
      'EfficiencyAnimation'
    ])

}(window.angular));

(function (angular) {
  'use strict'

  /**
  **/

  angular
    .module('SnippetManager')
    .service('SnippetSrv', ContructorForSnippetSrv)

  /* @ngInject */
  function ContructorForSnippetSrv($q, _) {
    var self  = this
    self.path = '../js/modules/snippetManager/templates'
    var solarSnippetsKeys = ['mexico','panel','more']
    var ecarSnippetsKeys = ['efficiency','v2g','recharge']
    var _availableSnippets = {
      'mexico': {
        desc: 'How much energy is there in Mexican skies?',
        label: 'The power of the sun',
        tpl: self.path + '/solar25km.html'
      },
      'panel': {
        desc: 'Can you guess how much solar panels can power?',
        label: 'Solar energy for the race',
        tpl: self.path + '/solarmexico.html'
      },
      'efficiency': {
        desc: '',
        label: '',
        tpl: self.path + '/efficiency.html'
      },
      'recharge': {
        desc: 'Innovation is ready to charge! Recharging e-cars is faster than you think.',
        label: 'Fast recharge',
        tpl: self.path + '/fastrecharge.html'
      },
      'v2g': {
        desc: 'What if electricity could move around as freely as you do in your car? Soon, it will.',
        label: 'A battery on wheels',
        tpl: self.path + '/v2g.html'
      },
      'more': {
        desc: 'The Enel staff is happy to answer any questions you may have.',
        label: 'Would you like to find out more about smart energy?',
        tpl: self.path + '/enelstand.html'
      }
    }

    self.getAvailableSnippets = _getAvailableSnippets
    self.getSolarSnippets = _getSolarSnippets
    self.getEcarSnippets = _getECarSnippets
    self.getSnippet = _getSnippet
    return self

    // -------

    function _getSolarSnippets() {
      return $q(function(resolve, reject) {
        var snippets = _(_availableSnippets).map(function(value, key) {
            value.key = key
            if (_.includes(solarSnippetsKeys, key)) return value
          }).compact().value()
        if (!_.isEmpty(snippets)) resolve(snippets)
        else reject('No snippets!')
      })
    }
    function _getECarSnippets() {
      return $q(function(resolve, reject) {
        var snippets = _(_availableSnippets).map(function(value, key) {
            value.key = key
            if (_.includes(ecarSnippetsKeys, key)) return value
          }).compact().value()
        if (!_.isEmpty(snippets)) resolve(snippets)
        else reject('No snippets!')
      })
    }

    function _getAvailableSnippets() {
      return $q(function(resolve, reject) {
        var snippets = _.map(_availableSnippets, function(value, key) {
          value.key = key
          return value
        })
        if (!_.isEmpty(snippets)) resolve(snippets)
        else reject('No available snippets are defined!')
      })
    }

    function _getSnippet(key, appKey) {
      return $q(function(resolve, reject) {
        var searchKey = key.replace(/ /g, '_')
        if (appKey === 'solar' && !_.includes(solarSnippetsKeys, key)) return reject('Snippet not found!')
        if (appKey === 'ecar' && !_.includes(ecarSnippetsKeys, key)) return reject('Snippet not found!')
        var snippet = _availableSnippets[key]
        if (!_.isEmpty(snippet)) resolve(snippet)
        else reject('Snippet not found!')
      })
    }
  }

}(window.angular));

(function (angular) {
  'use strict'

  /**
    Module configuration for MainApp
  **/

  angular
    .module('MainApp', [
    ])

}(window.angular));

(function (angular) {
  'use strict'

  /**
    Run configurations for MainApp
  **/

  angular
    .module('MainApp')
    .run(RunMainApp)

  /* @ngInject */
  function RunMainApp($rootScope, $state, fastclick, isMobile) {
    fastclick.attach(document.body)

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      console.log('$stateChangeStart to ' + toState.name + ' - fired when the transition begins')
      console.debug('toState, toParams:', toState, toParams)
    })

    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams) {
      console.error('$stateChangeError - fired when an error occurs during transition.')
      console.error(arguments[5].stack)
      console.debug(arguments)
    })

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      console.log('$stateChangeSuccess to ' + toState.name + ' - fired once the state transition is complete.')
    })

    $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
      console.warn('$stateNotFound ' + unfoundState.name + ' - fired when a state cannot be found by its name.')
      console.debug(unfoundState, fromState, fromParams)
    })
  }

}(window.angular));

(function (angular) {
  'use strict'

  /**
  **/

  angular
    .module('MainApp')
    .service('PaddockAreaChart', ContructorForPaddockAreaChart)

  /* @ngInject */
  function ContructorForPaddockAreaChart($http) {
    var self  = this
    var _data = null
    var _data1 = null
    var _data2 = null

    self.get    = _get
    self.get1    = _get1
    self.get2    = _get2
    self.update = _update
    self.update1 = _update1
    self.update2 = _update2
    return self

    // -------

    // instance methods
    function _get() {
      return _data || _update()
    }
    function _get1() {
      return _data1 || _update1()
    }
    function _get2() {
      return _data2 || _update2()
    }

    function _update() {
      return $http.get('http://backend.enelformulae.todo.to.it/graphs/areachart/paddock')
                  .then(
                    function(res) {
                      console.info(res)
                      _data = res.data
                      return _data
                    },
                    function(err) {
                      console.error(err)
                      return null
                    })
    }
    function _update1() {
      return $http.get('http://192.168.3.10:5001/graphs/stream')
                  .then(
                    function(res) {
                      console.info(res)
                      _data = res.data
                      return _data
                    },
                    function(err) {
                      console.error(err)
                      return null
                    })
    }
    function _update2() {
      return $http.get('http://192.168.3.10:5001/zoneenergyconsumption')
                  .then(
                    function(res) {
                      console.info(res)
                      _data2 = res.data
                      return _data2
                    },
                    function(err) {
                      console.error(err)
                      return null
                    })
    }
  }

}(window.angular));

(function (angular, jq) {
  'use strict'

  /**
  **/

  angular
    .module('MainApp')
    .directive('importSvg', ImportSvg)

  /* @ngInject */
  function ImportSvg($rootScope, $http, _) {
    var directive = {
      restrict: 'E',
      replace: true,
      compile: function(tElem, tAttrs) {
        return function(scope, iElem, iAttrs) {
          // assemble svg path
          var location = scope.location.endsWith('/') ? scope.location : scope.location + '/'
          var name = scope.name.endsWith('.svg') ? scope.name : scope.name + '.svg'
          var tpl = location + name
          // if not yet initialized create array to store loading svgs
          if (!$rootScope.svgLoading) $rootScope.svgLoading = []
          // push svg path into loading svgs batch
          $rootScope.svgLoading.push(tpl)
          return $http.get(tpl)
                      .then(function(res) {
                        iElem.replaceWith(res.data)
                        __pull(tpl)
                      },
                      function(err) {
                        console.error('Svg not found!', err)
                        __pull(tpl)
                      })
        }
      },
      scope: {
        name: '@',
        location: '@'
      }
    }
    return directive

    function __pull(svgTpl) {
      console.log('svg:loaded', svgTpl)
      // pull out svg path from loading svgs batch
      _.pull($rootScope.svgLoading, svgTpl)
      // if loading svgs store array is empty all svg promises are resolved
      if (_.isEmpty($rootScope.svgLoading)) $rootScope.$broadcast('svg:all-loaded')
    }
  }
}(window.angular, window.angular.element));

(function (angular, jq) {
  'use strict'

  /**
    MainApp pagination Directive
  **/

  angular
    .module('MainApp')
    .directive('pagination', Paginator)

  /* @ngInject */
  function Paginator($timeout) {
    var directive = {
      link: postLinkFunction,
      restrict: 'EA',
      replace: true,
      templateUrl: '../js/directives/pagination/template.html',
      scope: {
        items: '=',
        currentItem: '=',
        onChange: '&',
        onPrevious: '&',
        onNext: '&',
        debounceTime: '=',
        rotate: '=',
        itemsToDisplay: '='
      }
    }
    return directive

    function postLinkFunction (scope, element, attributes) {
      if (!scope.items) return console.error('No items to paginate!')
      var currentItem = scope.items[0]
      var debounce = null
      var debounceTime = angular.copy(scope.debounceTime) || 200
      var rotate = angular.copy(scope.rotate)
      var itemsToDisplay = scope.itemsToDisplay || 1

      scope.select = scope.onChange()
      scope.selectPrev = scope.onPrevious()
      scope.selectNext = scope.onNext()
      scope.previous = _previous
      scope.next = _next

      _init()

      function _init() {
        scope.currentIdx = 0
        scope.lastIdx = Math.floor((scope.items.length-1)/itemsToDisplay)
      }

      function _previous() {
        if (debounce) return
        debounce = $timeout(function(){
          if (scope.currentIdx <= 0 && !rotate) return debounce = null
          if (scope.currentIdx <= 0 && rotate) scope.currentIdx = scope.items.length
          if (scope.selectPrev) scope.selectPrev()
          _select(--scope.currentIdx)
          debounce = null
        }, debounceTime)
      }
      function _next() {
        if (debounce) return
        debounce = $timeout(function(){
          if (scope.currentIdx >= scope.lastIdx && !rotate) return debounce = null
          if (scope.currentIdx >= scope.lastIdx && rotate) scope.currentIdx = -1
          if (scope.selectNext) scope.selectNext()
          _select(++scope.currentIdx)
          debounce = null
        }, debounceTime)
      }
      function _select(itemIdx) {
        currentItem = scope.items[itemIdx]
        if (scope.currentItem) scope.currentItem = currentItem
        if (scope.select) scope.select(currentItem)
      }
      scope.$watch('items', function() {
        _init()
      })
      scope.$watch('currentItem', function() {
        scope.currentIdx = scope.currentItem? scope.items.indexOf(scope.currentItem) : 0
      })
      scope.$watch('itemsToDisplay', function(newVal, oldVal) {
        if (newVal !== oldVal) {
          scope.currentIdx = 0
          scope.lastIdx = Math.floor((scope.items.length-1)/newVal)
        }
      })
    }
  }
}(window.angular, window.angular.element));

(function (angular, _) {
  'use strict'

  /**
    Lodash constant wrapper
  **/

  angular
    .module('MainApp')
    .value('_', _)

}(window.angular, window._));

(function (angular, d3) {
  'use strict'

  /**
    d3 constant wrapper
  **/

  angular
    .module('MainApp')
    .value('d3', d3)

}(window.angular, window.d3));

(function (angular, moment) {
  'use strict'

  /**
    moment constant wrapper
  **/

  angular
    .module('MainApp')
    .value('moment', moment)

}(window.angular, window.moment));

(function (angular, later) {
  'use strict'

  /**
    later constant wrapper
  **/

  angular
    .module('MainApp')
    .value('later', later)

}(window.angular, window.later));

(function (angular, TweenLite, TweenMax, TweenPlugin, TimelineLite, TimelineMax) {
  'use strict'

  /**
    gsap constants wrapper
  **/

  angular
    .module('MainApp')
    .value('TweenLite', TweenLite)
    .value('TweenMax', TweenMax)
    .value('TweenPlugin', TweenPlugin)
    .value('TimelineLite', TimelineLite)
    .value('TimelineMax', TimelineMax)

}(window.angular, window.TweenLite, window.TweenMax, window.TweenPlugin, window.TimelineLite, window.TimelineMax));

(function (angular, isMobile) {
  'use strict'

  /**
    isMobile constant wrapper
  **/

  angular
    .module('MainApp')
    .constant('isMobile', isMobile)

}(window.angular, window.isMobile));

(function (angular, fastclick) {
  'use strict'

  /**
    fastclick constant wrapper
  **/

  angular
    .module('MainApp')
    .value('fastclick', fastclick)

}(window.angular, window.FastClick));

(function (angular) {
  'use strict'

  /**
    MainApp
    httpProvider configurations for MainApp
  **/

  angular
    .module('MainApp')
    .config(AppConfig)

  /* @ngInject */
  function AppConfig($httpProvider) {

    // Is a Boolean that indicates whether or not cross-site Access-Control requests
    // should be made using credentials such as cookies or authorization headers.
    // The default is false. Set to true to send credentials in cross-site XMLHttpRequest invocations.
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS#Requests_with_credentials
    $httpProvider.defaults.withCredentials = false
  }
}(window.angular));

(function (angular) {
  'use strict'

  /**
    Module configuration for SnippetApp
  **/

  angular
    .module('SnippetApp', [
      'ui.router',
      'ngAnimate',
      'MainApp',
      'SnippetManager'
    ])

}(window.angular));

(function (angular) {
  'use strict'

  /**
    Run configurations for SnippetApp
  **/

  angular
    .module('SnippetApp')
    .run(RunSnippetApp)

  /* @ngInject */
  function RunSnippetApp($browser) {

    // var schedule = later.parse.cron('4,9,14,19,24,29,34,39,44,49,54,59 * * * *')
    // var schedule = later.parse.text('every '+ 1 +' minutes')
    // console.info("Setting schedule: ", schedule)
    // function log() {
    //   console.log('schedule to update all models every 5 minutes')
    // }
    // later.setInterval(log, schedule)
    $browser.baseHref = function () { return "/" };
  }

}(window.angular));

(function (angular) {
  'use strict'

  /**
    Routing configurations for SnippetApp
  **/

  angular
    .module('SnippetApp')
    .config(RouteConfig)

  /* @ngInject */
  function RouteConfig($locationProvider, $stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, isMobile) {

    // Enable html5 mode
    $locationProvider.html5Mode(true)

    // Allow case insensitive urls
    $urlMatcherFactoryProvider.caseInsensitive(true)
    // Normalize case insensitive urls
    $urlRouterProvider.rule(function ($injector, $location) {
      if ($location.$$html5) return
      // what this function returns will be set as the $location.url
      var path = $location.path(), normalized = path.toLowerCase().replace(/ /g, '_')
      if (path !== normalized) {
        // instead of returning a new url string, I'll just change the $location.path directly
        // so I don't have to worry about constructing a new url string and
        // so no state change occurs
        $location.replace().path(normalized)
      }
    })

    $urlRouterProvider.when('', '')
    $urlRouterProvider.when('/', '')
    $urlRouterProvider.otherwise('/')

    $stateProvider
      // .state('404', {
      //   url: '/404',
      //   templateUrl: 'templates/404.html'
      // })
      .state('landing', {
        url: '/solar/:snippetKey',
        templateUrl: '../solar/templates/landing.html',
        controller: 'SnippetCtrl',
        controllerAs: 'snippet',
        resolve: {
          snippets: function(SnippetSrv) {
            return SnippetSrv.getSolarSnippets()
                             .then(function(res) {
                                return res
                             }, function(err) {
                                console.error(err)
                             })
          },
          currentSnippet: function(SnippetSrv, $stateParams) {
            var snippetKey = $stateParams.snippetKey
            return SnippetSrv.getSnippet(snippetKey,'solar')
                             .then(function(res) {
                                return res
                             }, function(err) {
                                console.error(err)
                             })
          }
        }
      })
  }
}(window.angular));

(function (angular) {
  'use strict'

  angular
    .module('SnippetApp')
    .controller('SnippetCtrl', snippetCtrl)

  /* @ngInject */
  function snippetCtrl($scope, $state, snippets, currentSnippet) {
    var vm = this
    vm.allSnippets = snippets
    vm.selectedSnippet = currentSnippet
    vm.select = select
    vm.openMenu = openMenu
    vm.closeMenu = closeMenu

    if (!vm.selectedSnippet) return select(vm.allSnippets[0])

    // -------

    function select(snippet) {
      if (!snippet) return console.error('No snippet selected!')
      var searchKey = snippet.key
      vm.selectedSnippet = snippet
      // update url without reload the page
      $state.go('landing', {snippetKey: searchKey}, {notify: false})
      closeMenu()

      _gaevents()
    }

    function openMenu() {
      $('#snippet').css({'transform':'translateX(-100%)'})
      $('#snippet-menu').css({'transform':'translateX(0)'})
    }
    function closeMenu() {
      if (!vm.selectedSnippet) return select(vm.allSnippets[0])
      $('#snippet').css({'transform':'translateX(0)'})
      $('#snippet-menu').css({'transform':'translateX(100%)'})
    }

     _gaevents()
    function _gaevents() {
      if (!window.ga) return
      console.log(vm.selectedSnippet.key)
      var v = '/solar/' + vm.selectedSnippet.key
      ga('set', 'page', v);
      ga('send', 'pageview', v);
    }

    // deregister event handlers
    // $scope.$on('$destroy', function () {})
  }

}(window.angular));

//# sourceMappingURL=main.js.map