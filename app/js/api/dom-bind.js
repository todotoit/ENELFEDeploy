(function() {
  'use strict';
  
  var localStorage = window.localStorage
  var JSON = window.JSON
  var _ = window._
  
  // Export
  window.dom_bind = dom_bind
  

  function dom_bind(object) {
    if (!object) {
      throw new Error("Cannot execute on undefined")
    }
    if (!object.name) {
      throw new Error("To activate persistence the object should have a unique name")
    }
    
    object.$element = null
    
    object.init_dom_bind = function () {
      console.debug(this.name, "init_dom_bind")
      this.bind()
    }
    
    object.bind = function bind() {
      this.$element = $('[data-bind="'+_.kebabCase(this.name)+'"]')
      if (this.$element.length == 0) {
        console.warn("no element matches selector "+'[data-bind="'+_.kebabCase(this.name)+'"]')
      }
    }
    
    object.format = function format(value) {
      return value
    }
    
    object.render = function render() {
      var property = this.valueProperty || this.$element.attr('data-value-property')
      if (_.isUndefined(property)) {
        console.error(this.$element, property)
        throw new Error("Render empty element, property is undefined")
      }
      var value = this.format(this.data[property])
      console.log(value, property, this.data)
      if (_.isFunction(this.animateRender)) {
        this.animateRender(this.$element, value)
      } else {
        this.$element.text(value)
      }
    }
    
    return object
  }
}());
