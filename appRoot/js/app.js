'use strict';

{{initWindowJS}}

(
    function(){
        window.on(
            'DOMContentLoaded',
            init
        );

        app.checkSecure=checkSecure;
        app.updateUser=updateUser;

        function init(){
            app.initStyles();
            check18();
            checkUser();
            //TODO : allow desktop notifications
        }

        function checkSecure(){
            if(window.location.protocol=='https:'){
                return;
            }

            document.location.href=document.location.href.replace(
                'http:',
                'https:'
            );
        }

        function check18(){
            if(sessionStorage.getItem('18+')=='true'){
                return;
            }

            //document.querySelector('.Modal18').style.display='block';
        }

        function checkUser(){
            var user=sessionStorage.getItem('user');
            var valid=true;

            try{
                user=JSON.parse(user);
            }catch(err){
                console.warn(err,user);
                //bad JSON or not set
                sessionStorage.removeItem('user');
                user={};
                valid=false;
            }

            app.camUser=Object.assign(
                {},
                user
            );

            initStripe();

            var login=document.querySelector('#login-username');

            if(!login){
                return;
            }

            login.value=localStorage.getItem('lastLoginUser')||'';
        }

        function updateUser(user,updateOnly){
            sessionStorage.setItem('user',JSON.stringify(user));
            app.camUser=user;

            var userInfo=document.querySelector('.siteTop .userInfo');

            var profileImg=userInfo.querySelector('img');
            profileImg.src=`{{profileImgsLink}}${app.camUser.profileImg}`;
            profileImg.title=app.camUser.userID;
            userInfo.querySelector('.userTokens').innerText=`${Number(app.camUser.tokens)||0} Tokens`;

            var tipOptions=document.querySelector('#tipTokens');
            var privateMaxPerMin=document.querySelector('[name="perMinOffer"]');
            var privateMaxFlat=document.querySelector('[name="flatRateOffer"]');

            if(tipOptions){
                tipTokens.max=app.camUser.tokens||0;
            }

            if(privateMaxPerMin){
                privateMaxPerMin.max=Math.floor(app.camUser.tokens/10);
            }

            if(privateMaxFlat){
                privateMaxFlat.max=app.camUser.tokens||0;
            }

            if(updateOnly){
                return;
            }
            app.authenticatedUI();
        }

        function initStripe(){
            if(!app.camUser){
                return;
            }

            if(!app.camUser.profileImg || !app.camUser.email){
                return;
            }

            if(!StripeCheckout){
                console.warn('StripeCheckout is not present : ',StripeCheckout);
                return;
            }

            app.purchaseRequest={
                key         : '{{stripePublic}}',
                locale      : 'auto',
                token       : api.stripe,
                image       : `{{profileImgsLink}}${app.camUser.profileImg}`,
                name        : '{{siteName}}',
                email       : app.camUser.email
            }

            app.stripe=StripeCheckout.configure(
                app.purchaseRequest
            );
        }
    }
)();
