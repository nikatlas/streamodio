// Create a new instance of node-core-audio 
var coreAudio = require("node-core-audio");
 
// Create a new audio engine 
var engine = coreAudio.createNewAudioEngine();


var numDevices = engine.getNumDevices();



var inputDeviceId;
var outputDeviceId;
for (var i = 0; i < numDevices; i++) {
    var name = engine.getDeviceName(i);
    console.log(name);
    if (!inputDeviceId && /Realtek HD Audio output/.test(name)) {
    	console.log("IN:" + name);
        inputDeviceId = i;
    }
    if (!outputDeviceId && /Realtek HD Audio output/.test(name)) {
    	console.log("OUT:" + name);
        outputDeviceId = i;
    }
}
console.log("DEV:" + engine.getDeviceName(3));
engine.setOptions({
    inputChannels: 1,
    inputDevice: 1,
    outputChannels: 1,
    outputDevice: null
});


// Add an audio processing callback 
// This function accepts an input buffer coming from the sound card, 
// and returns an ourput buffer to be sent to your speakers. 
// 
// Note: This function must return an output buffer 
function processAudio( inputBuffer ) {
    // console.log( "%d channels", inputBuffer.length );
    // console.log( "Channel 0 has %d samples", inputBuffer[0].length );
    //console.log(inputBuffer[0][0]);
 	for(var i=0;i<inputBuffer[0].length;i++){
 		inputBuffer[0][i] *= 1;
 	}
 	// inputBuffer[0][0] *=2;
    return inputBuffer;
}

engine.addAudioCallback( processAudio );