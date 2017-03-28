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
        rotate: '='
      }
    }
    return directive

    function postLinkFunction (scope, element, attributes) {
      if (!scope.items) return console.error('No items to paginate!')
      scope.currentIdx = 0
      scope.lastIdx = scope.items.length -1
      var currentItem = scope.items[0]
      var debounce = null
      var debounceTime = angular.copy(scope.debounceTime) || 200
      var rotate = angular.copy(scope.rotate)

      scope.select = scope.onChange()
      scope.selectPrev = scope.onPrevious()
      scope.selectNext = scope.onNext()
      scope.previous = _previous
      scope.next = _next

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

      scope.$watch('currentItem', function() {
        scope.currentIdx = scope.currentItem? scope.items.indexOf(scope.currentItem) : 0
      })
    }
  }
}(window.angular, window.angular.element));
