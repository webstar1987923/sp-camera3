const config=require('./config/ports.js');
const certs=require('./config/certs.js');
const https=require('https');
const fs=require('fs');
const methods=require('./config/APIMethods.js');
const WSS=require('ws').Server;
const Events=require('event-pubsub');
const Message=require('js-message');

const Auth=require('./api/auth/Auth.js');
const User=require('./api/user/User.js');
const Tokens=require('./api/tokens/Tokens.js');

function processRequest( req, res ) {
    res.writeHead(200);
    res.end('what?');
};

console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
console.log(https);
console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")

const app = https.createServer(
    {
        key: fs.readFileSync( certs.key ),
        cert: fs.readFileSync( certs.cert )
    },
    processRequest
).listen(config.WSAPI);

const wss=new WSS(
    {
        server: app
    }
);

wss.on(
    'connection',
    function connection(ws) {
        ws.API=new Events;
        ws.API.methods=methods;

        ws.API.auth=new Auth(ws);
        ws.API.user=new User(ws);
        ws.API.user=new Tokens(ws);

        ws.on(
            'message',
            onMessage
        );

        function onMessage(data){
            const message=new Message;
            message.load(data);

            ws.API.trigger(
                message.type,
                message.data
            );
        }
    }
);
