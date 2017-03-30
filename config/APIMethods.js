const methods={
    success:'api.success',
    error:'api.error',

    login:'auth.login',
    checkAuthentication:'auth.check',
    rejected:'auth.rejected',
    logout:'auth.logout',

    register:'user.register',

    loadModel:'model.load',
    streaming:'set.streaming',

    buyTokens:'tokens.buy',
    startPrivate:'start.private',
    tip:'tip.model'
};

module.exports=methods;
