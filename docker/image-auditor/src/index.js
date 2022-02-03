var musicianDict = {};

const protocol = require('./auditor-protocol.js');

const dgram = require('dgram');

const s = dgram.createSocket('udp4');

s.bind(protocol.PROTOCOL_PORT, function() {
    s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});


s.on('message', function(msg, source) {
    var data = String(msg).split(',');

    var uuid = data[1].split(':')[1].substr(1, data[1].split(':')[1].length - 2);

    var instrument = data[2].split(':')[1].substr(1, data[2].split(':')[1].length - 2);
    musicianDict[uuid] = {
        uuid: uuid,
        instrument: instrument,
        activeSince: new Date(parseInt(Date.now())).toISOString()
    };
});

setInterval(checkActiveMusician, 1000);

function checkActiveMusician() {
    for (value of Object.values(musicianDict)) {
        if (new Date(parseInt(Date.now())) - new Date(value.activeSince) > 5000) {
            delete musicianDict[value.uuid];
        }
    }
}

setInterval(checkActiveMusician, 1000);


const Net = require('net');
const port = 2205;

const server = new Net.Server();

server.listen(port, function () {
    console.log('Server listening for connection requests');
});


server.on('connection', function (socket) {
    console.log('A new connection has been established.');

    var musicianArray = [];
    // écrire la liste des musicien
    for (value of Object.values(musicianDict)) {
        musicianArray.push(value);
    }
    socket.write(JSON.stringify(musicianArray));
    socket.end();

});