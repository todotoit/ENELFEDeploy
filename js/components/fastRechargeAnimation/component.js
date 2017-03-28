(function (angular, jq) {
  'use strict'

  /**
  **/

  angular
    .module('FastRechargeAnimation')
    .component('fastRecharge', {
      templateUrl: '../js/components/FastRechargeAnimation/assets/svg/illustration_fastcharge.svg',
      controller: NightDayAnimationCtrl,
      controllerAs: 'fastRecharge',
      bindings: {}
    })

  /* @ngInject */
  function NightDayAnimationCtrl($scope, $element, $attrs, TweenMax) {
    var ctrl = this
    ctrl.componentPath = '../js/components/FastRechargeAnimation'
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
       TweenMax.to('#fast',  2, { css: { scaleY: ".05", transformOrigin:'0% 100%'}, ease:Linear.easeNone })
       TweenMax.to('#slow',  6, { css: { scaleY: ".05", transformOrigin:'0% 100%'}, ease:Linear.easeNone })
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
