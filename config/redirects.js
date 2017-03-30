const links = require('./links.js');

const index='index.html';
const public='public';

const streaming='streaming.html';
const online='online.html';
const profile='profile.html';
const broadcast='broadcast.html';
const tokens='/tokens/';

const redirects={
    [`/`]                           :   `${public}${links.modelsLink}${online}`,

    //model related
    [`${links.modelsLink}`]         :   `${public}${links.modelsLink}`,
    [`${links.modelsOnlineLink}`]   :   `${public}${links.modelsLink}${online}`,
    [`${links.modelsStreamingLink}`]:   `${public}${links.modelsLink}${streaming}`,
    [`${links.modelProfileLink}`]   :   `${public}${links.modelsLink}${profile}`,
    [`${links.broadcastLink}`]      :   `${public}${links.modelsLink}${broadcast}`,

    //auth related
    [`${links.verifyLink}`]         :   `${public}${links.loginLink}`,
    [`${links.loginLink}`]          :   `${public}${links.loginLink}`,
    [`${links.registerLink}`]       :   `${public}${links.registerLink}`,
    [`${links.tokensLink}`]         :   `${public}${tokens}`
};

module.exports=redirects;
