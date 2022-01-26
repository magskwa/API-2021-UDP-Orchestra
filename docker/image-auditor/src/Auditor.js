var musicianDict = {};

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
    var data = String(msg).split(',');
    console.log(data);

    var uuid = data[1].split(':')[1].substr(1, data[1].split(':')[1].length - 2);
    console.log(uuid);

    var instrument = data[2].split(':')[2].substr(1, data[1].split(':')[2].length - 2);


    console.log('Dict after message:\r\n');
    console.log(musicianDict);

});
