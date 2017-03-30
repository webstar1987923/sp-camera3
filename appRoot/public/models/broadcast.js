(
    function(){
        window.on(
            'load',
            function(){
                if(app.camUser && app.camUser.isModel){
                    //app.compactUI();
                    return CamRTC.initBroadcast();
                }
                api.logout();
            }
        );

        //intercept clicks and allow bubble
        //to perform local and global event handlers
        document.querySelector('.broadcast').addEventListener(
            'click',
            handleClicks
        );

        function handleClicks(e){

            var start=e.target.classList.contains('start');
            var stop=e.target.classList.contains('stop');

            if(!start && !stop){
                return;
            }

            var broadcast=document.querySelector('.broadcast');

            if(start){
                broadcast.classList.add('streaming');
                return;
            }

            if(stop){
                broadcast.classList.remove('streaming');
                return;
            }
        }
    }
)();
