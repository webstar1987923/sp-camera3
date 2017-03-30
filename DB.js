'use strict';

const MongoClient=require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/webRTCCams';
var openDB = null;

MongoClient.connect(
  url,
  function(err,db){
    openDB=db;
  }
);
class DB{

    constructor(){

    }

    get db(){
        console.log(openDB)
        return openDB
    }

    get users(){
        return openDB.collection('users');
    }

    get tokens(){
        return openDB.collection('tokenTransactions');
    }
}

module.exports=DB;
