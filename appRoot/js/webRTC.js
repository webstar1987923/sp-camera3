'use strict';

{{initWindowJS}}

(
    function(){
        function WebRTC(){
            Object.defineProperties(
                this,
                {
                    initBroadcast:{
                        enumerable:true,
                        writable:false,
                        value:initBroadcast.bind(this)
                    },
                    initView:{
                        enumerable:true,
                        writable:false,
                        value:initView.bind(this)
                    },
                    join:{
                        enumerable:true,
                        writable:false,
                        value:join.bind(this)
                    },
                    start:{
                        enumerable:true,
                        writable:false,
                        value:start.bind(this)
                    },
                    stop:{
                        enumerable:true,
                        writable:false,
                        value:stop.bind(this)
                    },
                    send:{
                        enumerable:true,
                        writable:false,
                        value:sendMessage
                    },
                    sentTip:{
                        enumerable:true,
                        writable:false,
                        value:sentTip
                    },
                    requestPrivate:{
                        enumerable:true,
                        writable:false,
                        value:requestPrivate
                    },
                    makePrivateOffer:{
                        enumerable:true,
                        writable:false,
                        value:makeOffer
                    },
                    tipModel:{
                        enumerable:true,
                        writable:false,
                        value:tip
                    },
                    startPrivate:{
                        enumerable:true,
                        writable:false,
                        value:startPrivate
                    }
                }
            )
            return this;
        }

        function initBroadcast(){
            app.checkSecure();
            Object.defineProperty(
                this,
                'webrtc',
                {
                    enumerable:false,
                    writable:false,
                    value:new SimpleWebRTC(
                        {
                            localVideoEl        : 'userVideo',
                            remoteVideosEl      : '',
                            autoRequestMedia    : true,
                            debug               : false,
                            url                 : `${document.location.host}:{{WEBRTC}}`,
                            nick                : `Model ${app.camUser.userID}`,
                            localVideo          : {
                                autoplay: true,
                                mirror: true,
                                muted: true
                            }
                        }
                    )
                }
            );

            listenForConnections.bind(this)();
            listenForChat.bind(this)();
        }

        function initView(){
            app.checkSecure();
            var nick=((app.camUser)? app.camUser.userID:'');
            if(!nick){
                nick=`guest ${new Date().getTime()}`
            }

            Object.defineProperty(
                this,
                'webrtc',
                {
                    enumerable:false,
                    writable:false,
                    value:new SimpleWebRTC(
                        {
                            localVideoEl        : '',
                            remoteVideosEl      : 'modelVideo',
                            autoRequestMedia    : false,
                            debug               : false,
                            url                 : `${document.location.host}:{{WEBRTC}}`,
                            nick                : nick
                        }
                    )
                }
            );

            listenForModelConnection.bind(this)();
            listenForChat.bind(this)();
        }

        function listenForChat(){
            //see all
            //this.webrtc.on('*',console.log);
            this.webrtc.on(
                'channelMessage',
                function(peer, label, data) {
                    //public

                    switch(label){
                        case 'text' :
                            return appendMessage(data.payload,peer.nick);
                            break;
                        case 'tip' :
                            tipCoinSound(data.payload);
                            return appendMessage(data.payload,peer.nick,true);
                            break;
                    }


                    if(data.type!==app.camUser.userID||data.type!==data.payload.for){
                        return;
                    }

                    //private

                    switch(label){
                        case 'privateOffer' :
                            appendPrivateOffer(data.payload,peer.nick);
                            break;
                        case 'joinPrivate':
                            app.privateRateIWillPay={
                                min:data.payload.min,
                                modelID:data.payload.with
                            }
                            payModel(data.payload.flatRate);
                            CamRTC.join(data.payload.room);
                            app.privateUI();
                            break;
                        case 'private' :
                            appendMessage(
                                data.payload,
                                `${peer.nick} *private*`
                            );
                            break;
                    }
                }
            );

            this.webrtc.on(
                'turnservers',
                function(peer, label, data) {
                    //console.log(arguments);
                }
            );

            this.webrtc.on(
                'stunservers',
                function(peer, label, data) {
                    //console.log(arguments);
                }
            );
        }

        function appendPrivateOffer(payload,nick){
            var message=document.createElement('li');
            message.innerHTML=`
                <figure>
                    <img src='{{profileImgsLink}}${payload.userID}.png' />
                    <figcaption>
                        <h4>${payload.userID}</h4>
                        Offered ${payload.perMin||0} tokens per min and ${payload.flatRate||0} tokens for a private chat!
                        <p>
                            ${payload.userID} says : <span class='message'></span>
                        </p>
                    </figcaption>
                </figure>
                <button
                    data-display='{{isModel}}'
                    data-action='webRTC'
                    data-method='startPrivate'
                    data-room='${payload.userID+new Date().getTime()+payload.for}'
                    data-for='${payload.for}'
                    data-with='${payload.userID}'
                    data-flat='${payload.flatRate}'
                    data-min='${payload.perMin}'
                >
                    Go Private!
                </button>
            `;
            message.querySelector('.message').innerText=payload.message;

            var log=document.querySelector('.chat .log');
            log.appendChild(message);

            message.scrollIntoView(
                {
                    block: "end",
                    behavior: "smooth"
                }
            );
        }

        function startPrivate(target){
            app.privateRate={
                flatRate:target.dataset.flat,
                min:target.dataset.min,
                for:target.dataset.with,
                with:target.dataset.for,
                room:target.dataset.room
            }

            this.webrtc.sendDirectlyToAll(
                'joinPrivate',
                target.dataset.with,
                app.privateRate
            );

            document.querySelector('button.stop').click();

            app.privateUI();

            setTimeout(
                function(){
                    document.querySelector('button.start').click();
                },
                500
            );
        }

        function appendMessage(text,nick,tip){
            var message=document.createElement('li');
            message.innerHTML=`<span class='name'>${nick} :</span><span class='message'></span>`;
            message.querySelector('.message').innerText=text;
            if(tip){
                message.innerHTML=`<span class='messageTip'>${nick} tipped ${text}`;
            }
            var log=document.querySelector('.chat .log');
            log.appendChild(message);

            if(!isInViewport(log)){
                return;
            }

            message.scrollIntoView(
                {
                    block: "end",
                    behavior: "smooth"
                }
            );

            var log=document.querySelector('.chat .log');
            var maxLength=150;
            var messages=log.querySelectorAll('li');

            if(messages.length<maxLength+1){
                return;
            }

            for(var i=0; i<messages.length-maxLength;i++){
                log.removeChild(messages[i])
            }
        }

        function listenForConnections(){
            this.webrtc.on(
                'videoAdded',
                function (video, peer) {
                    var clients = document.querySelector('.clientCams');
                    if (!clients) {
                        return;
                    }

                    clients.appendChild(video);

                    video.oncontextmenu = function () {
                        return false;
                    };
                }
            );

            this.webrtc.on(
                'videoRemoved',
                function (video, peer) {
                    var clients = document.querySelector('.clientCams');
                    if (!clients) {
                        return;
                    }

                    clients.removeChild(video);
                }
            );

            this.webrtc.on(
                'leftRoom',
                function (video, peer) {
                    api.stopStreaming();
                    var userCount=document.querySelector('#chatMemberCount');
                    userCount.dataset.count=0;
                    userCount.innerText=userCount.dataset.count;

                    app.room={
                        users:{}
                    };
                    var users=document.querySelector(`.chat .users`);
                    users.innerHTML='';
                    appendMessage('you have left the room','{{domainName}}');
                }
            );

            this.webrtc.on(
                'createdPeer',
                addPeer
            );

            this.webrtc.on(
                'peerStreamRemoved',
                removePeer
            );
        }

        function listenForModelConnection(){
            this.webrtc.on(
                'videoAdded',
                function (video, peer) {
                    var models = document.querySelector('.modelCams');
                    video.classList.add('modelCam');
                    if (!models) {
                        return;
                    }

                    models.appendChild(video);
                    app.modelStateChange();

                    video.oncontextmenu = function () {
                        return false;
                    };
                }
            );

            this.webrtc.on(
                'videoRemoved',
                function (video, peer) {
                    var models = document.querySelector('.modelCams');
                    if (!models) {
                        return;
                    }

                    app.modelStateChange();
                    models.removeChild(video);
                }
            );

            this.webrtc.on(
                'leftRoom',
                function (video, peer) {
                    api.stopStreaming();
                    var log=document.querySelector('.chat .log');
                    var users=document.querySelector('.chat .users');
                    log.innerHTML='';
                    users.innerHTML='';
                    appendMessage('you have left the room','{{domainName}}');
                }
            );

            this.webrtc.on(
                'createdPeer',
                addPeer
            );

            this.webrtc.on(
                'peerStreamRemoved',
                removePeer
            );
        }

        function addPeer(peer){
            if(!app.room){
                app.room={
                    users:{}
                };
            }

            setTimeout(
                appendUser.bind(this,peer),
                500
            );
        }

        function removePeer(peer){
            var userCount=document.querySelector('#chatMemberCount');
            userCount.dataset.count=Number(userCount.dataset.count)-1;
            userCount.innerText=userCount.dataset.count;

            if(!app.room){
                app.room={
                    users:{}
                };
            }

            delete app.room.users[peer.nick];
            var users=document.querySelector(`.chat .users`);
            var user=users.querySelector(`[data-user='${peer.nick}']`);
            if(!user){
                return;
            }

            users.removeChild(user);
            appendMessage('left',peer.nick);
            if(app.currentModel&&peer.nick==`Model ${app.currentModel.userID}`){
                clearInterval(app.payModelTimer);
            }
        }

        function appendUser(peer){
            if(!peer.nick){
                return;
            }

            var userCount=document.querySelector('#chatMemberCount');
            userCount.dataset.count=Number(userCount.dataset.count)+1;
            userCount.innerText=userCount.dataset.count;

            app.room.users[peer.nick]=peer;
            var users=document.querySelector('.chat .users');

            var user=document.createElement('li');
            user.dataset.user=peer.nick;

            var link=document.createElement('a');
            var modelLink=peer.nick.split('Model ')[1];
            link.href=`{{modelProfileLink}}?cam-model=${modelLink||peer.nick}`;
            link.innerText=peer.nick;

            user.appendChild(link);
            users.appendChild(user);

            appendMessage('joined',peer.nick);

            if(!app.privateRateIWillPay){
                return;
            }

            if(peer.nick.replace('Model ','')!==app.privateRateIWillPay.modelID){
                return;
            }

            clearInterval(app.payModelTimer);

            app.payModelTimer=setInterval(
                payModel,
                60000
            );
        }

        function payModel(tokens){
            if(!tokens){
                tokens=app.privateRateIWillPay.min;
            }

            tokens=Number(tokens);

            if(app.camUser.tokens<tokens){
                tokens=app.camUser.tokens;
            }

            if(tokens==0 && app.camUser.tokens<1){
                var text='##### I am out of tokens! #####';
                CamRTC.webrtc.sendDirectlyToAll(
                    'text',
                    'text',
                    text
                );
                appendMessage(text,'you');
                return;
            }

            document.querySelector('#tipTokens').value=tokens;
            document.querySelector('.tipModel button').click();
        }

        function join(id){
            this.webrtc.joinRoom(id);
            if(app.camUser&&app.camUser.isModel){
                api.startStreaming();
            }
        };

        function start(){
            if(!app.privateRate){
                return this.join(app.camUser.userID);
            }

            this.join(app.privateRate.room);
        }

        function stop(){
            this.webrtc.leaveRoom();
            if(app.camUser&&app.camUser.isModel){
                api.stopStreaming();
            }
        }

        function sendMessage(form){
            var input=form.querySelector('input');
            var text=input.value;
            input.value='';

            if(!text){
                return;
            }

            this.webrtc.sendDirectlyToAll(
                'text',
                'text',
                text
            );

            if(app.camUser&&app.camUser.userID){
                appendMessage(text,app.camUser.userID);
                return;
            }

            appendMessage(text,'you');
        }

        function sentTip(tokens){
            this.webrtc.sendDirectlyToAll(
                'tip',
                'tip',
                tokens
            );

            appendMessage(tokens,app.camUser.userID,true);

            tipCoinSound(tokens);
        }

        function tipCoinSound(tokens){
            var soundCount=Math.ceil(tokens/10);
            var maxSoundCount=150;
            (soundCount>maxSoundCount)? soundCount=maxSoundCount:null;

            var vibes=tokens*10;

            for(var i=0;i<soundCount;i++){
                var delay=35*i;
                setTimeout(
                    playCoin,
                    delay
                );
            }

            window.navigator.vibrate(vibes);
        }

        function playCoin(){
            var audio=document.createElement('audio');
            audio.src='/sounds/coin.mp3';
            audio.play();
        }

        function login(){
            localStorage.setItem('lastPage',document.location.href);
            document.location.href='{{loginLink}}';
        }

        function requestPrivate(){
            if(!app.camUser){
                login();
                return;
            }

            if(!app.camUser.userID){
                login();
                return;
            }

            app.showModelOfferUI();
        }

        function tip(){
            if(!app.camUser){
                login();
                return;
            }

            if(!app.camUser.userID){
                login();
                return;
            }

            app.showModelTipUI();
        }

        function makeOffer(target){
            var perMin=Number(target.querySelector('[name="perMinOffer"]').value);
            var flatRate=Number(target.querySelector('[name="flatRateOffer"]').value);
            if(
                isNaN(perMin)
                ||isNaN(flatRate)
                ||perMin<0
                ||flatRate<0
                ||flatRate>app.camUser.tokens
                ||perMin>app.camUser.tokens
                ||perMin+flatRate==0
            ){
                alert('Come on... no shitty offers.');
                return;
            }
            var message=target.querySelector('textarea').value;
            var payload={
                userID:app.camUser.userID,
                for:app.currentModel.userID,
                perMin:perMin,
                flatRate:flatRate,
                message:message
            };

            app.hideModelOfferUI();

            this.webrtc.sendDirectlyToAll(
                'privateOffer',
                app.currentModel.userID,
                payload
            );

            appendPrivateOffer(payload,'you');
        }

        function isInViewport(element) {
            var rect = element.getBoundingClientRect();
            var html = document.documentElement;
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || html.clientHeight) &&
                rect.right <= (window.innerWidth || html.clientWidth)
            );
        }

        window.CamRTC=new WebRTC;
    }
)();
