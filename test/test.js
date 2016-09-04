var streamodio = require('../index.js');


var i = 0;
function readfn(inbuf) {
	console.log("Reading...");
	console.log("Length : " + inbuf.length);
}


streamodio.init();
streamodio.setOnRead(readfn);
streamodio.start();