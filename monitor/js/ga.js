;(function(window, $, undefined){

	if(!window.ga) return
  if (Application.environment == 'idle') return
  $(document).ready(function(){
    var state = Application.stateman.current
    var section = null

    var loc = window.location.pathname

  	if(state){
    	var v = loc + state.name
    	ga('set', 'page', v);
    	ga('send', 'pageview', v);
      console.log('ga send ', v)
    }

    Application.stateman.on('begin', function (e){
    	var v = e.path
      section = Application.animations.idle.feStructure[e.current.name].slides[e.name]
             || Application.animations.idle.feStructure[e.current.name].slides[0]
      if (section) v += loc + section.name
    	ga('set', 'page', v);
    	ga('send', 'pageview', v);
      console.log('ga send ', v)
    })

    Application.stateman.on('idle', function(){
    	ga('send', 'pageview', {'sessionControl': 'start'});
      console.log('ga send session start')
    })

    Application.stateman.on('section', function(e){
    	var state = Application.stateman.current
      section = Application.animations.idle.feStructure[state.name].slides[e.name]
             || Application.animations.idle.feStructure[state.name].slides[0]
    	if(state && section && e){
    		var v = loc + state.name + '/' + section.name
    		ga('set', 'page', v);
    		ga('send', 'pageview', v);
        console.log('ga send ', v);
    	}
    })

    Application.stateman.on('content', function(e){
      var state = Application.stateman.current
      section = section || Application.animations.idle.feStructure[state.name].slides[0]
      if(state && section && e){
        var v = loc + state.name + '/' + section.name + '/' + e.name
        ga('set', 'page', v);
        ga('send', 'pageview', v);
        console.log('ga send ', v);
      }
    })

    Application.stateman.on('event', function(e){
      ga('send', 'event', 'tabletapp', e.name);
      console.log('ga event', e.name);
    })
  })

})(window, window.jQuery)
