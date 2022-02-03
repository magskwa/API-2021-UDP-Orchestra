const uuid = require("uuid");
const protocol = require("./musician-protocol.js");
const dgram = require('dgram');

const soundDict = protocol.SOUNDS;

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

    this.sendSound();
    setInterval(this.sendSound.bind(this), 1000);

}

var instrument = process.argv[2];

if (getSound(instrument) !== 'no_sound') {
    var musician = new Musician(instrument);
}
