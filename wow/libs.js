function rgb2hex(a){return a=a.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i),a&&4===a.length?"0x"+("0"+parseInt(a[1],10).toString(16)).slice(-2)+("0"+parseInt(a[2],10).toString(16)).slice(-2)+("0"+parseInt(a[3],10).toString(16)).slice(-2):""}function bufferToCanvas(a){return{x:a.x*(APP.W-APP.max_r),y:a.y*APP.H}}function canvasToBuffer(a){return{x:a.x/APP.W,y:a.y/APP.H}}function svgToCanvas(a,b,c){a instanceof jQuery&&(a=a.get(0));var a,d=b.getContext("2d"),e=document.createElement("div"),f=a,g=new Image;e.appendChild(f.cloneNode(!0)),a="data:image/svg+xml;base64,"+window.btoa(e.innerHTML),g.src=a,g.onload=function(){d.clearRect(0,0,b.width,b.height),d.drawImage(g,0,0),c&&c(b)}}Number.prototype.map=function(a,b,c,d){return(this-a)*(d-c)/(b-a)+c},function(){function a(a){h=a,i=a.children,j=i.length}function b(){}function c(a,b,c){if(!m){l[a]?l[a]:null;l[a]=[b,c];for(var e=0;j>e;++e){var f=i[e],g=f.x-b,h=f.y-c;if(k>g*g&&k>h*h&&!f.lock){f.lock=!0;var n=(.75-1.5*Math.random(),.75-1.5*Math.random(),1.5*Math.random()),o=f.tint;TweenMax.set(f,{tint:parseInt(16729735)});var p=f.width.map(APP.min_r,APP.max_r,200,300);TweenMax.to(f,n,{physics2D:{velocity:p,angle:360*Math.random(),accelerationAngle:180,friction:.1},colorProps:{tint:o,format:"number"},onComplete:d,onCompleteParams:[f,f.x,f.y]})}}}}function d(a,b,c){var d=Math.random()+2;Math.random()+2;TweenMax.to(a,d+.1*a.width,{delay:0,x:b,y:c,ease:Expo.easeInOut,onComplete:e,overwrite:!0,onCompleteParams:[a]})}function e(a){a.lock=!1}function f(){m=!0;for(var a=0;j>a;++a){var b=i[a];b.lock=!1,TweenMax.killTweensOf(b)}}function g(){m=!1}window.interakt={};var h,i,j,k=600,l={},m=!1;window.interakt.init=a,window.interakt.loop=b,window.interakt.pause=f,window.interakt.restore=g,window.interakt.addCursor=c}(),window.svgToCanvas=svgToCanvas;