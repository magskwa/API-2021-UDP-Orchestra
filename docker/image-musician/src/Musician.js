const uuid = require("uuid");
const protocol = require("./musician-protocol");
const dgram = require('dgram');

const soundDict = {};
soundDict['piano'] = 'ti-ta-ti';
soundDict['trumpet'] = 'pouet';
soundDict['flute'] = 'trulu';
soundDict['violin'] = 'gzi-gzi';
soundDict['drum'] = 'boum-boum';

// We use a standard Node.js module to work with UDP
const s = dgram.createSocket('udp4');

function getSound(instrument) {
    if (instrument in soundDict) {
        return soundDict[instrument];
    } else {
        console.log("Sorry we don't have this instrument.");
        return 'no_sound';
    }
}

function Musician(instrument) {

    this.instrument = instrument;
    this.uuid = uuid.v4();
    Musician.prototype.sendSound = function() {
        var sound = { timestamp: Date.now(),
            uuid: this.uuid,
            instrument: this.instrument,
            sound: getSound(this.instrument)
        };

        var payload = JSON.stringify(sound);

        console.log(payload);

// Send the payload via UDP (multicast)
        message = new Buffer(payload);
        s.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS,
            function(err, bytes) {
                console.log("Sending payload: " + payload + " via port " + s.address().port);
            });
    }

    setInterval(this.sendSound.bind(this), 1000);

}

var instrument = process.argv[2];

var musician = new Musician(instrument);