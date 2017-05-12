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
      // 'mexico': {
      //   desc: 'How much energy is there in Mexican skies?',
      //   label: 'The power of the sun',
      //   tpl: self.path + '/solar25km.html'
      // },
      // 'panel': {
      //   desc: 'Can you guess how much solar panels can power?',
      //   label: 'Solar energy for the race',
      //   tpl: self.path + '/solarmexico.html'
      // },
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
