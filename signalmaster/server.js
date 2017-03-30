/*global console*/
var yetify = require('yetify'),
    config = require('getconfig'),
    fs = require('fs'),
    sockets = require('./sockets'),
    port = parseInt(process.env.PORT || config.server.port, 10),
    server = null;

var server_handler = function(req, res) {
    res.writeHead(404);
    res.end();
};

if (config.server.secure) {
    server = require('https').Server({
        key: fs.readFileSync(config.server.key),
        cert: fs.readFileSync(config.server.cert)
    }, server_handler);
} else {
    server = require('http').Server(server_handler);
}
server.listen(port);

sockets(server, config);

if (config.uid)
    process.setuid(config.uid);

var httpUrl;
if (config.server.secure) {
    httpUrl = "https://localhost:" + port;
} else {
    httpUrl = "http://localhost:" + port;
}
console.log(yetify.logo() + ' -- signal master is running at: ' + httpUrl);
