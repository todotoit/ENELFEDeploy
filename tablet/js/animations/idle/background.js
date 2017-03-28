(function() {
  'use strict'
    
  Application.animations.idle = Application.animations['idle'] ? Application.animations.idle : {}

  Application.animations.idle.background = {
    start: start,
    stop: stop,
    reset: reset,
    createIdle: createTimeline
  }

  var parsingSection,
      feSection,
      currentSection,
      currentCarousel,
      currentSlideIndex,
      currentSlide,
      currentContentIndex,
      currentContent

  var StepDefaultTime = 3
  var ContentDefaultTime = 8
  var ContentExpandedDefaultTime = 8
  var tl,
      tlTime = 0,
      tlSidebar,
      tlSidebarTime = 0

  function start() {
    tl.play()
    tlSidebar.play()
  }
  function stop() {
    tl.pause()
    tlSidebar.pause()
  }
  function reset() {
    tl.restart()
    tlSidebar.restart()
  }

  function changeSection(section) {
    // console.info('Idle move to section:', section)
    if (currentCarousel) currentCarousel.destroy()
    currentSection = section
    feSection = Application.animations.idle.feStructure[currentSection]
    Application.stateman.go(currentSection)
    currentCarousel = Application.UI.createCarousel('#carousel-' + currentSection)
  }

  function changeSlide(slide) {
    // console.info('Idle change slide:', slide.name)
    currentSlideIndex = _.findIndex(feSection.slides, {name: slide.name})
    if (currentSlideIndex < 0) return
    currentSlide = slide
    currentCarousel.goTo(currentSlideIndex)
  }

  function toggleContent(content) {
    // console.info('Idle toggle content:', content)
    var buttons = currentCarousel.slides[currentSlideIndex].$element.find('.buttons')
    currentContentIndex = _.indexOf(feSection.slides[currentSlideIndex].contents, content)
    if (currentContentIndex < 0) return
    currentContent = buttons.children()[currentContentIndex]
    currentContent.click()
  }

  function toggleSidebarContent(content) {
    console.log(content)
    Application.UI.DonutChart.select(content)
  }

  function expandSlide() {
    var animationsName = _.snakeCase(currentSection)
    Application.animations[animationsName].background.expand(currentCarousel.slides[currentSlideIndex].$element)
  }

  function collapseSlide() {
    var animationsName = _.snakeCase(currentSection)
    Application.animations[animationsName].background.collapse(currentCarousel.slides[currentSlideIndex].$element)
  }

  function parseTlObject(step) {
    tlTime += step.wait >= 0? step.wait : StepDefaultTime
    delete step.wait
    if (step.section) {
      // console.log(step.section)
      tl.addCallback(changeSection, tlTime, [step.section])
      parsingSection = Application.animations.idle.feStructure[step.section]
      delete step.section
      if (_.isEmpty(step)) return
      return parseTlObject(step)
    }
    if (step.slides === 'all') step.slides = parsingSection.slides
    if (!_.isEmpty(step.slides)) {
      _.each(step.slides, function(slide) {
        // console.log(slide.name)
        tl.addCallback(changeSlide, tlTime, [slide])
        parseTlObject(slide)
      })
    }
    if (step.contents === 'all') step.contents = _.find(parsingSection.slides, {name: step.name}).contents
    if (!_.isEmpty(step.contents)) {
      _.each(step.contents, function(content) {
        // console.log(content)
        // open
        tl.addCallback(toggleContent, tlTime, [content])
        tlTime += step.contentsTime || ContentDefaultTime
        // close
        if (step.toggleContents) {
          tl.addCallback(toggleContent, tlTime, [content])
          tlTime += StepDefaultTime
        }
      })
    }
    if (step.expand) {
      // open
      tl.addCallback(expandSlide, tlTime)
      tlTime += step.expandedTime || ContentExpandedDefaultTime
      // close
      tl.addCallback(collapseSlide, tlTime)
      tlTime += StepDefaultTime
    }
  }

  function createTimeline() {
    tl = new TimelineMax({ delay: StepDefaultTime, repeat: -1, repeatDelay: StepDefaultTime, paused: true })
    _.each(Application.animations.idle.timeline, function(step) {
      parseTlObject(step)
    })
    tlSidebar = new TimelineMax({ delay: ContentDefaultTime, repeat: -1, repeatDelay: ContentDefaultTime, paused: true })
    _.each(Application.animations.idle.feStructure['sidebar'].contents, function(step) {
      tlSidebar.addCallback(toggleSidebarContent, tlSidebarTime, [step])
      tlSidebarTime += ContentDefaultTime
    })
  }

}())
