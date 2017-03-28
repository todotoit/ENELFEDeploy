(function() {
  'use strict'
    
  Application.animations.idle = Application.animations['idle'] ? Application.animations.idle : {}

  // duplicate front end structure
  Application.animations.idle.feStructure = {
    'dashboard': {
      slides: []
    },
    'sidebar': {
      contents: ['Paddock', 'Tv_compound', 'Hospitality', 'Evillage']
    },
    'cars-and-teams': {
      slides: [{
        name: 'battery',
        contents: ['Battery power', 'Fan boost', 'Regenerative brakes', 'Fast recharge'],
        expandable: false
      },{
        name: 'car',
        contents: ['Engine', 'Tyres', 'Sound'],
        expandable: false
      },{
        name: 'drivetrains',
        contents: ['1 longitudinal', '1 transverse', '2 transverse'],
        expandable: true
      },{
        name: 'teams',
        contents: ['ABT', 'Andretti', 'Virgin', 'Faraday', 'Jaguar',
                   'Mahindra', 'Nextev', 'Renault', 'Techeetah', 'Venturi'],
        expandable: true
      },{
        name: 'paddock',
        contents: ['Charging batteries', 'Utilities'],
        expandable: false
      }]
    },
    'city-and-racetrack': {
      slides: [{
        name: 'smartgrid',
        contents: ['Race microgrid', 'Urban smart grid', 'Latin America plan'],
        expandable: false
      },{
        name: 'microgrid',
        contents: ['Media', 'Paddock', 'Fans', 'Race facilities'],
        expandable: true
      },{
        name: 'track',
        contents: [],
        expandable: false
      },{
        name: 'energymix',
        contents: ['Clean energy', 'Temporary solution'],
        expandable: false
      }]
    }
  }

}())
