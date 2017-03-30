const UserDao=require('../dao/User.js');
const dao=new UserDao;

const defaultLimit=100;

const userCache={
    all:[],
    clients:[],
    models:[],

    online:[],
    onlineClients:[],
    onlineModels:[],
    streaming:[]
}

const types=[
    'all',
    'clients',
    'models',
    'online',
    'onlineClients',
    'onlineModels',
    'streaming'
];

let currentIndex=0;


class UserList{
    constructor(){
        this.types=types;
    }

    get all(){
        return userCache.all;
    }

    get clients(){
        return userCache.clients;
    }

    get models(){
        return userCache.models;
    }

    get online(){
        return userCache.online;
    }

    get onlineClients(){
        return userCache.onlineClients;
    }

    get onlineModels(){
        return userCache.onlineModels;
    }

    get streaming(){
        return userCache.streaming;
    }

    fetch(type,limit=defaultLimit){
        const query=dao.queries[type];
        query.limit=limit;
        if(query.appendNotExpired){
            const notExpired=Object.assign(
                {},
                query.appendNotExpired
            );
            delete query.appendNotExpired;

            notExpired.tokenExpires.$gt=new Date().getTime();

            query.query.$and.push(
                notExpired
            );
        }

        dao.fetch(
            query,
            cache.bind(null,type)
        );
    }
}

function cache(type,err,users){
    if(err){
        throw(err);
    }
    userCache[type]=users.ops;
}

function init(){
    for(let type of types){
        UserList.prototype.fetch(type);
    }
}

setTimeout(
    init,
    500
);

setInterval(
    function(){
        UserList.prototype.fetch(
            types[currentIndex]
        );
        (currentIndex++<types.length-1)?null:currentIndex=0;
    },
    1973
);

module.exports=UserList;
