'use strict';

const DB=require('../DB.js');

const mongo=new DB;
const defaultQueries=require('../queries/tokens.js');

const log='DAO:Tokens';

class TokensDao{
    constructor(){

    }

    get queries(){
        return defaultQueries;
    }

    fetch(query,cb){

    }

    add(userID,tokens,cb){
        mongo.users.update(
            {
                userID:userID
            },
            {
                $inc:{
                    tokens:tokens
                }
            },
            cb
        );
    }

    remove(userID,tokens){
        mongo.users.update(
            {
                userID:userID
            },
            {
                $inc:{
                    tokens:-tokens
                }
            }
        )
    }

    insert(transaction,cb){
        mongo.tokens.insert(
           transaction,
           {
               upsert: false
           },
           cb
        );
    }
}

module.exports=TokensDao;
