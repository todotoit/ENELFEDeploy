(function() {
  'use strict';
  
  var localStorage = window.localStorage
  var JSON = window.JSON
  var _ = window._
  
  // Export
  window.persist = persist
  

  function persist(object) {
    if (!object) {
      throw new Error("Cannot persist undefined")
    }
    if (!object.name) {
      throw new Error("To activate persistence the object should have a unique name")
    }
    
    object.data = {}
    object.key = _.kebabCase(object.name)
    
    object.init_persist = function () {
      console.debug(this.name, "init_persist")
    }
    
    object.store = function persist_store() {
      localStorage[this.key] = JSON.stringify(this.data)
    }
    
    object.load = function persist_load() {
      this.data = JSON.parse(localStorage[this.key])
    }
    
    object.get = function persist_get() {
      return JSON.parse(localStorage[this.key])
    }
    
    return object
  }
}());
