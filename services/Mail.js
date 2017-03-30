const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport('smtps://support%40scentedpansycams.com:Study666will@smtp.gmail.com');

class Mailer{
    constructor(){
        this.from   = '"Scented Pansy Cam Support" <support@scentedpansycams.com>';
        this.to     = '';
        this.subject= '';
        this.text   = '';
        this.html   = '';
    }

    send(cb=function(error, info){}){
        transporter.sendMail(
            this,
            cb
        );
    }
}

module.exports=Mailer;
