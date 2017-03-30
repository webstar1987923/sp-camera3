'use strict';

const crypto=require('crypto');
const User=require('../../entities/User.js');
const API=require('../API.js');
const Message=require('js-message');
const AccountStatus=require('../../entities/AccountStatus.js');
const methods=require('../../config/APIMethods.js');

const accountStatus=new AccountStatus;

class AuthAPI extends API{
    constructor(ws){
        super(ws);

        this.ws.API.on(
            methods.login,
            this.login.bind(this)
        );

        this.ws.API.on(
            methods.checkAuthentication,
            this.login.bind(this)
        );

        this.ws.API.on(
            methods.logout,
            this.logout.bind(this)
        );
    }

    login(
        data={
            userID:'',
            password:'',
            token:''
        }
    ){
        const user=new User;
        user.load(
            data.userID,
            loginUser.bind(this,data.password,data.token)
        );
    }

    logout(){
        this.ifAuthorized(
            logoutUser.bind(this)
        );
    }

    generateToken(user){
        const now=new Date().getTime();

        return crypto.createHmac(
            'sha256',
            user.private.password
        ).update(
            `${user.userID}:${user.private.password}:${now}`
        ).digest('hex');
    }

    ifAuthorized(cb=function(){}){
        if(!this.ws.API.UserInstance){
            const message=new Message;
            message.type=methods.rejected;
            message.data={
                message:'not authenticated'
            }

            this.error(message);
            this.ws.close();
            return;
        }

        if(
            this.ws.API.UserInstance
            &&this.ws.API.UserInstance.private.verified==true
            &&this.ws.API.UserInstance.private.tokenExpires<new Date().getTime()
        ){
            const message=new Message;
            message.type=methods.rejected;
            message.data={
                message:'expired'
            }

            this.error(message);
            this.ws.close();
            return;
        }

        this.ws.API.UserInstance.load(
            this.ws.API.UserInstance.userID,
            checkAuthorized.bind(this,cb)
        );
    }
}

function checkAuthorized(cb,err,user){
    const message=new Message;
    message.type=methods.rejected;
    message.data={
        message:'unauthorized'
    }

    if(err){
        message.raw=err;
        this.error(message);
        this.ws.close();
        return;
    }

    if(
        user.private.token!==this.ws.API.UserInstance.private.token
        ||user.private.tokenExpires<new Date().getTime()
        ||user.private.password!==this.ws.API.UserInstance.private.password
        ||user.userID!==this.ws.API.UserInstance.userID
        ||user.email!==this.ws.API.UserInstance.email
    ){
        this.error(message);
        this.ws.close();
        return;
    }

    user.private.tokenExpires=freshExpires();
    this.ws.API.UserInstance=user;

    cb();
}

function loginUser(password,token,err,user){
    const message=new Message;
    message.type=methods.login;
    message.data={
        message:'invalid credentials'
    }

    if(
        user.private.verified!==true
    ){
        message.data.message='Account Not Verified.';
        message.data.raw='Please check your email to verify your account.';
        this.error(message);
        return
    };

    if(token){
        message.type=methods.checkAuthentication;
        message.data={
            message:'invalid token'
        }
    }

    if(err){
        message.data.raw=err;
        this.error(message);
        return
    };

    if(
        user.private.password!==user.hashPassword(password)
        &&user.private.token!==token
    ){
        if(token){
            message.type=methods.rejected;
        }
        this.error(message);
        return
    };

    if(
        user.private.accountStatus==accountStatus.pending
    ){
        message.data.message='Account Pending.';
        message.data.raw='Please check your email to verify your account.';
        this.error(message);
        return
    };

    if(
        user.private.accountStatus!==accountStatus.active
        && user.private.accountStatus!==accountStatus.disable
    ){
        this.error(message);
        return
    };

    user.private.token = this.generateToken(user);
    user.private.tokenExpires=freshExpires();
    user.online=true;

    message.data.message='unable to update user'

    user.update(
        this.updateHandler.bind(this,message)
    );
}

function freshExpires(){
    //60,000=ms in 1 min * 60 min in 1 hour * x number of hours
    return 60000*60*1+new Date().getTime();
}

function logoutUser(){
    const message=new Message;
    message.type=methods.logout;
    message.data={
        message:'invalid token'
    }

    this.ws.API.UserInstance.private.tokenExpires=0;
    this.ws.API.UserInstance.online=false;
    this.ws.API.UserInstance.streaming=false;

    this.ws.API.UserInstance.update(
        this.updateHandler.bind(this,message)
    );
}

module.exports=AuthAPI;
