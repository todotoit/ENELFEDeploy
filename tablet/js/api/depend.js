(function() {
  'use strict';
  
  var _ = window._
  
  // Export
  window.depend = depend
  

  function depend(object) {
    if (!object) {
      throw new Error("Cannot execute on undefined")
    }
    
    object.depends = []
    object.dependant = []
    
    object.init_depend = function () {
      console.debug("depend: init("+this.name+") ")
      _.each(this.depends, function (e) {
        Application.models[e].has_dependant(this)
      }.bind(this))
    }
    
    object.depends_on = function (models) {
      console.debug("depend: ("+this.name+") depends_on "+models)
      models = Array.isArray(models)? models : [models]
      this.depends = models
    }
    
    object.has_dependant = function (model) {
      console.debug("depend: ("+this.name+") dependant "+this.name)
      this.dependant.push(model)
    }
    
    object.update_dependant = function () {
      console.debug("depend: ("+this.name+") update_dependant ", this.dependant)
      _.each(this.dependant, function (e) {
        e.update()
      }.bind(this))
    }
    
    return object
  }
}());
