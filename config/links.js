const os = require('os');
const text = require('./text.js');

const publicEmoji={
    modelProfileLink:text.kissEmoji
}

const privateEmoji={
    tokensLink:text.tokenEmoji
}

const links={
    //dynamic
    modelsLink:'/models/',
    modelsOnlineLink:'/models/online/',
    modelsStreamingLink:'/models/streaming/',
    registerLink:'/register/',
    broadcastLink:'/private/model/broadcast/',
    loginLink:'/login/',

    //domain
    // domainName:'scentedpansycams.com',
    domainName: 'localhost',
    //emails
    supportEmail:'support@scentedpansycams.com',
    verifyLink:'/verify/',

    //content
    profileImgsLink:'/content/profileImg/',

    //IP real
    //IPAddress:'see below'
    //IP prod
    // IPAddress:'scentedpansycams.com'
    IPAddress: 'localhost'
};

for(let key in publicEmoji){
    const pre='/';
    const post='/';
    setEmojiLink(pre,post,publicEmoji,key);
}

for(let key in privateEmoji){
    const pre='/private/';
    const post='/';
    setEmojiLink(pre,post,privateEmoji,key);
}

function setEmojiLink(pre,post,emoji,key){
    links[key]=`${pre}${
        encodeURIComponent(emoji[key])
    }${post}`;
    links[`${key}Emoji`]=`${pre}${emoji[key]}${post}`;
}

//wrap to allow scope to die
// (
//     function(){
//         var interfaces = os.networkInterfaces();
//         var keys=Object.keys(interfaces);
//         let IP='';
//         for( let data of interfaces[
//                 keys[1]
//             ]
//         ){
//             if(data.family!=='IPv4'){
//                 continue;
//             }
//
//             IP=data.address;
//             break;
//         }
//
//         //domainName for testing
//         links.domainName=
//         links.IPAddress=IP;
//     }
// )();

module.exports=links;
