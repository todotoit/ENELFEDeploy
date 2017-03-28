(function() {
  'use strict'

  /**
   *  This script loads remote SVG putting them inline
   *
   *  Ex:
   *    <import-svg name="circuit" location="svg"></import-svg>
   *    This will perform a GET AJAX request to svg/circuit.svg
   *
   *  Tag: import-svg
   *  Attributes:
   *    name: name of the svg file
   *    location: URL location, relative to current URL
   */

  /*
    For this code to work all code should be wrapped inside $(document).ready(),
    otherwise will be executed before this script has ended and could result in
    broken functionality ( only if functionalities depends on SVG already
    present on page, but do it only if you know what you're doing )
   */

  function createImportContainer() {
    var $elem = $('<div class="import-svg-container"></div>')
    $elem.appendTo('body')
    $elem.hide()
    return $elem
  }

  function loadSvgFile($elem, $container, name, location) {
    // create a promise
    return new Promise(function(resolve, reject) {
      console.debug('Importing SVG ' + name)
      // load SVG via HTTP
      $.get(location+'/'+name+'.svg', function(data) {
        // set import container content to the SVG content
        // this seems to be the only reliable way to create DOM elements from string
        $container.html(new XMLSerializer().serializeToString(data.documentElement))
        // get imported svg
        var $svg = $('svg', $container).detach()
        // get elem id attribute
        var id = $elem.attr('id')
        // attach to svg if defined
        if (typeof id !== "undefined") {
          console.debug('Attaching id to '+name+'#'+id, $svg)
          $svg.attr('id', id)
        }
        // move element to proper destination, before <import-svg> tag
        $svg.insertBefore($elem)
        // remove <import-svg> tag
        $elem.remove()
        resolve()
      })
      .fail(function() {
        reject(location+'/'+name+'.svg cannot be loaded, please verify it exists')
      })
    })
  }

  // hold jQuery ready
  $.holdReady( true )
  // wait DOM to load
  $(window).on("load", function () {
    var $importContainer = createImportContainer()
    // will contain all promises for svg importing
    var promises = []
    // for each <import-svg> tag
    $('import-svg').each(function (idx, el) {
      var $this = $(el)
      var name = $this.attr('name')
      var location = $this.attr('location')
      var promise = loadSvgFile($this, $importContainer, name, location)
      promises.push(promise)
    })
    
    // act when all promises have been resolved
    Promise.all(promises)
      .then(function () {
        console.info('All SVG loaded')
        // remove jQuery ready hold
        $.holdReady(false)
      }, function (reason) {
        console.error(reason)
        if (reason.stack) {
          console.error(reason.stack)
        }
      })
      // .catch() // DON'T DO THIS
      // this will create a catch-all handler that combined with how jquery.holdReady
      // works would swallow all exceptions happening between the first $.holdReady(true)
      // and the resultion of Promise.all(promises)
  })

}())
