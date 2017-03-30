'use strict';

const Message=require('js-message');
const http=require('http');

let peerConfig='';

const options = {
    hostname: '52.11.5.78',
    port: 8080,
    method: 'GET'
};
updatePeerConfig();

class PeerConfig{
    constructor(){

    }

    get config(){
        return peerConfig
    }
}

function updatePeerConfig(){
    const req = http.request(
        options,
        (res) => {
            let body='';
            res.setEncoding('utf8');

            res.on(
                'data',
                (chunk) => {
                    body=`${body}${chunk}`
                }
            );
            res.on(
                'end',
                () => {
                    peerConfig=body;
                }
            );
        }
    );

    req.on(
        'error',
        (e) => {
            console.log(`problem with request: ${e.message}`);
        }
    );

    req.end();
}

module.exports=PeerConfig;
