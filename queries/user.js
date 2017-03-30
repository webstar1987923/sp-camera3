const AccountStatus=require('../entities/AccountStatus.js');
const accountStatus=new AccountStatus;

const defaultKeys={
    _id:0,
    userID:1,
    currentRoom:1,
    userName:1,
    online:1,
    streaming:1,
    gender:1,
    DOB:1,
    profileImg:1
}
const online={
    online:true
}
const streaming={
    streaming:true
}
const notStreaming={
    streaming:false
}
const active={
    accountStatus:accountStatus.active
}
const model={
    photoID:{
        $ne:null
    }
}
const client={
    photoID:null
}
const notExpired={
    tokenExpires:{
        $gt:1
    }
};

var queries={
    defaultKeys:defaultKeys,

    all:{
        query:active
    },

    models:{
        query:{
            $and:[
                active,
                model
            ]
        }
    },

    clients:{
        query:{
            $and:[
                active,
                client
            ]
        }
    },

    online:{
        query:{
            $and:[
                online,
                active
            ]
        },
        appendNotExpired:notExpired
    },

    onlineModels:{
        query:{
            $and:[
                online,
                notStreaming,
                active,
                model
            ]
        },
        appendNotExpired:notExpired
    },

    onlineClients:{
        query:{
            $and:[
                online,
                active,
                client
            ]
        },
        appendNotExpired:notExpired
    },

    streaming:{
        query:{
            $and:[
                online,
                active,
                streaming
            ]
        },
        appendNotExpired:notExpired
    },

    suspended:{
        query:{
            accountStatus:accountStatus.suspend
        }
    },

    disabled:{
        query:{
            accountStatus:accountStatus.disable
        }
    },

    user:{
        query:{
            $or:[
                {
                    userID:null
                },
                {
                    email:null
                }
            ],
            $and:[
                {
                    accountStatus:{
                        $ne:accountStatus.suspend
                    }
                }
            ]
        },
        keys:{
            _id:0
        },
        limit:1
    }
}

module.exports=queries;
