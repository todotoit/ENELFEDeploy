;(function(window, undefined){
    
    'use strict'


    var template = `<svg id="sidebarDonutChart" viewBox="0 0 300 300" xmlns:svg="http://www.w3.org/2000/svg"
                       xmlns="http://www.w3.org/2000/svg">

                        <linearGradient id="sidebarDonutChart_green" x1="0" x2="1" y1="0" y2="1">
                            <stop offset="0%" stop-color="#59BC5F"/>
                            <stop offset="100%" stop-color="#178F5C"/>
                        </linearGradient>

                    </svg>`;

    
    // main init function
    var init = function(el, data){
        console.log('init sidebarDonutChart', el)
        var donutChart = this
        var data = data

        var _clb
        var arcsG
        var arcs
        var cursG
        var curs

        d3.select(el).html(template);
                
        var svg = d3.select('#sidebarDonutChart')

        var box = svg.attr('viewBox').split(' ')
        var w = box[2];
        var h = box[3];
        var p = 20;

        arcsG = svg.append('g')
            .attr('transform', 'translate('+w/2+','+h/2+')')

        cursG = svg.append('g')
            .attr('transform', 'translate('+w/2+','+h/2+')')

        var svgDefs = svg.append('defs')


        var mypiearc = d3.svg.arc()
                .innerRadius(w/2 - 60 - p)
                .outerRadius(w/2 - p);

        var mycurs = d3.svg.arc()
                .innerRadius(w/2 - 60)
                .outerRadius(w/2)
                .startAngle(function(d, i){
                    return d.endAngle - .15
                })


        donutChart.update = function(data){
            if (!data || data.length == 0) return

            // limit too much min values, under 10% it'll be set as 10% of the max
            var max = d3.max(data, function(d){
                return +d.energy
            })
            var min = d3.min(data, function(d){
                return +d.energy
            })

            data.forEach(function(d){
                var v = d.energy*100/max
                if(v > 0 && v < 10) {
                  d.energy = max/5
                }
            })


            var mypie = d3.layout.pie()
                .value(function(d){
                    return d.energy;
                })
                .sort(null)


            var ndata = mypie(data)

            var gradients = svgDefs.selectAll('linearGradient')
                .data(ndata)

            var newgrads = gradients.enter()
                .append('linearGradient')
                .attr('id', function(d, i){
                    return 'sidebarDonutChart_gr' + i
                })
                .attr('gradientUnits', 'userSpaceOnUse')
                .attr('x1', '0%')
                .attr('x2', function(d, i){
                    var a = d.startAngle + (d.endAngle - d.startAngle)/2
                    return Math.cos(a)*100/Math.PI*2 + '%'
                })
                .attr('y1', '0%')
                .attr('y2', function(d, i){
                    var a = d.startAngle + (d.endAngle - d.startAngle)/2
                    return Math.sin(a)*100/Math.PI*2 + '%'
                })

            newgrads.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', '#ccc')

            newgrads.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', '#000')





            arcs = arcsG.selectAll('path')
                .data( ndata )
            
            arcs.enter()
                .append('path')
                .attr('id', function(d,i){ return 'arc-' + d.data.name })
                .attr('fill', function(d, i){
                    return 'url(#sidebarDonutChart_gr'+i+')'
                })
            
            arcs.attr('d', mypiearc)

            /*
            curs = cursG.selectAll('path')
                .data( ndata )

            curs.enter()
                .append('path')
                .attr('fill', 'white')

            curs.attr('d', mycurs)
            */

            /*
            curs = cursG.selectAll('g')
                .data( ndata )

            curs.enter()
                .append('g')
                .attr('transform', function(d, i){
                    var a = d.endAngle * 180/Math.PI
                    return 'rotate('+a+')'
                })
                .append('rect')
                .attr('x', -20)
                .attr('y', -60 - (w/2 - 60 - p))
                .attr('width', 20)
                .attr('height', 60)
                .attr('fill', 'none')
            */

            curs = cursG.selectAll('g')
                .data( ndata )

            var cursg = curs.enter()
                .append('g')
                .append('image')
                .attr('xlink:href', '../components/sidebarDonutChart/assets/cursor.png')
                
            curs.attr('transform', function(d, i){
                    var a = d.endAngle * 180/Math.PI
                    return 'rotate('+a+')'
                })
                
            curs.select('image')
                .attr('y', -61 - (w/2 - 60 - p))
                .attr('fill', 'none')

        }

        donutChart.update(data)

        arcs.on('click', function(d){
            donutChart.select(d.data.name)
        })

        donutChart.onSelected = function(clb){
            _clb = clb
        }
        
        donutChart.select = function(key, clb) {
          arcs.attr('fill', 'url(#sidebarDonutChart_gr1)')
          d3.select('#arc-' + key)
            .attr('fill', 'url(#sidebarDonutChart_green)')
          var d = data.find(function(d) { return d.name === key})
          if(_clb) _clb(d)
        }

        return donutChart;
    }
    
    // global interface name
    window.sidebarDonutChart = init
    
})(window);
