'use strict';

const UserDao=require('../dao/User.js');
const Validator=require('../validators/default.js');
const Genders=require('./Genders.js');
const AccountStatus=require('./AccountStatus.js');
const crypto = require('crypto');

const dao=new UserDao;
const genders=new Genders;
const accountStatus=new AccountStatus;
const isValid=new Validator;

const log='Entities:User';

class User{
    constructor(){
        this.DOB=0;
        this.firstName='Nobody';
        this.lastName='McNobody';
        this.userID='';
        this.email='';

        this.country='None';
        this.city='None';
        this.state='None';

        this.gender='';

        this.profileImg='/test.png';

        this.online=false;
        this.streaming=false;

        Object.defineProperties(
            this,
            {
                private:{
                    enumerable:false,
                    writable:false,
                    value:{
                        tokens:0,
                        verified:false,
                        verifyToken:'',
                        verifyExpires:0,
                        resetToken:'',
                        resetExpires:0,
                        token:'',
                        tokenExpires:0,
                        publicKey:'',
                        password:'',
                        accountStatus:accountStatus.active,
                        currentRoom:0,
                        photoID:'',
                        facialPhoto:'',
                        created:'',
                        updated:''
                    }
                },
                isValid:{
                    enumerable:false,
                    writable:false,
                    value:validateObject
                },
                update:{
                    enumerable:false,
                    writable:false,
                    value:update
                },
                create:{
                    enumerable:false,
                    writable:false,
                    value:create
                },
                load:{
                    enumerable:false,
                    writable:false,
                    value:load
                },
                suspend:{
                    enumerable:false,
                    writable:false,
                    value:suspend
                },
                hashPassword:{
                    enumerable:false,
                    writable:false,
                    value:hashPassword
                }
            }
        );
    }
}

function validateObject(){
    const keyCount=Object.keys(this).length;
    let validKeys=0;

    (isValid.number(this.DOB))?validKeys++:null;
    (isValid.adult(this.DOB))?null:validKeys--;

    (isValid.string(this.firstName))?validKeys++:null;
    (isValid.string(this.lastName))?validKeys++:null;
    (isValid.string(this.userID))?validKeys++:null;
    (isValid.string(this.email))?validKeys++:null;

    (isValid.string(this.country))?validKeys++:null;
    (isValid.string(this.city))?validKeys++:null;
    (isValid.string(this.state))?validKeys++:null;

    (genders.isValid(this.gender))?validKeys++:null;

    (isValid.string(this.profileImg))?validKeys++:null;

    (isValid.requirement(this.online))?validKeys++:null;
    (isValid.requirement(this.streaming))?validKeys++:null;

    return(validKeys==keyCount);
}

function update(cb=function(){}){
    delete this.token;
    delete this.tokens;
    delete this.isModel;

    if(
        !this.isValid()
        ||!isValid.string(this.private.password)
        ||!accountStatus.isValid(this.private.accountStatus)
    ){
        const err=`${log}:Update invalid user ${JSON.stringify(this)}`;
        cb(err,this);
        return;
    }

    const user=Object.assign({},this.private,this);

    user.accountStatus=Number(user.accountStatus);
    user.tokens=Number(user.tokens);

    dao.update(
       user,
       updated.bind(this,cb)
    );
}

function create(cb=function(){}){
    if(!this.isValid()||!accountStatus.isValid(this.private.accountStatus)){
        const err=`${log}:Create invalid user status ${JSON.stringify(this)}`;
        cb(err,this);
        return false;
    }

    if(!isValid.requirement(this.private.password)){
        const err=`${log}:Create password not set ${JSON.stringify(this)}`;
        cb(err,this);
        return false;
    }

    if(!isValid.string(this.private.password)&&!isValid.number(this.private.password)){
        const err=`${log}:Create password not valid ${JSON.stringify(this)}`;
        cb(err,this);
        return false;
    }

    this.private.password=this.hashPassword();
    this.private.created=new Date().getTime();

    const user=Object.assign({},this.private,this);

    user.accountStatus=Number(user.accountStatus);
    user.tokens=Number(user.tokens);

    dao.insert(
       user,
       inserted.bind(this,cb)
    );
}

function load(
    userID=this.userID,
    cb=function(){}
){
    const query=dao.queries.user;
    query.query.$or[0].userID=userID;
    query.query.$or[1].email=userID;

    dao.fetch(
       query,
       updated.bind(this,cb)
   );
}

function hashPassword(password=this.private.password){
    const hash = crypto.createHmac(
        'sha256',
        password
    ).update(
        `${this.userID}:${password}`
    ).digest('hex');

    return hash;
}

function suspend(){
    this.private.accountStatus=accountStatus.suspend;
    this.update();
}

function updated(cb,err,user){
    if(err){
        cb(err,this);
        return;
    }

    let result=user.ops;

    if(!result){
        cb(err,this);
        return;
    }

    if(result.length!==1){
        cb(err,this);
        return;
    }

    result=result[0];

    for(let key in this){
        this[key]=result[key];
    }

    for(let key in this.private){
        this.private[key]=result[key];
    }

    delete user._id;

    cb(err,this);
}

function inserted(cb,err,user){
    if(err){
        cb(err,user);
        return;
    }

    updated.bind(this)(cb,err,user);
}

module.exports=User;
