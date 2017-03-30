'use strict';

const User=require('../../entities/User.js');
const API=require('../API.js');
const Message=require('js-message');
const Tokens=require('../../dao/Tokens.js');
const AccountStatus=require('../../entities/AccountStatus.js');
const Mail=require('../../services/Mail.js');
const Messages=require('../../entities/Mail.js');


const dao=new Tokens;
const text=require('../../config/text.js');
const links=require('../../config/links.js');
const certs=require('../../config/certs.js');
const stripe = require("stripe")(certs.stripePrivate);
const methods=require('../../config/APIMethods.js');

const accountStatus=new AccountStatus;

class TokenAPI extends API{
    constructor(ws){
        super(ws);

        this.ws.API.on(
            methods.buyTokens,
            this.buy.bind(this)
        );

        this.ws.API.on(
            methods.tip,
            this.tip.bind(this)
        );
    }

    buy(purchaseRequest){
        this.ws.API.auth.ifAuthorized(
            buyTokens.bind(this,purchaseRequest)
        );
    }

    tip(tipInfo){
        tipInfo.token=Number(tipInfo.token);
        if(tipInfo.token<0){
            const message=new Message;
            message.type=methods.tip;
            message.data={
                message:'No Shitty Tips!'
            }
            this.error(message);
            return;
        }
        this.ws.API.auth.ifAuthorized(
            tipModel.bind(this,tipInfo)
        );
    }
}

function buyTokens(data){
    const charge = stripe.charges.create(
        {
            amount      : data.stripeRequest.amount, // Amount in cents
            currency    : "usd",
            source      : data.token.id,
            description : data.stripeRequest.description,
            statement_descriptor:`${text.CCStatementDescriptor}${data.tokens}`
        },
        completeTransaction.bind(this,data)
    );
}

function completeTransaction(data, err, transaction) {
    const message=new Message;
    message.type=methods.buyTokens;
    message.data={
        message:'unable to purchase tokens at this time',
        raw:transaction
    }

    if (err && err.type === 'StripeCardError') {
        this.error(message);
        return;
    }

    if(transaction.status!=='succeeded'){
        message.data.message='Payment Declined';
        this.error(message);
        return;
    }

    dao.insert(
        transaction
    );

    message.data.message=`unable to add tokens to account, refrence : ${transaction.id}`

    this.ws.API.UserInstance.private.tokens+=data.tokens;

    this.ws.API.UserInstance.update(
        this.updateHandler.bind(this,message)
    );

    const mailTemplate={
        domainName:links.domainName,
        userID:this.ws.API.UserInstance.userID,
        tokens:data.tokens,
        totalTokens:this.ws.API.UserInstance.private.tokens
    }

    const mail=new Mail;
    const messages=new Messages().getBoughtTokens(mailTemplate);

    mail.to+=`,${this.ws.API.UserInstance.email}`;
    mail.subject=messages.subject;
    mail.text=messages.text;
    mail.html=messages.html;
    mail.send();
}

function tipModel(tipInfo){
    const message=new Message;
    message.type=methods.tip;
    message.data={
        message:'insufficient tokens'
    }

    tipInfo.token=Number(tipInfo.token);

    if(this.ws.API.UserInstance.private.tokens<tipInfo.tokens){
        message.data.raw=`
            You only have ${this.ws.API.UserInstance.private.tokens},
            so you can't tip ${tipInfo.tokens}
        `;
        this.error(message);
        return;
    }

    const model=new User;

    model.load(
        tipInfo.model.userID,
        sendTipsToModel.bind(this,message,tipInfo.tokens)
    );
}


function sendTipsToModel(message,tokens,err,model){
    message.data.message='unable to transfer tokens';

    this.ws.API.UserInstance.private.tokens-=tokens;

    if(!model.private.tokens){
        model.private.tokens=0;
    }

    model.private.tokens+=tokens;

    const modelMessage=new Message;
    modelMessage.type=methods.tip;
    modelMessage.data={
        message:'failed to tip model'
    }

    this.ws.API.UserInstance.update(
        this.updateHandler.bind(this,message)
    );

    dao.add(
        model.userID,
        tokens,
        modelTipped.bind(this,modelMessage,tokens)
    );
}

function modelTipped(message,tokens,err,model){
    if(err){
        this.error(message);
        return;
    }

    message.data={
        tokens:tokens
    }

    this.send(message);
}

module.exports=TokenAPI;
