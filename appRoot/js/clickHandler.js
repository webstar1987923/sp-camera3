'use strict';

{{initWindowJS}}

(
    function(){

        window.on(
            'click',
            clickHandler
        );

        function clickHandler(e){
            if(!e.target.dataset.action){
                return;
            }
            if(e.target.localName=='form'){
                return;
            }
            switch(e.target.dataset.action){
                case 'api' :
                    api[e.target.dataset.method](e.target);
                    break;
                case 'app' :
                    app[e.target.dataset.method](e.target);
                    break;
                case 'go' :
                    navigate(e.target.dataset.href);
                    break;
                case 'webRTC' :
                    CamRTC[e.target.dataset.method](e.target);
                    break;
                case 'stripe' :
                    app.stripeRequest={
                        zipCode     : true,
                        amount      : Number(e.target.dataset.amount)*100,
                        description : `${e.target.dataset.tokens} tokens`,
                        panelLabel  : `${e.target.dataset.tokens} tokens for {{amount}}`,
                        label       : `Get my ${e.target.dataset.for}!`
                    }
                    app.buyTokens=e.target.dataset.tokens;
                    app.stripe.open(app.stripeRequest);
                    break;
                case 'chooseImg' :
                    document.querySelector(
                        `input[type="file"][data-group="${e.target.dataset.group}"]`
                    ).click();
                case '18+' :
                    setIsAdult();
                    break;
                case 'registerModel' :
                    var showModel=true;
                    // var signUp = document.querySelector('.signUp')
                    // signUp.innerHTML = signUp.innerHTML + '<img src="/img/loading.gif" />';

                case 'registerMember' :
                    var register=document.querySelector('.register');
                    var form=register.querySelector('form');
                    if(!showModel){
                        form.classList.remove('showModelForm');
                    }else{
                        form.classList.add('showModelForm');
                    }
                    register.classList.add('showForm');

                    break;
            }
        }

        function navigate(path){
            if(path!=='{{loginLink}}' && path!='{{registerLink}}'){
                localStorage.setItem('lastPage',path);
            }
            document.location.href=path;
        }

        function setIsAdult(){
            sessionStorage.setItem('18+', true);
            document.querySelector('.Modal18').style.display='none';
        }
    }
)();
