const protocol = require('./sensor-protocol');
// We use a standard Node.js module to work with UDP
const dgram = require('dgram');
// Let's create a datagram socket. We will use it to send our UDP datagrams
const s = dgram.createSocket('udp4');
// Create a measure object and serialize it to JSON
var measure = { timestamp: Date.now(),
    location: this.location,
    temperature: this.temperature };
var payload = JSON.stringify(measure);
// Send the payload via UDP (multicast)
message = new Buffer(payload);
s.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS,
    function(err, bytes) {
        console.log("Sending payload: " + payload + " via port " + s.address().port);
    });
