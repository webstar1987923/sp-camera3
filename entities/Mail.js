const verifyLink='https://{{domainName}}{{verifyLink}}?token={{verifyToken}}';
const Template=require(`../utils/Template.js`);

class Mail extends Template{
    constructor(){
        super();
    }

    getRegister(vars){
        return {
            subject:this.fill(
                vars,
                register.subject
            ),
            text:this.fill(
                vars,
                register.text
            ),
            html:this.fill(
                vars,
                register.html
            )
        }
    }

    getBoughtTokens(vars){
        return {
            subject:this.fill(
                vars,
                boughtTokens.subject
            ),
            text:this.fill(
                vars,
                boughtTokens.text
            ),
            html:this.fill(
                vars,
                boughtTokens.html
            )
        }
    }
}

const register={
    subject : '💌 Welcome to SP Cams - Please verify your account',
    text    : `Please verify your email by visiting ${verifyLink}`,
    html    : `
        <h1>Welcome {{userID}}!</h1>
        
        <p>
            Please 
            <a
                href='${verifyLink}'
            >
                verify your email.
            </a>
            
        </p>
        <br/>
        <p>
            By verifying your email or using the site in any way, you are agreeing that you are
            legally considered an adult age 18 or older.
        </p>
        <p>
            Have fun! 💋
        </p>
        <p>
            <a
                href='${verifyLink}'
            >
                ${verifyLink}
            </a>
        </p>
    `
}

const boughtTokens={
    subject : '💌 Thank you!',
    text:'You have just bought {{tokens}} tokens!',
    html:`
        <h1>Thank you {{userID}}!</h1>
        <p>
            You just got {{tokens}} new tokens, so your total is now 💰{{totalTokens}}
        </p>
        <p>
            Enjoy! 💋
        </p>
        <p>
        <a
            href='https://{{domainName}}'
        >
            {{domainName}}
        </a>
        </p>
    `
}

module.exports=Mail;
