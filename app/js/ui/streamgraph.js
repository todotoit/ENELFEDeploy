(function() {
  'use strict';

  //CODE FROM: http://bl.ocks.org/WillTurman/4631136
  
  Application.UI.Streamgraph = Streamgraph
  
  var datearray = [];
  var colorrange = [];
  var strokecolor = null;
  var mouse = null;
  var mousexy = null;
  var mousex = null;
  var mousey = null;
  var mousedate = null;
  var pro = null;
  var dashboardEnelCursorDimension = 105
  var height = 0;
  var width = 0;

  var Options = {
    scaleFactor: 1,
    dataPath: '',
    tooltip: {
      offsetX: -90,
      offsetY: 0,
      minX: 0,
      minY: 0,
      maxX: 844, // canvas width - tooltip width
      maxY: 468
    }
  };

  function Streamgraph(selector, options) {

    Options = _.defaultsDeep(options, Options);
    console.log('Streamgraph options: ', Options)

    colorrange = ["#077249","#008C5A","#11965A", "#22A05A", "#33AA5A","#44B45A"];
    strokecolor = "transparent";

    // var format = d3.time.format("%m/%d/%y"); // test dataset date format
    // var format = d3.time.format('%Y-%m-%dT%H:%M:%S%Z');
    // discarding timezone makes data apper to the relevant hour at every timezone
    // so for example hong kong data are displayed at the proper hours even if
    // timezone on frontend changes
    var format = d3.time.format('%Y-%m-%dT%H:%M:%S');

    var margin = {top: 0, right: 0, bottom: 0, left: 56};
    width = $(selector).get(0).clientWidth - margin.left - margin.right;
    height = $(selector).get(0).clientHeight - margin.top - margin.bottom;

    var tooltip = d3.select("#streamgraph")
        .append("div")
        .attr("class", "remove tooltip")
        .style("position", "absolute")
        .style("z-index", "40")
        .style("visibility", "hidden")
        .style("top", "30px")
        .style("left", "55px");

    var vertical = d3.select("#streamgraph")
      .append("div")
      .attr("class", "remove")
      .style("position", "absolute")
      .style("z-index", "19")
      .style("width", "1px")
      .style("height", "468px")
      .style("top", "0px")
      .style("bottom", "0px")
      .style("opacity", "0")
      .style("left", "0px")
      .style("background", "#fff");

    var x = d3.time.scale()
      .range([0, width]);

    var y = d3.scale.linear()
      .range([height-10, 10]);

    var z = d3.scale.ordinal()
      .range(colorrange);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .ticks(d3.time.hours);

    var yAxis = d3.svg.axis()
      .scale(y);

    var yAxisr = d3.svg.axis()
      .scale(y);

    var stack = d3.layout.stack()
      .offset("silhouette")
      .values(function(d) { return d.values; })
      .x(function(d) { return d.date; })
      .y(function(d) { return d.value; });

    var nest = d3.nest()
      .key(function(d) { return d.key; });

    var area = d3.svg.area()
      .interpolate("cardinal")
      .x(function(d) { return x(d.date); })
      .y0(function(d) { return y(d.y0); })
      .y1(function(d) { return y(d.y0 + d.y); });

    var svg = d3.select("#streamgraph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var graph = d3.csv(Options.dataPath, function(data) {
      data.forEach(function(d) {
        d.date = format.parse(d.date);
        d.value = +d.value;
        d.key = map_layer_key(d.key)
      });
      data = interpolateInitialData(data)
    
      var layers = stack(nest.entries(data))
      
      var xDomain = d3.extent(data, function(d) { return d.date; })
      var yDomain = [0, d3.max(data, function(d) { return d.y0 + d.y; })]
      console.log("streamgraph:domains:", xDomain, yDomain)
      x.domain(xDomain);
      y.domain(yDomain);

      svg.selectAll(".layer")
          .data(layers)
          .enter().append("path")
          .attr("class", "layer")
          .attr("d", function(d) { return area(d.values); })
          .style("fill", function(d, i) { return z(i); })
      updateXAxis(svg, xAxis)

      attachToolipEvents(svg, x, z, vertical, tooltip)
    });
    
    return {
      element: d3.select("#streamgraph"),
      update: function () {
        d3.csv(Options.dataPath, function(data) {
          data.forEach(function(d) {
            d.date = format.parse(d.date);
            d.value = +d.value;
            map_layer_key(d.key)
          });
          data = interpolateInitialData(data)
          
          var layers = stack(nest.entries(data))
          
          var xDomain = d3.extent(data, function(d) { return d.date; })
          var yDomain = [0, d3.max(data, function(d) { return d.y0 + d.y; })]
          console.log("streamgraph:domains:", xDomain, yDomain)
          x.domain(xDomain);
          y.domain(yDomain);
          svg.selectAll(".layer")
              .data(layers)
              .attr("d", function(d) { return area(d.values); })
          updateXAxis(svg, xAxis)
        })
      },
      detach: function () {
        detachToolipEvents(svg)
      },
      attach: function () {
        attachToolipEvents(svg, x, z, vertical, tooltip)
      },
      replay: function (stepTime, step) {
        // stepTime in mills
        var stepTime = stepTime || 25
        // clean svg
        svg.html('')
        // load data
        d3.csv(Options.dataPath, function(data) {
          data.forEach(function(d) {
            d.date = format.parse(d.date);
            d.value = +d.value;
            map_layer_key(d.key)
          });
          data = interpolateInitialData(data)
          var layers = stack(nest.entries(data))
          var calls = step >= 0  && step <= (data.length / layers.length)-1? step : (data.length / layers.length)-1

          // *****************
          // animation by data
          // 
          var tempData = []
          var groups = _.groupBy(data, 'key')
          _.each(groups, function (group) {
            tempData.push(group[0])
          })

          layers = stack(nest.entries(tempData))
          var xDomain = d3.extent(tempData, function(d) { return d.date; })
          var yDomain = [0, d3.max(tempData, function(d) { return d.y0 + d.y; })]
          x.domain(xDomain);
          y.domain(yDomain);
          svg.selectAll(".layer")
              .data(layers)
              .enter().append("path")
              .attr("d", function(d) { return area(d.values); })
              .attr("class", "layer")
              .style("fill", function(d, i) { return z(i); })
          updateXAxis(svg, xAxis)
          attachToolipEvents(svg, x, z, vertical, tooltip)
          // number of calls
          _.times(calls, function(i) {
            // update
            setTimeout(function() {
              _.each(groups, function (group) {
                tempData.push(group[i+1])
              })
              tempData = interpolateInitialData(tempData)

              var layers = stack(nest.entries(tempData))
              var xDomain = d3.extent(tempData, function(d) { return d.date; })
              var yDomain = [0, d3.max(tempData, function(d) { return d.y0 + d.y; })]
              x.domain(xDomain);
              y.domain(yDomain);
              svg.selectAll(".layer")
                  .data(layers)
                  .attr("d", function(d) { return area(d.values); })
              updateXAxis(svg, xAxis)
            }, stepTime * i);
          })
        })
      },
      animate: function (stepTime) {
        // stepTime in mills
        var stepTime = stepTime || 25
        // clean svg
        svg.html('')
        // load data
        d3.csv(Options.dataPath, function(data) {
          data.forEach(function(d) {
            d.date = format.parse(d.date);
            d.value = +d.value;
            map_layer_key(d.key)
          });
          data = interpolateInitialData(data)
          var layers = stack(nest.entries(data))
          var calls = data.length / layers.length
          // *******************
          // animation by layers
          // 
          var xDomain = d3.extent(data, function(d) { return d.date; })
          var yDomain = [0, d3.max(data, function(d) { return d.y0 + d.y; })]
          x.domain(xDomain);
          y.domain(yDomain);
          svg.selectAll(".layer")
              .data(layers)
              .enter().append("path")
              .attr("class", "layer")
              .style("fill", function(d, i) { return z(i); })

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + (height+1) + ")")
              .call(xAxis.orient('top'));

          $(".x.axis .tick line").attr('y2','-468').attr("stroke-dasharray","1, 5")

          _.times(calls, function(i) {
            setTimeout(function() {
              layers.forEach(function(l){
                if (!l.tempValues) l.tempValues = []
                l.tempValues.push(l.values[i])
              })
              var xDomain = d3.extent(data, function(d) { return d.date; })
              var yDomain = [0, d3.max(data, function(d) { return d.y0 + d.y; })]
              x.domain(xDomain);
              y.domain(yDomain);
              svg.selectAll(".layer")
                  .data(layers)
                  .attr("d", function(d) { return area(d.tempValues); })

            }, stepTime * i);
          })
        })
      }
    }
  }
  
  function updateXAxis(svg, xAxis) {
    svg.select(".x.axis").remove()
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height+1) + ")")
      .call(xAxis.orient('top'));
    $(".x.axis .tick line").attr('y2','-468').attr("stroke-dasharray","1, 5")
  }

  function map_layer_key(key) {
    switch (key) {
      case 'tv_compound':
        return 'TV Comp.'
      case 'hospitality':
      case 'paddock':
      case 'evillage':
      default:
        return key
    }
  }
  
  
  function tooltipTemplateParse(key, time, pro) {
    return "\
  <div class='info_block'>\
    <h4>"+key+"<span class='time'>"+time+"</span></h4>\
    <div class='value'>\
      <span class='number'>" + pro + "</span><span class='unit'>kW</span>\
    </div>\
  </div>"
  }
  
  function drawTooltip(d, x, tooltip) {
    var mousexy = d3.mouse(this);
    var mousex = mousexy[0] / Options.scaleFactor;
    var invertedx = x.invert(mousex);
    var selectedDate = x.invert(mousex)
    selectedDate.setSeconds(0)
    selectedDate.setMilliseconds(0)
    var roundedMinutes = Math.round((selectedDate.getMinutes()/Application.be_sampling_rate))*Application.be_sampling_rate // Thanks http://stackoverflow.com/a/32926308
    selectedDate.setMinutes(roundedMinutes)
    var selected = _.first(_.filter(d.values, function (e) { return e.date.getTime() === selectedDate.getTime() }))
    if (!selected) return
    pro = selected.value;
    var time = selected.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    tooltip.html(tooltipTemplateParse(d.key, time, pro)).style("visibility", "visible")
  }
  
  function interpolateInitialData(data) {
    var data = data
    var groups = _.groupBy(data, 'key')
    var values = _(data).groupBy('date').map(function(d){ return _.sumBy(d,'value') }).value()
    var maxTotal = d3.max(values)
    var layers = _.keys(groups).length
    _.each(groups, function (group) {
      var interpolateData = interpolateGroup(group, maxTotal, layers)
    })
    return data
  }
  
  function detachToolipEvents(svg, x, z, vertical, tooltip) {
    svg.selectAll(".layer")
      .on("touchstart", null)
      .on("touchend", null)
      .on("touchmove", null)
    d3.select("#streamgraph")
      .on("touchstart", null)
      .on("touchend", null)
  }
  
  function attachToolipEvents(svg, x, z, vertical, tooltip) {
    svg.selectAll(".layer")
      .attr("opacity", 1)
      .on("touchstart", function(d, i) {
        // make other layer fade when one is seleccted
        svg.selectAll(".layer").transition()
          .duration(250)
          // .style('fill', function (d, j) { return j == i ? 'rgb(0, 140, 90)' : 'rgb(0, 140, 90)' })
          .attr("opacity", function(d, j) { return j == i ? .8 : .8 })
        drawTooltip.bind(this)(d, x, tooltip)
        vertical.style("opacity", ".4")
        Application.stateman.emit('event', {name: 'tap_on_streamgraph'})
      })
      .on("touchend", function(d, i) {
       svg.selectAll(".layer")
        .transition()
        .duration(250)
        .style("fill", function(d, i) { return z(i); })
        .attr("opacity", "1");
        vertical.style("opacity", "0")
        tooltip.style("visibility", "hidden");
      })
      .on("touchmove", function(d, i) {
        drawTooltip.bind(this)(d, x, tooltip)
        vertical.style("opacity", ".4")
        Application.stateman.emit('event', {name: 'swipe_on_streamgraph'})
      })
    d3.select("#streamgraph")
      .on("touchstart", function() {  
        mouse = d3.mouse(this);
        mousex = mouse[0] / Options.scaleFactor + 2;
        mousey = mouse[1] / Options.scaleFactor - 125;
        var tooltipx = mousex + Options.tooltip.offsetX;
        var tooltipy = mousey + Options.tooltip.offsetY;
        if (tooltipy < Options.tooltip.minY) {
          tooltipy = Options.tooltip.minY;
          tooltipx -=90
        }
        if (tooltipy > Options.tooltip.maxY) tooltipy = Options.tooltip.maxY;
        if (tooltipx < Options.tooltip.minX) tooltipx = Options.tooltip.minX;
        if (tooltipx > Options.tooltip.maxX) tooltipx = Options.tooltip.maxX;

        vertical.style("left", mousex + "px" );
        tooltip.style("left", tooltipx + "px" );
        tooltip.style("top", tooltipy + "px" );
      })
      .on("touchmove", function() {  
        mouse = d3.mouse(this);
        mousex = mouse[0] / Options.scaleFactor + 2;
        var tooltipx = mousex + Options.tooltip.offsetX;
        var tooltipy = mousey + Options.tooltip.offsetY;
        if (tooltipy < Options.tooltip.minY) {
          tooltipy = Options.tooltip.minY;
          tooltipx -=90
        }
        if (tooltipy > Options.tooltip.maxY) tooltipy = Options.tooltip.maxY;
        if (tooltipx < Options.tooltip.minX) tooltipx = Options.tooltip.minX;
        if (tooltipx > Options.tooltip.maxX) tooltipx = Options.tooltip.maxX;
        //mousey = mouse[1] - 125; //dato che se mi sposto su e giù non cambio fascia, anche il toolti rimane fermo
        vertical.style("left", mousex + "px" );
        tooltip.style("left", tooltipx + "px" );
        tooltip.style("top", tooltipy + "px" );
      })
  }

  function interpolateGroup(data, total, layers) {
    var yInv = d3.scale.linear()
      .range([0, total])
      .domain([height, 0])
    var offset = yInv(dashboardEnelCursorDimension/2)/layers
    var offset = yInv(dashboardEnelCursorDimension-50)/((height-50)/dashboardEnelCursorDimension)
    // if (data[0].value == 0) offset = 0

    var initialValue = offset/layers
    var hoursToChange = 1.5
    var times = (hoursToChange*60) / Application.sampling_rate
    if (!(times < data.length)) times = data.length -1
    var dataToChange = _.take(data, times)
    _.times(times, function(x){
      dataToChange[x].value = Math.round(everpolate.linear(x, [0, times], [initialValue,  data[times].value])[0]*100)/100
    })
  }

}());
