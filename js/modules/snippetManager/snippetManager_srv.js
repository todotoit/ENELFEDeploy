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
    var _availableSnippets = {
      'the_power_of_the_sun': {
        desc: 'How much energy is there in Mexican skies?',
        tpl: self.path + '/solar25km.html'
      },
      'solar_energy_for_the_race': {
        desc: 'Can you guess how much solar panels can power?',
        tpl: self.path + '/solarmexico.html'
      },
      'fast_recharge': {
        desc: 'Innovation is ready to charge! Recharging e-cars is faster than you think.',
        tpl: self.path + '/fastrecharge.html'
      },
      'a_battery_on_wheels': {
        desc: 'What if electricity could move around as freely as you do in your car? Soon, it will.',
        tpl: self.path + '/v2g.html'
      },
      'would_you_like_to_find_out_more_about_smart_energy?': {
        desc: 'The Enel staff is happy to answer any questions you may have.',
        tpl: self.path + '/enelstand.html'
      }
    }

    self.getAvailableSnippets = _getAvailableSnippets
    self.getSnippet = _getSnippet
    return self

    // -------

    function _getAvailableSnippets() {
      return $q(function(resolve, reject) {
        var snippets = _.map(_availableSnippets, function(value, key) {
          value.key = key.replace(/_/g, ' ')
          return value
        })
        if (!_.isEmpty(snippets)) resolve(snippets)
        else reject('No available snippets are  defined!')
      })
    }

    function _getSnippet(key) {
      return $q(function(resolve, reject) {
        var searchKey = _.snakeCase(key)
        var snippet = _availableSnippets[searchKey]
        if (!_.isEmpty(snippet)) {
          snippet.key = key.replace(/_/g, ' ')
          resolve(snippet)
        } else reject('Snippet not found!')
      })
    }
  }

}(window.angular));
