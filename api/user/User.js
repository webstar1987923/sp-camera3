'use strict';

const User=require('../../entities/User.js');
const API=require('../API.js');
const AccountStatus=require('../../entities/AccountStatus.js');
const Message=require('js-message');
const Base64File=require('js-base64-file');
const Mail=require('../../services/Mail.js');
const Messages=require('../../entities/Mail.js');
const DB=require('../../DB.js');

const links=require('../../config/links.js');
const methods=require('../../config/APIMethods.js');
const accountStatus=new AccountStatus;
const mongo=new DB;

class UserAPI extends API{
    constructor(ws){
        super(ws);

        this.ws.API.on(
            ws.API.methods.register,
            this.register.bind(this)
        );

        this.ws.API.on(
            ws.API.methods.loadModel,
            this.loadAsModel.bind(this)
        );

        this.ws.API.on(
            ws.API.methods.streaming,
            this.streaming.bind(this)
        );

        this.ws.on(
            'close',
            this.disconnectUser.bind(this)
        )
    }

    loadAsModel(
        data={id:null}
    ){
        if(!data.id){
            return;
        }

        const user=new User;

        user.userID=data.id;

        user.load(
            data.id,
            this.loadedModel.bind(this)
        );
    }

    streaming(data={streaming:false}){
        this.ws.API.auth.ifAuthorized(
            this.setStreaming.bind(this,data)
        );
    }

    setStreaming(data){
        const message=new Message;
        message.type=methods.streaming;
        message.data={
            message:'unable to set streaming'
        }

        this.ws.API.UserInstance.streaming=data.streaming;
        this.ws.API.UserInstance.update(
            this.updateHandler.bind(this,message)
        );
    }

    register(
        data=new User
    ){
        const user=new User;

        Object.assign(
            user,
            data
        );

        const profileImg=user.profileImg;
        user.profileImg=`${user.userID}.png`;


        user.private.photoID=user.photoID;
        delete user.photoID;

        user.private.facialPhoto=user.facialPhoto;
        delete user.facialPhoto;

        user.private.password=user.password;
        delete user.password;

        user.private.token=this.ws.API.auth.generateToken(user);
        user.private.referer=user.referer;
        delete user.referer;

        if(user.private.photoID||user.private.facialPhoto){
            user.private.accountStatus=accountStatus.pending;
        }else{
            user.private.tokens=50;
        }

        user.private.verifyExpires=new Date().getTime()+(86400000*7);//+1 week
        user.private.verifyToken=this.ws.API.auth.generateToken(user);

        user.create(
            this.createdUser.bind(this,profileImg)
        );
    }

    disconnectUser(){
        if(!this.ws.API.UserInstance){
            return;
        }

        mongo.users.update(
            {
                userID:this.ws.API.UserInstance.userID
            },
            {
                $set:{
                    online:false,
                    streaming:false
                }
            }
        );
    }

    createdUser(profileImg,err,user){
        const base64Img=new Base64File;
        const message=new Message;
        message.type=methods.register;
        message.data={
            message:'unable to register'
        }

        if(err){
            message.data.raw=err;
            this.error(message);
            return;
        };

        if(user.profileImg){
            base64Img.save(
                profileImg.slice(22),
                `${__dirname}/../../appRoot/content/profileImg/`,
                user.profileImg,
                function(err){
                    if(!err){
                        return;
                    }
                    const message=new Message;
                    message.type=methods.error;
                    message.data={
                        message:'unable to save profile img'
                    }
                    this.error(message);
                }.bind(this)
            );
        }

        message.data=user;
        this.success(message);

        const mailTemplate={
            verifyToken:user.private.verifyToken,
            verifyLink:links.verifyLink,
            domainName:links.domainName,
            userID:user.userID,
            freeTokens:'50 free tokens'
        }

        if(user.private.photoID){
            mailTemplate.freeTokens='';
        }

        const mail=new Mail;
        const messages=new Messages().getRegister(mailTemplate);

        mail.to+=`,${user.email}`;
        mail.subject=messages.subject;
        mail.text=messages.text;
        mail.html=messages.html;
        console.log(mail.html);
        mail.send();
    }

    loadedModel(err,user){
        const message=new Message;
        message.type=methods.loadModel;
        message.data={
            message:'unable to find model'
        }

        if(err){
            message.data.raw=err;
            this.error(message);
            return;
        }

        if(!user.photoID&&user.facialPhoto){
            this.error(message);
            return;
        }

        delete user.email;
        user.isModel=true;

        message.data=user;
        this.success(message);
    }
}

module.exports=UserAPI;
