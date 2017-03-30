'use strict';

const fs=require('fs');
const certs=require('./config/certs.js');
const server=require('node-http-server');
const config=new server.Config;
config.verbose= false;
config.port=80;
config.root=`${__dirname}/appRoot/`;
config.errors[404]='<h1 class="error404">Error 404 : Page Not Found</h1>';
config.errors.headers['content-type']=config.contentType.html;
config.noCache=false;
config.https.privateKey = certs.key;
config.https.certificate= certs.cert;
config.contentType.mp3='audio/mpeg3';

const links=require(`./config/links.js`);
const redirects=require(`./config/redirects.js`);
const HTMLConfig=require(`./config/html.js`);
const CSSConfig=require(`./config/css.js`);
const JSConfig=require(`./config/js.js`);
const AccountStatus=require(`./entities/AccountStatus.js`);
const DB=require(`./DB.js`);
const Template=require(`./utils/Template.js`);

let htmlConfig=new HTMLConfig;
let cssConfig=new CSSConfig;
let jsConfig=new JSConfig;

const mongo=new DB;
const template=new Template;

const cacheTimes={
    template:10000,
    config:6500
}

startCache();

function setTemplate(type,err,data){
    if(err){
        throw(err);
    }

    template.templates[type]=data.toString();

    if(type=='chat'){
        htmlConfig.chat=template.templates.chat;
    }
}

function rawRequest(request,response){
    if(!redirects[request.uri.pathname]){
        return;
    }

    if(request.uri.pathname==links.verifyLink){
        verifyUser(request.uri.query.token);
    }



    request.url=redirects[request.uri.pathname];
    request.uri.pathname=
    request.uri.path=redirects[request.uri.pathname];

    return;
}

function onRequest(request,response){

}

function beforeServe(request,response,body,encoding){
    const isHTML=request.url.includes('.html');
    const isCSS=request.url.includes('.css');
    const isJS=request.url.includes('.js');

    //@TODO: use new proxy support to populate model profile instead
    //of doing it on front end for better SEO

    if(!isHTML&&!isCSS&&!isJS){
        return;
    }

    let variables={};

    if(isHTML){
        body.value=template.templates.index.replace(
            '{{content}}',
            body.value
        );
        variables=htmlConfig;
        body.value=template.fill(
            variables,
            body.value
        );
    }

    if(isCSS){
        variables=cssConfig;
    }

    if(isJS){
        variables=jsConfig;
    }

    if(!variables){
        return;
    }

    body.value=template.fill(
        variables,
        body.value
    );
}

function startCache(){
    loadTemplate();
    setTimeout(
        updateConfigs,
        1000
    );

    setInterval(
        updateConfigs,
        cacheTimes.config
    );

    setInterval(
        loadTemplate,
        cacheTimes.template
    );
}

function loadTemplate(){
    fs.readFile(
        `${config.root}${config.server.index}`,
        setTemplate.bind(null,'index')
    );

    fs.readFile(
        `${config.root}public/chat/chat.html`,
        setTemplate.bind(null,'chat')
    );
}

function updateConfigs(){
    htmlConfig=new HTMLConfig;
    jsConfig=new JSConfig;

    htmlConfig.chat=template.templates.chat;
}

function verifyUser(token){
    const accountStatus=new AccountStatus;

    mongo.users.update(
        {
            verifyToken:token,
            verifyExpires:{
                $gt:new Date().getTime()
            }
        },
        {
            $set:{
                verified:true,
                accountStatus:accountStatus.active,
                verifyExpires:0,
                verifyToken:''
            }
        }
    );
}

server.deploy(config);
server.onRawRequest=rawRequest;
server.onRequest=onRequest;
server.beforeServe=beforeServe;
