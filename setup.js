'use strict';

const DB=require('./DB.js');
const mongo=new DB;

setTimeout(
    function(){
        mongo.users.createIndex(
            'userID',
            {
                unique: true
            },
            function(err,data){
                console.log('response : ',err,data);
            }
        );

        mongo.users.createIndex(
            'token',
            {
                unique: true
            },
            function(err,data){
                console.log('response : ',err,data);
            }
        );

        mongo.users.createIndex(
            'email',
            {
                unique: true
            },
            function(err,data){
                console.log('response : ',err,data);
            }
        );

        mongo.tokens.createIndex(
            'id',
            {
                unique: true
            },
            function(err,data){
                console.log('response : ',err,data);
            }
        );
    },
    100
);
