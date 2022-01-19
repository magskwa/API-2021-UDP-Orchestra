
const protocol = require('../../image-musician/src/musician-protocol');

const dgram = require('dgram');

const s = dgram.createSocket('udp4');

s.bind(protocol.PROTOCOL_PORT, function() {
    console.log("Joining multicast group");
    s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});


s.on('message', function(msg, source) {
    console.log("Data has arrived: " + msg + ". Source IP: " + source.address +
        ". Source port: " + source.port);
});
