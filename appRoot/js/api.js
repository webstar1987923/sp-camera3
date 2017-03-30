'use strict';

{{initWindowJS}}

(
    function(){
        function API(){
            Object.defineProperties(
                this,
                {
                    events:{
                        enumerable:false,
                        writable:false,
                        value:new window.pubsub()
                    },
                    messageHandler:{
                        enumerable:false,
                        writable:false,
                        value:messageHandler.bind(this)
                    },
                    send:{
                        enumerable:false,
                        writable:false,
                        value:send
                    },
                    login:{
                        enumerable:true,
                        writable:false,
                        value:login
                    },
                    checkAuthentication:{
                        enumerable:true,
                        writable:false,
                        value:checkAuthentication
                    },
                    logout:{
                        enumerable:true,
                        writable:false,
                        value:logout
                    },
                    register:{
                        enumerable:true,
                        writable:false,
                        value:register
                    },
                    loadModel:{
                        enumerable:true,
                        writable:false,
                        value:loadModel
                    },
                    startStreaming:{
                        enumerable:true,
                        writable:false,
                        value:stream.bind(this,true)
                    },
                    stopStreaming:{
                        enumerable:true,
                        writable:false,
                        value:stream.bind(this,false)
                    },
                    stripe:{
                        enumerable:false,
                        writable:false,
                        value:stripe.bind(this)
                    },
                    tip:{
                        enumerable:false,
                        writable:false,
                        value:tip.bind(this)
                    }
                }
            );

            this.methods={{APIMethods}};

            this.events.on(
                this.methods.error,
                errorHandler.bind(this)
            );

            this.events.on(
                this.methods.rejected,
                reject
            );

            this.events.on(
                this.methods.login,
                loggedIn
            );

            this.events.on(
                this.methods.logout,
                loggedOut
            );

            this.events.on(
                this.methods.logout,
                loggedOut
            );

            this.events.on(
                this.methods.register,
                registered
            );

            this.events.on(
                this.methods.checkAuthentication,
                authenticated.bind(this)
            );

            this.events.on(
                this.methods.buyTokens,
                updateUser
            );

            this.events.on(
                this.methods.tip,
                showTip
            );

            initWS.bind(this)();
        };

        var loadedModelQueue={};

        function initWS(){
            this.ws=new WebSocket('wss://{{IPAddress}}:{{WSAPI}}');
            this.ws.onclose=initWSDealyed.bind(this);
            this.ws.onmessage=this.messageHandler;
            this.ws.onopen=wsOpened.bind(this);
        }

        function initWSDealyed(){
            var delay=Math.round(
                Math.random()*8000
            )+2000;

            app.disconnectedUI();
            setTimeout(
                initWS.bind(this),
                delay
            );
        }

        function wsOpened(){
            this.checkAuthentication();
            app.connectedUI();
        }

        function authenticated(user){
            clearInterval(app.broadcastMessage);
            app.updateUser(user);
            app.broadcastMessage=setInterval(
                checkAuthentication.bind(this),
                2673
            );
        }

        function updateUser(user){
            app.updateUser(user,true);
        }

        function registered(data){
            document.location.href='https://{{domainName}}{{modelsLink}}';
        }

        function loggedIn(user){
            var nextPage=sessionStorage.getItem('lastPage');
            if(user.userID!==sessionStorage.getItem('lastUser')){
                nextPage='https://{{domainName}}{{modelsLink}}';
            }

            sessionStorage.setItem(
                'user',
                JSON.stringify(user)
            );
            localStorage.setItem(
                'lastLoginUser',
                document.querySelector('#login-username').value
            );

            app.camUser=user;

            if(app.camUser.isModel){
                document.location.href='{{broadcastLink}}';
                return;
            }

            document.location.href=nextPage;
        }

        function reject(){
            var path=document.location.pathname;
            sessionStorage.clear();;
            localStorage.setItem('lastPage',document.location.href);

            if(path.indexOf('private')<0){
                document.location.href=path;
                return;
            }

            goLogin();
        }

        function loggedOut(data){
            sessionStorage.clear();
            reject();
        }

        function goHome(){
            document.location.href='/';
        };

        function goLogin(){
            document.location.href='https://{{domainName}}{{loginLink}}';
        };

        function messageHandler(e){
            var message=new Message;
            message.load(e.data);
            if(message.type==this.methods.success){
                message=message.data;
            }

            this.events.trigger(
                message.type,
                message.data
            );
        }

        function errorHandler(error){
            switch(error.type){
                //allow fall through list of handled errors
                case this.methods.rejected :
                case this.methods.logout :

                    //allow propagation
                    break;
                default :
                    var warning=document.querySelector('[data-display="{{appWarning}}"]');
                    var message=document.createElement('li');
                    message.innerHTML=`
                        <h4>${error.data.message}</h4>
                        <div data-display='{{appIsDev}}'>
                            ${error.data.message}
                            <br>
                            ${(error.data.raw)?JSON.stringify(error.data.raw):''}
                        </div>
                    `;
                    warning.appendChild(
                        message
                    );

                    setTimeout(
                        function(child){
                            this.removeChild(child);
                        }.bind(warning,message),
                        5000
                    );
                    return;
            }

            this.events.trigger(
                error.type,
                error.data
            );
        }

        function tip(){
            var tokens=Number(document.querySelector('#tipTokens').value);
            if(isNaN(tokens)||tokens<0){
                alert('Come on... no shitty tips.');
                return;
            }
            var message=new Message;
            message.type=this.methods.tip;
            message.data={
                user:app.camUser,
                model:app.latestModel,
                tokens:Number(tokens)
            };

            this.send(message.JSON);
        }

        function showTip(user){
            if(!user.userID){
                CamRTC.sentTip(user.tokens);
                return;
            }
            app.updateUser(user);
        }

        function login(){
            var username=document.querySelector('#login-username').value;
            var password=document.querySelector('#login-password').value;

            var message=new Message;
            message.type=this.methods.login;
            message.data={
                userID:username,
                password:password
            };

            this.send(message.JSON);
        }

        function stream(value){
            var now=new Date().getTime();
            if(!api.lastStreamingChange){
                this.lastStreamingChange=0;
            }
            if(
                app.camUser.streaming==value
                ||this.lastStreamingChange>now-100
            ){
                return;
            }

            this.lastStreamingChange=now;

            var message=new Message;
            message.type=this.methods.streaming;
            message.data={
                streaming:value
            };

            this.send(message.JSON);
        }

        function loadModel(id,callback){
            if(!this.ws.readyState==1){
                console.warn('disconnected from ws message added to queue');
                return;
            }

            var requestPending=false;
            if(!loadedModelQueue[id]){
                loadedModelQueue[id]=[];
            }else{
                requestPending=true;
            }

            loadedModelQueue[id].push(
                callback
            );

            if(requestPending){
                return;
            }

            this.events.on(
                this.methods.loadModel,
                loadedModel
            );

            var message=new Message;
            message.type=this.methods.loadModel;
            message.data={id:id};

            this.send(message.JSON);
        }

        function loadedModel(model){
            var modelList=loadedModelQueue[model.userID];
            if(!modelList){
                return;
            }

            for(var i in modelList){
                modelList[i](model);
            }

            modelList=null;

            app.latestModel=model;

            delete loadedModelQueue[model.userID];
        }

        function checkAuthentication(){
            var user=app.camUser;
            var isPrivate=(document.location.href.indexOf('private')>-1);
            if(!user||(user&&!user.token)){
                try{
                    app.camUser=user=JSON.parse(
                        sessionStorage.getItem('user')
                    );
                }catch(err){
                    (isPrivate)? goLogin():null;
                    return;
                }
            }

            if(!user){
                (isPrivate)? goLogin():null;
                return;
            }

            if(!user.token){
                (isPrivate)? goLogin():null;
                return;
            }

            var message=new Message;
            message.type=this.methods.checkAuthentication;
            message.data={
                userID:user.userID,
                token:user.token
            };

            this.send(message.JSON);
        }

        function logout(){
            if(!app.camUser){
                goLogin();
                return;
            }

            var message=new Message;
            message.type=this.methods.logout;
            message.data=app.camUser;

            this.send(message.JSON);
        }

        function register(form){
            var DOBElement=form.querySelector('#register-DOB');
            var emailElement=form.querySelector('#register-email');
            var passwordConfirm=form.querySelector('#register-passwordConfirm');
            var passwordElement=form.querySelector('#register-password');

            var username=form.querySelector('#register-username').value;
            var firstName=form.querySelector('#register-firstName').value;
            var lastName=form.querySelector('#register-lastName').value;
            var password=passwordElement.value;
            var email=emailElement.value;

            var DOB=new Date(
                DOBElement.value
            );
            var profileImg=form.querySelector('img[data-image-type="loadProfileImg"]').src;
            var gender=form.querySelector('select[data-type="gender"]').value;

            if (password!==passwordConfirm.value) {
                alert('passwords do not match.');
                return;
            }

            if (new Date().getFullYear()-DOB.getFullYear()<18) {
                alert('You must be at least 18 years old to register.');
                return;
            }

            var message=new Message;
            message.type=this.methods.register;
            message.data={
                userID:username,
                firstName:firstName,
                lastName:lastName,
                gender:gender,
                password:password,
                email:email,
                DOB:DOB.getTime(),
                profileImg:profileImg
            };

            if(form.classList.contains('showModelForm')){
                message.data.photoID=form.querySelector('img[data-image-type="loadPhotoID"]').src;
                message.data.facialPhoto=form.querySelector('img[data-image-type="loadFaceImg"]').src;
                message.data.referer=form.querySelector('#register-referer').value;
            }

            this.send(message.JSON);
        }

        function stripe(token,billing){
            //console.log(token,billing);
            const message=new Message;
            message.type=this.methods.buyTokens;
            app.purchaseRequest.responseBilling=billing;
            message.data={
                purchaseRequest:app.purchaseRequest,
                stripeRequest:app.stripeRequest,
                token:token,
                tokens:Number(app.buyTokens)
            };

            this.send(message.JSON);
        }

        function send(message){
            if(!this.ws.readyState==1){
                console.warn('disconnected from ws message added to queue');
                return;
            }

            var now=new Date().getTime();

            if(!this.nextRequestTimestamp){
                this.nextRequestTimestamp=0;
            }

            if(this.lastRequestTimestamp>now-250){
                if(this.nextRequestTimestamp>now){
                    this.nextRequestTimestamp+=200;
                }else{
                    this.nextRequestTimestamp=now+200
                }
            }

            this.lastRequestTimestamp=now;

            if(this.nextRequestTimestamp>now){
                setTimeout(
                    this.ws.send.bind(this.ws,message),
                    this.nextRequestTimestamp-now
                );
            }else{
                this.ws.send(
                    message
                );
            }
        }

        window.api=new API;
    }
)();
