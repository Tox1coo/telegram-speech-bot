const open = require('open');
var exec = require('child_process').execFile;

exports.openApp = async function () {
	   exec("C:/Users/wwwda/AppData/Local/Programs/Opera_GX/opera.exe", function(err, data) {
        console.log(err)
        console.log(data.toString());
    });
}
exports.openSite = async function (app) {
	if(app === 'vk') {
		await open('https://vk.com/feed', {
			app: {
				name: open.apps.chrome
			}
		});
	} else if(app ==='youtube') {
		await open('https://www.youtube.com', {
			app: {
				name: open.apps.chrome
			}
		});
	}
}
exports.openSteam = function(){
   exec('C:/Program Files (x86)/Steam/steam.exe', function(err, data) {

    });
}
exports.openDiscord = function(){
   exec("C:/Users/wwwda/AppData/Local/Discord/app-1.0.9005/Discord.exe", function(err, data) {

    });
}

