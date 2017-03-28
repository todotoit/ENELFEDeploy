(function() {
	'use strict'

	$(document).ready(function () {
		//TO DO : set idle mode after some time of inactivity

		var colors =["#2388EF","#FC1C66","#55BE5A"],
			col,
			dashboardCollapsed = false,
			sections = 3,
			sectionWidth = 100/sections+"%";




		function setNavColors(){
			for (var i = 0; i < $('.nav_section').length; i++) {
				TweenMax.to($('#nav_section'+i), .8, {css:{backgroundColor:"#FFF",color:colors[i],width:sectionWidth}, ease:Power3.easeOut})
			}
		};

		setNavColors();

		// NAVIGATION
		// $('.nav_section').click(function (e) {
		// 	e.preventDefault();
		// 	var index = Number($(this).attr('data-index'));
		//
		// 	showSection(index);
		//
		// 	if (!dashboardCollapsed) {
		// 		collapseDashboard(index);
		// 	};
		//
		// 	highlightNav(index);
		// })



		//SHOW SECTION CONTENT
		function showSection(index){
			//TO DO : show the right content
			$('.section').css('display','none')
			$($('.section')[index]).show();
		}

		//collapse Dashboard when one of the section is tapped
		function collapseDashboard(index){
			dashboardCollapsed= true;

			//collapse brand section
			TweenMax.to('#branding', .8, {css:{"height":"80px"}, ease:Power3.easeOut} );
			TweenMax.to('#logo', .8, {css:{"height":"60px", "padding-top":"1vh"}, ease:Power3.easeOut} );

			//collapse navigation
			TweenMax.to('#nav_container', .8, {css:{"height":"80px","margin-top":608}, ease:Power3.easeOut} );
			TweenMax.to($('.nav_section'), .8, {css:{"height":"80px"}, ease:Power3.easeOut} );
		}

		//COLORS AND CHANGE WIDTH OF NAV WHEN COLLAPSED
		function highlightNav(index){
			setNavColors();
			TweenMax.to($('.nav_section h4'), .8,{css:{marginTop:"-50px", marginBottom:"20px"}, ease:Power3.easeOut} );
			TweenMax.to($('.nav_section h3'), .8,{css:{fontSize:"1.1em"}, ease:Power3.easeOut} );
			TweenMax.to($('.nav_section'), .8,{css:{width:100-((sectionWidth+sectionWidth/2)/(sections-1))},ease:Power3.easeOut} );
			TweenMax.to($('.nav_section')[index], .8,{css:{width:sectionWidth+sectionWidth/2+100,"color":"#FFF",backgroundColor:colors[index]}, ease:Power3.easeOut} );

			TweenMax.to($('.container'), .8,{css:{backgroundColor:colors[index]}, ease:Power3.easeOut} );
		}


		//BACK TO Dashboard
		function showDashboard(){
			dashboardCollapsed= false;

			TweenMax.to('#branding', .8, {css:{"height":"280px"}, ease:Power3.easeOut} );
			TweenMax.to('#logo', .8, {css:{"height":"15vw", "padding-top":"5vh"}, ease:Power3.easeOut} );

			//expand and reset navigation
			setNavColors();
			TweenMax.to($('.nav_section h4'), .8,{css:{marginTop:"0px", marginBottom:"0px"}, ease:Power3.easeOut} );
			TweenMax.to($('.nav_section h3'), .8,{css:{fontSize:"1.6em"}, ease:Power3.easeOut} );
			TweenMax.to('#nav_container', .8, {css:{"height":"488px","margin-top":0}, ease:Power3.easeOut} );
			TweenMax.to($('.nav_section'), .8, {css:{"height":"488px",width:sectionWidth,}, ease:Power3.easeOut} );

			//TweenMax.to($('.container'), .8,{css:{backgroundColor:"#FFF"}, ease:Power3.easeOut} );
		}

		$('#branding').click(function (e) {
			e.preventDefault();
			showDashboard();
		})


		// INIT SLIDERS

		var carousel0 = Application.UI.createCarousel('#carousel0');
		carousel0.on('changed.owl.carousel', function(e) {
		  console.log(e);
		})

		var carousel1 = Application.UI.createCarousel('#carousel1');
		carousel1.on('changed.owl.carousel', function(e) {
		    console.log(e);
		})

		// NOTE: borked, to be refactored
		window.carousel2 = Application.UI.createCarousel('#carousel2');
	})

}())
