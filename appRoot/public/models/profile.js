(
    function(){
        var query=new URLSearchParams(document.location.href.split('?')[1]);
        if(!query.has('cam-model')){
            return document.location.href='/';
        }

        app.loadModelInterval=setInterval(
            function(){
                api.loadModel(
                    query.get('cam-model'),
                    populateProfile
                );
            }.bind(populateProfile),
            80
        );

        app.modelStateChange=function(){
            setTimeout(
                function(){
                    api.loadModel(
                        query.get('cam-model'),
                        populateProfile
                    );
                }.bind(populateProfile),
                100
            );
        };

        function populateProfile(model,updatedModel){
            app.currentModel=updatedModel||model;

            clearInterval(app.loadModelInterval);

            var template=document.querySelector('[data-template="modelProfile"]').innerHTML;
            for(var key in app.currentModel){
                var reg=new RegExp(`\\$\\{${key}\\}`,'g');
                template=template.replace(
                    reg,
                    app.currentModel[key]
                );
            }

            if(app.currentModel.streaming==true){
                app.modelOnlineUI();
            }else{
                app.modelOfflineUI();
            }

            document.querySelector('.modelProfile .profileContents').innerHTML=template;
            document.querySelector('dialog.modelOffer .modelID').innerText=app.currentModel.userID;

            if(CamRTC.webrtc){
                return;
            }
            CamRTC.initView();
            CamRTC.join(app.currentModel.userID);
        }
    }
)();
