function rgb2hex(a){return a=a.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i),a&&4===a.length?"0x"+("0"+parseInt(a[1],10).toString(16)).slice(-2)+("0"+parseInt(a[2],10).toString(16)).slice(-2)+("0"+parseInt(a[3],10).toString(16)).slice(-2):""}function bufferToCanvas(a){return{x:a.x*(APP.W-APP.max_r),y:a.y*APP.H}}function canvasToBuffer(a){return{x:a.x/APP.W,y:a.y/APP.H}}function svgToCanvas(a,b,c){a instanceof jQuery&&(a=a.get(0));var a,d=b.getContext("2d"),e=document.createElement("div"),f=a,g=new Image;e.appendChild(f.cloneNode(!0)),a="data:image/svg+xml;base64,"+window.btoa(e.innerHTML),g.src=a,g.onload=function(){d.clearRect(0,0,b.width,b.height),d.drawImage(g,0,0),c&&c(b)}}Number.prototype.map=function(a,b,c,d){return(this-a)*(d-c)/(b-a)+c},function(){var a=document.createElement("script");a.onload=function(){var a=new Stats;a.dom.className+="stats-meter",document.body.appendChild(a.dom),requestAnimationFrame(function b(){a.update(),requestAnimationFrame(b)})},a.src="//rawgit.com/mrdoob/stats.js/master/build/stats.min.js",document.head.appendChild(a)}(),function(a){function b(a,b){f=a,g=b,l="ws://"+f+":"+g+"/Skeleton",h=new WebSocket(l),h.onopen=function(a){console.log("socket connected"),k=setInterval(c,5e3)},h.onclose=function(a){console.log("socket close"),clearInterval(k),m=0,h=new WebSocket(l)},h.onmessage=function(a){var b=JSON.parse(a.data);j=!0,i&&i(b)},h.onerror=function(a){console.error("socket error",a)}}function c(){j||(console.log("socket is down, attempt:",m),m++),3==m&&(console.log("reconnecting...."),clearInterval(k),m=0,h=new WebSocket(l)),j=!1}function d(a){h.send(JSON.stringify(a))}function e(a){i=a}var f,g,h,i,j,k,l,m=0;window.sok={},window.sok.init=b,window.sok.send=d,window.sok.onData=e}(window.jQuery),function(){function a(a,c){h=a,i=a.children,j=i.length,k=c.min_r,l=c.max_r,m=c.audio;for(var d=0;j>d;++d){var e=new Zen(.01*Math.random()+.001);p.push(e)}requestAnimationFrame(b)}function b(){if(q)for(var a=0;j>a;++a){var c=p[a].update(),d=stage.getChildAt(a);d.x=c.x,d.y=c.y}requestAnimationFrame(b)}function c(a,b,c){if(!o){m.send(b,c);for(var e=0;j>e;++e){var f=i[e],g=f.x-b,h=f.y-c;n>g*g&&n>h*h&&!f.lock&&d(f)}}}function d(a){a.lock=!0,a.used||(a.used=!0,a.ox=a.x,a.oy=a.y);var b=(.75-1.5*Math.random(),.75-1.5*Math.random(),1.5*Math.random()),c=a.tint;TweenMax.set(a,{tint:parseInt(16729735)});var d=a.width.map(k,l,200,300);TweenMax.to(a,b,{overwrite:!0,physics2D:{velocity:d,angle:360*Math.random(),accelerationAngle:180,friction:.1},pixi:{tint:c},onComplete:e,onCompleteParams:[a]})}function e(a){var b=Math.random()+2;Math.random()+2;a.lock=!1,TweenMax.to(a,b+.1*a.width,{delay:0,x:a.ox,y:a.oy,ease:Expo.easeInOut})}function f(){o=!0;for(var a=0;j>a;++a){var b=i[a];b.lock=!1,b.used=!1,TweenMax.killTweensOf(b)}}function g(){o=!1}window.interakt={};var h,i,j,k,l,m,n=600,o=!1,p=[],q=!1;window.interakt.init=a,window.interakt.loop=b,window.interakt.pause=f,window.interakt.restore=g,window.interakt.addCursor=c}(),function(){function a(a){i=a,g=i.width/2,h=i.height/2,window.sok.onData(function(a){for(var b=0;b<a.length;++b)c(a[b])})}function b(){j=setInterval(function(){for(var a in l){var b=l[a];b&&(k.removeChild(b.sp1),k.removeChild(b.sp2)),l[a]=null}},1e4)}function c(a){var b,c=a.id;q&&e(a);for(var f=0;f<n.length;++f){var g=a[n[f]];b=d(g),window.interakt.addCursor(c,b.x,b.y)}}function d(a){var b=a.x*g+g,c=-1*a.z*h+h;return{x:b,y:c}}function e(a){var b=l[a.id];if(!b){f=new PIXI.Graphics,k.addChild(f),e=new PIXI.Graphics,k.addChild(e);var c=p[o];o++,o>=p.length&&(o=0),b={sp1:e,sp2:f,c:c},l[a.id]=b}var e=b.sp1,f=b.sp2;e.clear(),f.clear(),e.beginFill(b.c),f.lineStyle(3,b.c);for(var g,h=0;h<m.length;++h){var i=m[h],j=i[0];g=d(a[j]),e.drawCircle(g.x,g.y,10),f.moveTo(g.x,g.y);for(var n=0;n<i.length;++n){var q=i[n];g=d(a[q]),e.drawCircle(g.x,g.y,10),n>0&&f.lineTo(g.x,g.y)}}}function f(){q=!q,q?(b(),i.addChild(k)):(clearInterval(j),i.removeChild(k))}var g,h,i,j,k=new PIXI.Container,l={},m=[["handLeft","elbowLeft","shoulderLeft","spineShoulder","shoulderRight","elbowRight","handRight"],["head","spineShoulder","spineBase"],["ankleLeft","kneeLeft","spineBase","kneeRight","ankleRight"]],n=["handLeft","handRight","spineBase"],o=0,p=[16711680,65280,255,1044480,4080,983280],q=!1;window.skeleton={},window.skeleton.init=a,window.skeleton.toInterakt=c,window.skeleton.toggleDebug=f}(),function(){function a(){$("body").keypress(function(a){var b=a.which;switch(console.log(b),b){case 100:window.skeleton.toggleDebug();break;case 49:window.sok.send({command:"translationx",value:-.01});break;case 50:window.sok.send({command:"translationx",value:.01});break;case 51:window.sok.send({command:"translationz",value:-.01});break;case 52:window.sok.send({command:"translationz",value:.01});break;case 53:window.sok.send({command:"scale",value:-.01});break;case 54:window.sok.send({command:"scale",value:.01});break;case 55:window.sok.send({command:"timetowait",value:-1});break;case 56:window.sok.send({command:"timetowait",value:1});break;case 57:window.sok.send({command:"getcurrentsettings"})}})}window.keyboard={},window.keyboard.init=a}(),window.svgToCanvas=svgToCanvas,function(){function a(a){function b(a){var b=this;this.f=300,this.t=0,this.n=0;var c,d=a;return this.prop=function(){return c=b.t-b.f,b.n=b.n-c*d,b.t=b.n,b.n},this}var c=new b(a),d=new b(a);return this.update=function(){return{x:c.prop(),y:d.prop()}},this.x=function(){return c.prop()},this.setX=function(a){c.f=a},this.setiX=function(a){c.t=a},this.setfX=function(a){c.n=a},this.y=function(){return d.prop()},this.setY=function(a){d.f=a},this.setiY=function(a){d.t=a},this.setfY=function(a){d.n=a},this}window.Zen=a}();