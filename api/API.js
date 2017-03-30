const crypto=require('crypto');
const Message=require('js-message');
const methods=require('../config/APIMethods.js');

class API{
    constructor(ws){
        this.ws=ws;
    }

    error(message){
        const errorMessage=new Message;
        errorMessage.type=methods.error;
        errorMessage.data={
            type:message.type,
            data:message.data
        };

        this.send(errorMessage);
    }

    success(message){
        const successMessage=new Message;
        successMessage.type=methods.success;
        successMessage.data={
            type:message.type,
            data:message.data
        };

        if(!this.ws.readyState==1){
            return;
        };

        this.send(successMessage);
    }

    updateHandler(message,err,user){
        if(err){
            message.data.raw=err;
            this.error(message);
            return
        };

        if(!user){
            this.success(message);
            return;
        }

        user.tokens=user.private.tokens;
        user.token=user.private.token;

        if(user.private.photoID){
            user.isModel=true;
        }

        if(this.ws && this.ws.API){
            this.ws.API.UserInstance=user;
        }

        message.data=user;

        this.success(message);
    }

    send(message){
        if(this.ws.readyState!=1){
            return;
        }

        this.ws.send(message.JSON);
    }
}

module.exports=API;
