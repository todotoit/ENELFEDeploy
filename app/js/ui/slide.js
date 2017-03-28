(function() {
  'use strict'

  var defaultOptions = {}

  Application.UI.Slide = function Slide(selector, options) {
    if(!options) options = _.defaults(defaultOptions, options)
    this.$element = $(selector);
    
    this.destroy = function destroy() {
      this.$element.removeClass('expanded')
      this.$element.find($('.expandable label')).off()
    }

    this.expandOn = function on(event, callback) {
      this.$element.find($('.expandable label')).on(event, callback)
    }

    return this
  }
}())
