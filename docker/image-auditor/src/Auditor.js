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
    //console.log(data);

    var uuid = data[1].split(':')[1].substr(1, data[1].split(':')[1].length - 2);
    //console.log(uuid);

    var instrument = data[2].split(':')[1].substr(1, data[2].split(':')[1].length - 2);
    //console.log(instrument);

    musicianDict[uuid] = {
        uuid: uuid,
        instrument: instrument,
        activeSince: new Date(parseInt(Date.now())).toISOString()
    };

    console.log('Dict after message:\r\n');
    //console.log(musicianDict);

});



const Net = require('net');
const port = 2205;

const server = new Net.Server();

server.listen(port, function() {
    console.log('Server listening for connection requests');
});



server.on('connection', function(socket) {
    console.log('A new connection has been established.');

    // écrire la liste des musicien
    socket.write("Hello you\n");
    for( value of Object.values(musicianDict)){
        socket.write(JSON.stringify(value));
    }

    server.close(function () {
        console.log('server closed.');
        server.unref();
    });
    /*

    socket.on('end', function() {
        console.log('Closing connection with the client');
    });

     */

    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
    });
});
