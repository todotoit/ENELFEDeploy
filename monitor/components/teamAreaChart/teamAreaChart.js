;(function(window, undefined){
    
    'use strict'

    var template = `<svg id="teamAreaChart" viewBox="0 0 600 250">

                        <linearGradient id="teamAreaChart_bl1" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="300">
                            <stop offset="0%" stop-color="#48BAE4"></stop>
                            <stop offset="100%" stop-color="#1A68F3"></stop>
                        </linearGradient>

                        <linearGradient id="teamAreaChart_bl2" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="300">
                            <stop offset="0%" stop-color="#1A68F3"></stop>
                            <stop offset="100%" stop-color="#48BAE4"></stop>
                        </linearGradient>

                    </svg>`

    
    // main init function
    var init = function(el, data){
        this.data = data
        this.selectedKey = ''

        console.log('init teamAreaChart', el)

        var format = d3.time.format('%Y-%m-%dT%H:%M:%S')
        this.data.forEach(function(data){
          if (!data.values) return
          data.values.forEach(function(d){
            format.parse(d.h)
          })
        })

        var colors = ['red', 'blue']

        d3.select(el).html(template);
                
        var svg = d3.select('#teamAreaChart')

        var box = svg.attr('viewBox').split(' ')
        var w = box[2];
        var h = box[3];
        var p = 30;

        var areas = svg.append('g')
        areas.append('path').attr('class', 'area1')
        areas.append('path').attr('class', 'area2')

        var lns = svg.append('g').append('path')

        var ax1 = svg.append('g')
                .attr('transform', 'translate('+p+', '+p+')')
                .attr('class', 'axis')

        var ax2 = svg.append('g')
                .attr('transform', 'translate('+p+', '+(h-p)+')')
                .attr('class', 'axis')


        function emptyData(data) {
          var values = data.values
          var emptydata = {
            key: data.key,
            values: values.map(function(d){
              return { h: d.h, v: 0 }
            })
          }
          return emptydata
        }

        this.select = function(key){
          if (!key) return this.selectAll()
          this.selectedKey = key
          var selectedData = []
          this.data.forEach(function(d){
            if (d.key === key) return selectedData.push(d)
            return selectedData.push(emptyData(d))
          })
          update(selectedData, false)
        }

        this.selectAll = function() {
          this.selectedKey = ''
          return update(this.data, true)
        }

        this.updateData = function(data) {
          this.data = data
          this.select(this.selectedKey)
        }
        
        function update(data, isAll){
            if (!data || data.length == 0) return
                
            if (_.isEmpty(data[0].values)) data[0] = emptyData(data[1])
            if (_.isEmpty(data[1].values)) data[1] = emptyData(data[0])

            var stack = d3.layout.stack()
                    .values(function(d){
                        return d.values;
                    })
                    .x(function(d){
                        return format.parse(d.h)
                    })
                    .y(function(d){
                        return d.v
                    })

            stack(data);

            var totData = []
            data[0].values.forEach(function(d, i){
                totData.push( {h: data[0].values[i].h, v:d.v + data[1].values[i].v} )
            })

            var max = d3.max(totData, function(d, i){
                return d.v
            })

            var maxl = data[0].values.length-1
            
            var xdomain = d3.extent(data[0].values, function(d) { return format.parse(d.h); })
            var mapx = d3.time.scale()
                .domain(xdomain)
                .range([0, w-p*2]);

            var mapy = d3.scale.linear()
                        .domain([0,max])
                        .range([h-p*2, 0])


            var area = d3.svg.area()
                .x(function(d){
                    return p + mapx(format.parse(d.h));
                })
                .y0(function(d){
                    return p + mapy(d.y0);
                })
                .y1(function(d){
                    return p + mapy(d.y+d.y0);
                })
                //.interpolate('monotone')


            areas.selectAll('path')
                .data(data)
                .transition()
                .attr('d', function(d){
                    return area(d.values)
                })
                




            var line = d3.svg.line()
                .x(function(d, i){
                    return p+mapx(format.parse(d.h));
                })
                .y(function(d, i){
                    return p + mapy(d.v);
                })
                //.interpolate('basis');
                
            var borderWidth = (isAll) ? 3 : 1
            // console.log(borderWidth)

            lns.transition()
                .attr('d', line(totData))
                .style('fill', 'none')
                .style('stroke', 'white')
                .style('stroke-width', borderWidth);







            // -------- AXIS ---------

            var formatY = d3.format('.1f')

            var axis_y = d3.svg.axis()
            .scale(mapy)
            .orient('left')
            .tickSize(2)
            .tickFormat(function(d,i) {
              if(i===0) return
              return formatY(d)
            })

            var formatX = d3.time.format("%H:%M");

            var axis_x = d3.svg.axis()
                .scale(mapx)
                .orient('bottom')
                .tickSize(1)
                .ticks(d3.time.hours)
                .tickFormat(function(d,i) {
                  if(i===0) return
                  return formatX(d)
                })

            ax1.transition().call(axis_y)
            ax2.transition().call(axis_x)


        } // update

        update(data, true)

        return this;
    }
    
    // global interface name
    window.teamAreaChart = init
    
})(window);
