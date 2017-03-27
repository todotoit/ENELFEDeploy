var copydir = require('copy-dir');
var path = require('path');

if(process.argv[2]){

	if(process.argv[2] == 'fillergame'){
		console.log('deploying fillergame')
		copydir.sync(path.join('..', 'ENEL-FE-FillerGame/public'), 'fillergame');
	}

}else{

	console.log('you need to specify the app name')

}