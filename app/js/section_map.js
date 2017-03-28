(function() {
  'use strict'

  $(document).ready(function () {

    //TODO NEED TO TOTALLY REWRITE THIS PART

    // SLIDE 3D transform
    /*var circuit_wrap = $("#circuit_wrap"),
    circuit = $("#circuit"),// div containing the circuit
    circuitLayer0 = $("#circuitLayer0")

    TweenMax.set(circuit_wrap, {css:{transformPerspective:800, transformStyle:"preserve-3d"}});

    //electricity effect
    TweenMax.set('#circuit_line', {drawSVG:"0% 2%", opacity:0,"stroke-linecap":"round"});
    TweenMax.to('#circuit_line', 2, {drawSVG:"98% 100%", ease:Linear.easeNone, repeat:-1});
    TweenMax.to('#circuit_line', .2, {css:{opacity:1, "stroke-width":"12px"}, ease:Linear.easeNone, repeat:1, yoyo: true, delay:.1, repeatDelay: .2});

    setInterval(function(){
      TweenMax.to('#circuit_line', .2, {css:{opacity:1, "stroke-width":"12px"}, ease:Linear.easeNone, repeat:1, yoyo: true, delay:.1, repeatDelay: .2});
    }, 5000)

    function building0(){
      TweenMax.to(circuit_wrap, 2.5, {"rotationX":"60", "z":20, ease:Power2.easeInOut})
      TweenMax.to(circuit, 2.5, {"rotationZ":-88, ease:Power2.easeInOut},'-=3')
      TweenMax.to(circuitLayer0, 2.5, {"rotationZ":-88, ease:Power2.easeInOut}, '-=3')
      TweenMax.to(circuitLayer0, 1, {css:{z:9}, ease:Power2.easeOut, delay:2})
      TweenMax.to($('#el03d'), .5, {"opacity":1, ease:Power2.easeOut, delay:2})
    }

    function building1(){
      TweenMax.to(circuit_wrap, 2.5, {"rotationX":"60", "z":20, ease:Power2.easeInOut})
      TweenMax.to(circuit, 2.5, {"rotationZ":28, ease:Power2.easeInOut},'-=3')
      TweenMax.to(circuitLayer0, 2.5, {"rotationZ":28, ease:Power2.easeInOut}, '-=3')
      TweenMax.to(circuitLayer0, 1, {css:{z:9}, ease:Power2.easeOut, delay:2})
      TweenMax.to($('#el13d'), .5, {"opacity":1, ease:Power2.easeOut, delay:2})
    }

    function building2(){
      TweenMax.to(circuit_wrap, 2.5, {"rotationX":"60", "z":20, ease:Power2.easeInOut})
      TweenMax.to(circuit, 2.5, {"rotationZ":190, ease:Power2.easeInOut},'-=3')
      TweenMax.to(circuitLayer0, 2.5, {"rotationZ":190, ease:Power2.easeInOut}, '-=3')
      TweenMax.to(circuitLayer0, 1, {css:{z:9}, ease:Power2.easeOut, delay:2})
      TweenMax.to($('#el23d'), .5, {"opacity":1, ease:Power2.easeOut, delay:2})
    }

    function topView(){
      TweenMax.to(circuit_wrap, 2.5, {"rotationX":"0", "z":"0", ease:Power2.easeInOut})
      TweenMax.to(circuit, 2.5, {"rotationZ":0, ease:Power2.easeInOut})
    }

    function resetBuildings(){
      TweenMax.to(circuitLayer0, 1, {css:{z:0}, ease:Power2.easeOut, delay:'-=3'})
      TweenMax.to($('#el03d'), .5, {"opacity":0, ease:Power2.easeOut})
      TweenMax.to($('#el13d'), .5, {"opacity":0, ease:Power2.easeOut})
      TweenMax.to($('#el23d'), .5, {"opacity":0, ease:Power2.easeOut})
      //TO DO KILL DELAYEDTWEEN
    }

    carousel2.on('changed.owl.carousel', function(e) {
      showBuilding(e.page.index);
    })

    function showBuilding(index){
      switch(index){
        case 0:
        TweenMax.to($('#circuit_nav'), 1.2, {"opacity":".3", ease:Power2.easeOut, yoyo: true, repeat: 1})
        resetBuildings();
        topView();
        break;
        case 1:
        TweenMax.to($('#circuit_nav'), 1.2, {"opacity":".3", ease:Power2.easeOut, yoyo: true, repeat: 1})
        resetBuildings();
        building0();
        break;
        case 2:
        TweenMax.to($('#circuit_nav'), 1.2, {"opacity":".3", ease:Power2.easeOut, yoyo: true, repeat: 1})
        resetBuildings();
        building1();
        break;
        case 3:
        TweenMax.to($('#circuit_nav'), 1.2, {"opacity":".3", ease:Power2.easeOut, yoyo: true, repeat: 1})
        resetBuildings();
        building2();
        break;
      }


      $('#building0').click(function(e){
        e.preventDefault();

        TweenMax.to($('#circuit_nav'), 1.2, {"opacity":".3", ease:Power2.easeOut, yoyo: true, repeat: 1})
        resetBuildings();
        building0();
      })

      $('#building1').click(function(e){
        e.preventDefault();
        TweenMax.to($('#circuit_nav'), 1.2, {"opacity":".3", ease:Power2.easeOut, yoyo: true, repeat: 1})
        resetBuildings();
        building1();
      })

      $('#building2').click(function(e){
        e.preventDefault();
        TweenMax.to($('#circuit_nav'), 1.2, {"opacity":".3", ease:Power2.easeOut, yoyo: true, repeat: 1})
        resetBuildings();
        building2();
      })

      $('#top_view').click(function(e){
        e.preventDefault();
        TweenMax.to($('#circuit_nav'), 1.2, {"opacity":".3", ease:Power2.easeOut, yoyo: true, repeat: 1})
        resetBuildings();
        topView();
      })
    }*/
  })
}())
