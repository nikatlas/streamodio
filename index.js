// Create a new instance of node-core-audio 
var coreAudio 	= require("node-core-audio");
var Promise 	= require('promise');
require('promise/lib/rejection-tracking').enable(
  {allRejections: true}
);


var streamodio = {
	engine: null,
	init: function () {
		this.engine = coreAudio.createNewAudioEngine();
		return Promise.resolve(this)
				.then(streamodio.selectStereoMix)
				.then(streamodio.setOptions);
	},
	selectStereoMix: function () {
		var numDevices = engine.getNumDevices();
		var dId = null;
		for (var i = 0; i < numDevices; i++) {
		    var name = engine.getDeviceName(i);
		    if (!inputDeviceId && /Stereo Mix/.test(name)) {
		        dId = i;
		    }
		}
		this.inputId = dId;
		return Promise.resolve(this);
	},
	setOptions: function () {
		if(this.inputId == null)return Promise.reject("There is no inputId selected");
		this.engine.setOptions({
		    inputChannels: 1,
		    inputDevice: this.inputId,
		    outputChannels: 1
		});
		return Promise.resolve(this);
	},
	_onRead: null,
	setOnRead: function (fn) {
		this._onRead = fn;
	},
	start: function (){
		this._active = true;
		while(this._active){
			var input = this.engine.read();
			if(this._onRead!=null)this._onRead(input);
		}
	},
	stop: function(){
		this._active = false;
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
