(function() {
  'use strict';

  function createCarousel(selector, options) {
    options = _.defaults({
      stagePadding: 97,
      loop: true,
      margin: 30,
      nav: true,
      navText: ['<','>'],
      dots: true,
      items: 1
    }, options)

    if (matchMediaQuery()) {
      options = _.defaults({
        scaleFactor: 1.41
      }, options)
    }
    if (Application.environment == 'idle') {
      options = _.defaults({
        stagePadding: 25,
        nav: false
      }, options)
    }
    return new Application.UI.Carousel(selector, options)
  }
  
  function createBgCarousel(selector, options) {
    options = _.defaults({
      stagePadding: 0,
      loop: true,
      margin: 10,
      nav: false,
      dots: false,
      items: 1,
      touchDrag: false,
      mouseDrag: false,
      animateOut: 'fadeOut'
    }, options)
    return new Application.UI.Carousel(selector, options)
  }

  function setBackgroundColor(goToState) {
    $('body').removeClass().addClass(Application.stateman.current.name)
  }
  
  var streamgraphs = {}
  function createStreamgraph(selector, options) {
    if (streamgraphs[selector]) return streamgraphs[selector]
    options = _.defaultsDeep({
      dataPath: Application.Env.get('backend_url')+'/graphs/stream'
    }, options)
    if (matchMediaQuery()) {
      options = _.defaultsDeep({
        scaleFactor: 1.41,
        tooltip: {
          offsetX: -90,
          offsetY: 25,
          minX: 60,
          minY: 25,
          maxX: 840
        }
      }, options)
    }
    streamgraphs[selector] = Application.UI.Streamgraph(selector, options)
  }

  // Create DonutChart here as it is global to all states
  var donutChart = Application.UI.DonutChart = {}
  function createDonutChart(selector, data) {
    var data = data || []
    if (!donutChart[selector]){
      Application.UI.DonutChart = donutChart[selector] = new sidebarDonutChart(selector, data)
      Application.UI.DonutChart.onSelected(Application.animations.sidebar.selectDonutArea)
      Application.UI.DonutChart.select('Paddock')
    }
    return donutChart[selector]
  }

  var standings = {}
  function createStandings(selector) {
    if (standings[selector]) return standings[selector]
    return standings[selector] = new standingsChart(selector)
  }

  var areaChart = {}
  function createAreaChart(selector, data) {
    if (areaChart[selector]) return areaChart[selector]
    var data = data || []
    return areaChart[selector] = new teamAreaChart(selector, data)
  }

  var sankey = {}
  function createSankey(selector) {
    if (sankey[selector]) return sankey[selector]
    return sankey[selector] = new teamSankey(selector)
  }

  var slideLatinAmerica = {}
  function createLatinAmericaSlide(selector) {
    if (slideLatinAmerica[selector]) return slideLatinAmerica[selector]
    return slideLatinAmerica[selector] = new latinAmericaSlide(selector)
  }

  var slideBaMetersMap = {}
  function createBaMetersMapSlide(selector) {
    if (slideBaMetersMap[selector]) return slideBaMetersMap[selector]
    return slideBaMetersMap[selector] = new baMetersMap(selector)
  }

  function matchMediaQuery() {
    return window.matchMedia("(min-width: 1920px)").matches
  }

  Application.UI = {
    createCarousel: createCarousel,
    createBgCarousel: createBgCarousel,
    setBackgroundColor: setBackgroundColor,
    createStreamgraph: createStreamgraph,
    createStandings: createStandings,
    createDonutChart: createDonutChart,
    createAreaChart: createAreaChart,
    createSankey: createSankey,
    createLatinAmericaSlide: createLatinAmericaSlide,
    createBaMetersMapSlide: createBaMetersMapSlide,
    matchMediaQuery: matchMediaQuery
  }

}());
