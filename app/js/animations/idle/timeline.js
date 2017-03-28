(function() {
  'use strict'
    
  Application.animations.idle = Application.animations['idle'] ? Application.animations.idle : {}

  Application.animations.idle.timeline = [
    { 
      wait: 0,
      section: 'dashboard'
    },{ 
      wait: 10,
      section: 'cars-and-teams',
      slides: [{
        wait: 8,
        name: 'battery',
        contents: 'all',
        toggleContents: false
      },{
        wait: 8,
        name: 'car',
        contents: 'all',
        toggleContents: false
      },{
        wait: 8,
        name:'drivetrains',
        contents: 'all',
        toggleContents: false,
        expandedTime: 10,
        expand: true
      },{
        wait: 8,
        name: 'teams',
        contents: 'all',
        toggleContents: false,
        contentsTime: 3,
        expandedTime: 10,
        expand: true
      },{
        wait: 8,
        name:'paddock',
        contents: 'all',
        contentsTime: 5,
      }]
    },
    {
      section: 'city-and-racetrack',
      slides: [{
        wait: 8,
        name: 'smartgrid',
        contents: 'all',
        toggleContents: false
      },{
        wait: 8,
        name: 'microgrid',
        contents: 'all',
        toggleContents: false,
        expandedTime: 10,
        expand: true
      },{
        wait: 8,
        name: 'track'
      },{
        wait: 8,
        name: 'energymix',
        contents: 'all',
        contentsTime: 5,
        toggleContents: false
      }]
    }
  ]

}())
