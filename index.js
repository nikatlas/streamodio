// Create a new instance of node-core-audio 
var coreAudio 	= require("node-core-audio");
var Promise 	= require('promise');
require('promise/lib/rejection-tracking').enable(
  {allRejections: true}
);


var streamodio = {
	engine: null,
	init: function () {
		streamodio.engine = coreAudio.createNewAudioEngine();
		return Promise.resolve(streamodio)
				.then(streamodio.selectStereoMix)
				.then(function(){
                    streamodio.setOptions();
                });
	},
	selectStereoMix: function () {
		var numDevices = streamodio.engine.getNumDevices();
		var dId = null;
		for (var i = 0; i < numDevices; i++) {
		    var name = streamodio.engine.getDeviceName(i);
            console.log(name);
		    if (!dId && /Stereo Mix/.test(name)) {
		        dId = i;
		    }
		}
		streamodio.inputId = dId;
		return Promise.resolve(streamodio);
	},
	setOptions: function () {
		if(streamodio.inputId == null)return Promise.reject("There is no inputId selected");
        var opts = {
            inputChannels: 1,
            outputChannels: 1,
            inputDevice: streamodio.inputId
        }
		streamodio.engine.setOptions(opts);
		return Promise.resolve(streamodio);
	},
	_onRead: null,
	setOnRead: function (fn) {
		streamodio._onRead = fn;
	},
    _loop: function () {
        var input = streamodio.engine.read();
        if(streamodio._onRead!=null)streamodio._onRead(input);
        // Silence the 0th channel
        for( var iSample=0; iSample<input[0].length; ++iSample )
            input[0][iSample] = 0.0;
        streamodio.engine.write(input);
        if(streamodio._active)setTimeout(streamodio._loop,0);
    },
	start: function (){
		streamodio._active = true;
        streamodio._loop();
	},
	stop: function(){
		streamodio._active = false;
	}

};

module.exports = streamodio;













// var inputDeviceId;
// var outputDeviceId;
// for (var i = 0; i < numDevices; i++) {
//     var name = engine.getDeviceName(i);
//     console.log(name);
//     if (!inputDeviceId && /Realtek HD Audio output/.test(name)) {
//     	console.log("IN:" + name);
//         inputDeviceId = i;
//     }
//     if (!outputDeviceId && /Realtek HD Audio output/.test(name)) {
//     	console.log("OUT:" + name);
//         outputDeviceId = i;
//     }
// }
// engine.setOptions({
//     inputChannels: 1,
//     inputDevice: 1,
//     outputChannels: 1
// });


// // Add an audio processing callback 
// // This function accepts an input buffer coming from the sound card, 
// // and returns an ourput buffer to be sent to your speakers. 
// // 
// // Note: This function must return an output buffer 
// function processAudio( inputBuffer ) {
//     // console.log( "%d channels", inputBuffer.length );
//     // console.log( "Channel 0 has %d samples", inputBuffer[0].length );
//     //console.log(inputBuffer[0][0]);
//  	for(var i=0;i<inputBuffer[0].length;i++){
//  		inputBuffer[0][i] *= 1;
//  	}
//  	// inputBuffer[0][0] *=2;
//     return inputBuffer;
// }

// engine.addAudioCallback( processAudio );
