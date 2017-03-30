'use strict';

{{initWindowJS}}

(
    function(){
        app.initStyles      =initStyles;
        app.insertRules     =insertRules;
        app.connectedUI     =connectedUI;
        app.disconnectedUI  =disconnectedUI;
        app.authenticatedUI =authenticatedUI;
        app.showModelOfferUI=showModelOfferUI;
        app.hideModelOfferUI=hideModelOfferUI;
        app.showModelTipUI  =showModelTipUI;
        app.hideModelTipUI  =hideModelTipUI;
        app.compactUI       =compactUI;
        app.modelOnlineUI   =modelOnlineUI;
        app.modelOfflineUI  =modelOfflineUI;
        app.chatUI          =chatUI;
        app.chatUsersUI     =chatUsersUI;
        app.privateUI       =privateUI;

        app.JSStyles = document.createElement('style');

        function initStyles(){
            document.head.appendChild(app.JSStyles);
            app.JSS=app.JSStyles.sheet;
            app.JSS.add=insertRules;
            app.JSS.remove=deleteRules;
        }

        function insertRules(){
            for(var i in arguments){
                app.JSS.insertRule(
                    arguments[i],
                    app.JSS.cssRules.length
                );
            }
        }

        function deleteRules(){
            for(var i in arguments){
                var selector=arguments[i];
                deleteRule(selector);
            }
        }

        function deleteRule(selector){
            selector=selector.replace(/[\'\"]/g,'');
            for(var i=app.JSS.cssRules.length-1; i>-1; i--){
                if(selector!==app.JSS.cssRules[i].selectorText.replace(/[\'\"]/g,'')){
                    continue;
                }

                app.JSS.deleteRule(i);
            }
        }

        function authenticatedUI(){
            app.JSS.remove(
                `[data-display='{{notModel}}']`,
                `[data-user='{{notModel}}']`,
                `[data-display='{{isModel}}']`,
                `[data-user='{{isModel}}']`,
                `[data-display='{{notLoggedIn}}']`,
                `[data-display='{{isLoggedIn}}']`
            );

            app.JSS.add(
                `
                    [data-display='{{notLoggedIn}}']{
                        display:none!important;
                    }
                `,
                `
                    [data-display='{{isLoggedIn}}']{
                        display:flex!important;
                    }
                `
            );

            if(app.camUser.isModel){
                app.JSS.add(
                    `
                        [data-display='{{isModel}}']{
                            display:flex!important;
                        }
                    `,
                    `
                        [data-user='{{isModel}}']{
                            display:flex!important;
                        }
                    `
                );
            }else{
                app.JSS.add(
                    `
                        [data-display='{{notModel}}']{
                            display:flex!important;
                        }
                    `,
                    `
                        [data-user='{{notModel}}']{
                            display:flex!important;
                        }
                    `
                );
            }
        }

        function connectedUI(){
            if(!app.JSS){
                setTimeout(
                    connectedUI,
                    2
                );
                return;
            }

            app.JSS.remove(
                `[data-display='{{notConnectedToServer}}']`,
                `[data-display='{{isConnectedToServer}}']`
            );
            app.JSS.add(
                `
                    [data-display='{{notConnectedToServer}}']{
                        display:none;
                    }
                `
            );
        }

        function disconnectedUI(){
            if(!app.JSS){
                setTimeout(
                    disconnectedUI,
                    2
                );
                return;
            }
            app.JSS.remove(
                `[data-display='{{notConnectedToServer}}']`,
                `[data-display='{{isConnectedToServer}}']`
            );
            app.JSS.add(
                `
                    [data-display='{{notConnectedToServer}}']{
                        display:block;
                    }
                `
            );
        }

        function modelOnlineUI(){
            modelOfflineUI();
            app.JSS.add(
                `
                    [data-display='{{modelOnline}}']{
                        display:block!important;
                    }
                `,
                `
                    .modelInfo .profileContents{
                        display:none;
                    }
                `
            );
        }

        function modelOfflineUI(){
            app.JSS.remove(
                `.modelInfo .profileContents`,
                `[data-display='{{modelOnline}}']`
            );
        }

        function showModelOfferUI(){
            hideModelOfferUI();
            app.JSS.add(
                `
                    dialog.modelOffer{
                        display:flex;
                    }
                `
            );
        }

        function hideModelOfferUI(){
            app.JSS.remove('dialog.modelOffer');
        }

        function showModelTipUI(){
            hideModelTipUI();
            app.JSS.add(
                `
                    dialog.tipModel{
                        display:flex;
                    }
                `
            );
        }

        function hideModelTipUI(){
            app.JSS.remove('dialog.tipModel');
        }

        function compactUI(){
            app.JSS.add(
                `
                    .siteTop{
                        height:0px!important;
                    }
                `
            );
        }

        function chatUsersUI(){
            chatUI();
            app.JSS.add(
                `
                    .chat .log{
                        display:none;
                    }
                `,
                `
                    .chat .users{
                        display:flex!important;
                    }
                `
            );
        }

        function chatUI(){
            app.JSS.remove(
                `.chat .log`,
                `.chat .users`
            );
        }

        function privateUI(){
            app.JSS.add(
                `
                    header{
                        background-color:rgba(20, 160, 80, 0.95);
                    }
                `
            );
        }
    }
)();
