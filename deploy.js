var copydir = require('copy-dir');
var path = require('path');

if(process.argv[2]){

	if(process.argv[2] == 'fillergame'){
		console.log('deploying fillergame')
		copydir.sync(path.join('..', 'ENEL-FE-FillerGame/public'), 'fillergame');
	}

	if(process.argv[2] == 'website'){
		console.log('deploying website')
		copydir.sync(path.join('..', 'ENEL-F-E-APP/public/'), '');
	}

	if(process.argv[2] == 'tablet'){
		console.log('deploying tablet')
		copydir.sync(path.join('..', 'ENEL-F-E/app/'), 'app');
	}

}else{

	console.log('you need to specify the app name')

}