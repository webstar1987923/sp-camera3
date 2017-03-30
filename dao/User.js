'use strict';

const DB=require('../DB.js');

const mongo=new DB;
const defaultQueries=require('../queries/user.js');

const log='DAO:User';

class UserDao{
    constructor(){

    }

    get queries(){
        return defaultQueries;
    }

    fetch(query,cb){
        if(!query.query.$where){
            delete query.query.$where;
        }else{
            query.query.$where.replace('{{now}}',new Date().getTime());
        }

        const result=mongo.users.find(
            query.query,
            query.keys||this.queries.defaultKeys
        );

        if(query.limit){
            result.limit(query.limit).toArray(
               respond
            );
            return;
       }

        result.toArray(
            respond
        );

        function respond(err,data){
            cb(err,{ops:data})
        }
    }

    insert(user,cb){
        mongo.users.insert(
           user,
           {
               upsert: false
           },
           cb
        );
    }

    update(user,cb){
        mongo.users.update(
           {
               userID: user.userID
           },
           user,
           cb
        );
    }
}

function expire(){
    mongo.users.updateMany(
        {
            tokenExpires:{
                $gt:0,
                $lt:new Date().getTime()
            }
        },
        {
            $set:{
                tokenExpires:0,
                online:false,
                streaming:false
            }
        }
    );
}

setTimeout(
    expire,
    600
)

setInterval(
    expire,
    13719
);

module.exports=UserDao;
