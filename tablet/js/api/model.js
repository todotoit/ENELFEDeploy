(function() {
  'use strict';

  // var models = {}

  
  var model = {
    name: "anonymous model",
    current_result: 0,
    init_model: function () {
      console.debug(this.name, "init_base")
    },
    init: function () {
      // get all functions on this starting with "init_"
      var init_fns = _.sortBy(_.filter(Object.keys(this), function (e) { return _.startsWith(e, "init_") }))
      // for each one, run it with the correct this context
      _.each(init_fns, function (fn) {
        if (typeof this[fn] === "function") {
          console.debug("model: ("+this.name+") "+fn)
          this[fn]()
        }
      }.bind(this))
      
      // run initialize function if defined
      // if (typeof this['initialize'] === "function") this.initialize()
      
      // this.on('storageUpdated', this.update)
    },
    model_update: function (resolve, reject) { throw new Error('model_update not implemented for model '+this.name) },
    update: function () {
      console.debug("model: ("+this.name+") update")
      var model_updater = new Promise(this.model_update.bind(this))
      Promise.resolve(model_updater)
        .then(function (result) {
          console.info('model: ', this.name, result, this.current_result)
          if (isNaN(result)) result = this.current_result
          this.data[this.valueProperty] = result
        }.bind(this))
        .then(function (result) {
          console.debug("model: ("+this.name+") update_dependant")
          this.update_dependant()
        }.bind(this))
        .then(function () {
          console.debug("model: ("+this.name+") render")
          this.render()
        }.bind(this))
        .catch(function (reason) { console.error(this, reason) }.bind(this))
    }
  };

  emitonoff(model)
  persist(model)
  dom_bind(model)
  depend(model)
    
  Application.modelFactory = function (name) {
    var newModel = _.cloneDeep(model)
    newModel.name = name
    return newModel
  }
  
}());
