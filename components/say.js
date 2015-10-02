var fs = require('fs');
var path = require('path');
var sys = require('sys')
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;

var mespeak = require("mespeak");
mespeak.loadConfig(require("mespeak/src/mespeak_config.json"));
mespeak.loadVoice(require("mespeak/voices/en/en-us.json"))
mespeak.loadVoice(require("mespeak/voices/en/en-sc.json"))
mespeak.loadVoice(require("mespeak/voices/fr.json"))
mespeak.loadVoice(require("mespeak/voices/en/en.json"))

var rmdir = function(dir) {
	var list = fs.readdirSync(dir);
	for(var i = 0; i < list.length; i++) {
		var filename = path.join(dir, list[i]);
		//console.log('filename',filename);
		fs.unlinkSync(filename);
	}
	fs.rmdirSync(dir);
};

var voices=[
	{
		//voice 0
		pitch: 50,
		speed: 175,
		voice: 'en/en'
	},
	{
		//voice 1
		pitch: 25,
		speed: 160,
		voice: 'en/en-us'
	}
];
var voice = 0;

var delimiter = '[wavsplit]';
var encodedmessage = process.argv[2].replace(/\+/g, '%20');		//swap '+' for '%20'
var message = decodeURIComponent(encodedmessage)
	.replace(/[\u2018\u2019]/g, "'")							//normalise unicode curly apostrophe
	.replace(/[\u201C\u201D]/g, '"')							//normalise unicode curly double quotes
	.replace(/[\u2026]/g, '.')									//convert ellipsis to full stop (mespeak says ellipsis as 'and')
	.replace(/\"/g, delimiter+'"'+delimiter)
	.replace(/\.\s/g, '.'+delimiter)
	.replace(/\?\s/g, '?'+delimiter)
	.replace(/\!\s/g, '!'+delimiter)
	.replace(/\n|\r/g, ''+delimiter);

var sentences = message.split(delimiter).filter(function(n){return n != ""});	//filter empty cells


var tempdir = path.join(__dirname,'temp');
if(fs.existsSync(tempdir)) rmdir(tempdir);
fs.mkdirSync(tempdir,'0777');
var count=0;
sentences.forEach(function(rawsentence, index){

	var sentence = rawsentence.trim();
	if(sentence==='"'){
		if(voice===0) voice=1;
		else voice=0;
	} else{

		console.log('sentence'+count+': ',sentence);
		var data = mespeak.speak(sentence, {
			pitch: voices[voice].pitch,
			speed: voices[voice].speed,
			voice: voices[voice].voice,
			volume: 1,
			rawdata: "buffer"
		});
		var filename = "temp_"+count+".wav";
		count++;
		var filepath = path.join(tempdir,filename);
		fs.writeFileSync(filepath, data);

		exec("vlc --one-instance --playlist-enqueue --play-and-exit "+filepath);
	}

});

process.on('exit', function(){
	//console.log('cleanup');
	rmdir(tempdir);
});