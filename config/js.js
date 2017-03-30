const certs=require('./certs.js');
const links=require('./links.js');
const ports=require('./ports.js');
const methods=require('./APIMethods.js');
const dataset=require('./dataset.js');
const text=require('./text.js');
const PeerConfig=require('../entities/PeerConfig.js');

const peerConfig=new PeerConfig;

class Config{
    constructor(){
        this.initWindowJS=`
            window.on=window.on||window.addEventListener;
            window.off=window.off||window.addEventListener;
            document.on=document.on||document.addEventListener;
            document.off=document.off||document.addEventListener;

            window.app=window.app||{};
            app.camUser={};

            window.api=window.api||null;
        `;

        this.stripePublic=certs.stripePublic;
        this.APIMethods=JSON.stringify(methods);

        this.peerConfig=peerConfig.config;

        Object.assign(
            this,
            links,
            ports,
            dataset,
            text
        );
    }
}

module.exports=Config;
