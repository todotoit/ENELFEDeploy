(function() {
  'use strict';

  var $dashboard = $('#dashboard')

  Application.animations.dashboard = {
    expand: function dashboardAnimationExpand() {
      $(document.body).attr('class','dashboard');
      TweenMax.to($('#streamgraph', $dashboard), .6, {css:{"opacity":"1"}, ease:Power3.easeOut} );

      TweenMax.to($('.branding', $dashboard), .6, {css:{"height":"468px"}, ease:Power3.easeOut} );
      TweenMax.to($('.branding .logo', $dashboard), .6, {css:{"height":"100px"}, ease:Power3.easeOut} );

      //expand and reset navigation
      TweenMax.to($('.navigation_container', $dashboard), .6, {css:{"height":"300px","margin-top":0}, ease:Power3.easeOut} );
      TweenMax.to($('p.nav_section-titlemini', $dashboard), 1, {css:{"margin-top":"-50px"},  ease:Power3.easeOut} );
      TweenMax.to($('.navigationplus svg', $dashboard), .6, {css:{"margin-top":"15px", rotation: 0}, ease:Power3.easeOut} );
      TweenMax.to($('.navigationplus svg line', $dashboard), .6, {css:{"stroke":"#000000"}, ease:Power3.easeOut} );
      TweenMax.to($('.navigationplus svg circle', $dashboard), .6, {css:{"stroke":"#000", "fill":"transparent"}, ease:Power3.easeOut} );

      //TweenMax.to($('#claim', $dashboard), 1, {css:{"margin-top":"0px", opacity:1}, ease:Power3.easeOut} );
      //TweenMax.to($('#main_generation', $dashboard), .6, {css:{"margin-top":"0px"}, delay:.1, ease:Power3.easeOut} );

      //hide top cursor and data
      TweenMax.to($('#main_generation_top .info_block', $dashboard), 1, {css:{"left":"-400px"}, ease:Power3.easeOut} );
      TweenMax.to($('#main_generation_top .cursor', $dashboard), .3, {css:{"width":"0px"}, delay:.1, ease:Power3.easeOut} );
    },
    collapse: function dashboardAnimationCollapse() {

      TweenMax.to($('#streamgraph', $dashboard), .4, {css:{"opacity":"0"}, ease:Power3.easeOut} );

      TweenMax.to($('.branding', $dashboard), .6, {css:{"height":"85px"}, ease:Power3.easeOut} );
      TweenMax.to($('.branding .logo', $dashboard), .35, {css:{"height":"65px"}, delay:.2, ease:Power1.easeOut} );

      //collapse navigation
      TweenMax.to($('.navigationplus svg', $dashboard), .6, {css:{"margin-top":"2px", rotation: 0}, ease:Power3.easeOut} );
      TweenMax.to($('.navigation_container', $dashboard), .6, {css:{"height":"50px","margin-top":"718px"}, ease:Power3.easeOut} );
      TweenMax.to($('p.nav_section-titlemini', $dashboard), .6, {css:{"margin-top":"5px"}, ease:Power3.easeOut} );

      //TweenMax.to($('#claim', $dashboard), .6, {css:{"margin-top":"60px", opacity:0}, ease:Power3.easeOut} );
      //TweenMax.to($('#main_generation', $dashboard), .6, {css:{"margin-top":"60px"}, ease:Power3.easeOut} );

      //show top cursor and data
      TweenMax.to($('#main_generation_top .info_block', $dashboard), 1, {css:{"left":"3px", opacity:1}, delay:.6, ease:Power3.easeOut} );
      TweenMax.to($('#main_generation_top .cursor', $dashboard), .6, {css:{"width":"9px"}, delay:.7, ease:Power3.easeOut} );
    },
  }

}());
