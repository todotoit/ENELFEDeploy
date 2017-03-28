(function() {
  'use strict'

  var stateman = Application.stateman = new StateMan()

  stateman
    .state('dashboard', Application.states.dashboard)
    .state('cars-and-teams', Application.states.cars_and_teams)
    .state('city-and-racetrack', Application.states.city_and_racetrack)

    stateman.on('notfound', function (event) { console.error(event.path + ' notfound') })
    stateman.on('begin', function (event) { console.log('begin moving to ' + event.path) })
    stateman.on('end', function () { console.log('end') })

  $('body').on('click', '[to-state]', function (event) {
    event.preventDefault()
    if (!$(this).attr('disabled')) {
      var goToState = $(event.target).closest('[to-state]').attr('to-state')
      if (goToState) {
        stateman.go(goToState)
      }
    }
  })
  
  var stateSwitchers = {}
  function newStateSwitcher(states) {
    return {
      index: 0,
      states: states,
      current: function () { return this.states[this.index].trim() },
      next: function () { this.index = (this.index + 1) % this.states.length; return this.current() }
    }
  }
  
  $('body').on('click', '[to-state-switch]', function (event) {
    /*
      use it as attribute:
        <a to-state-switch="city-and-racetrack,dashboard"></a>
      the first state should not be the one we are in, but the next
      to create a loop, add the current state as last in the chain
     */
    event.preventDefault()
    if (!$(this).attr('disabled')) {
      var $elem = $(event.target).closest('[to-state-switch]')
      if (_.isUndefined($elem.attr('id'))) {
        $elem.attr('id', window.btoa(_.uniqueId()))
      }
      var id = $elem.attr('id')
      if (_.isUndefined(stateSwitchers[id])) {
        stateSwitchers[id] = newStateSwitcher($elem.attr('to-state-switch').split(','))
      }
      if (stateSwitchers[id].current() === stateman.current.name) {
        // go to next if current switch status is equal to stateman current status
        // if this condition is not met we are probably no more in the state 
        // where we should trigger the switch
        // Ex: switch is configured as "b,a"
        // we are in status a, there are states a,b,c
        // from a we move to b. from b to c, using another button.
        // clicking on the switch would make us go to a (from c, because the 
        // switch next position from b would be a), while we would like to get 
        // back to b, because we were in c
        // with this condition from c we would get back to b, and clicking on the
        // switch from b would trigger the next, going to a
        stateman.go(stateSwitchers[id].next())
      } else {
        // go to current; current in this context is the switch current selected
        // position, not the current state of the application
        stateman.go(stateSwitchers[id].current())
      }
    }
  })


}())
