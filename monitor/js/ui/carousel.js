(function() {
  'use strict'

  var defaultOptions = {}

  Application.UI.Carousel = function Carousel(selector, options) {
    var self = this
    if(!options) options = _.defaults(defaultOptions, options)
    self.$element = $(selector);
    self.slides = [];
    var carousel = self.$element.owlCarousel(options);

    self.destroy = function destroy() {
      // destroy has bugs, see https://github.com/OwlCarousel2/OwlCarousel2/issues/460#issue-41295972
      $(self.slides).each(function() {
        this.destroy();;
      })
      self.$element.trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
      self.$element.find('.owl-stage-outer').children().unwrap();
    }

    self.on = function on(event, callback) {
      self.$element.on(event, callback);
    }

    self.goTo = function goTo(options){
      self.$element.trigger('to.owl.carousel', options);
    }

    // create slides objects avoiding cloned slides
    self.$element.find('.owl-item').each(function(){
      if ($(this).is('.cloned')) return
      var slide = new Application.UI.Slide($(this).find('.slide').first());
      self.slides.push(slide);
    })

    return self
  }

}())
