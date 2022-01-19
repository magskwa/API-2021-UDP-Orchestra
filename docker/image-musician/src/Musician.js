const soundDict = {};
soundDict['piano'] = 'ti-ta-ti';
soundDict['trumpet'] = 'pouet';
soundDict['flute'] = 'trulu';
soundDict['violin'] = 'gzi-gzi';
soundDict['drum'] = 'boum-boum';

const protocol = require('./musician-protocol');

const uuid = require('uuid');
// We use a standard Node.js module to work with UDP
const dgram = require('dgram');
// Let's create a datagram socket. We will use it to send our UDP datagrams
const s = dgram.createSocket('udp4');
// Create a measure object and serialize it to JSON
var sound = { timestamp: Date.now(),
    instrument: process.argv[2],
    sound: getSound(process.argv[2])
};

var payload = JSON.stringify(sound);

console.log(payload);

// Send the payload via UDP (multicast)
message = new Buffer(payload);
s.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS,
    function(err, bytes) {
        console.log("Sending payload: " + payload + " via port " + s.address().port);
    });

function getSound(instrument) {
    if (instrument in soundDict) {
        return soundDict[instrument];
    } else {
        console.log("Sorry we don't have this instrument.");
        return 'no_sound';
    }
}