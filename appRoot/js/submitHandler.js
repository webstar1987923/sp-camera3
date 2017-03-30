'use strict';

{{initWindowJS}}

(
    function(){

        window.on(
            'submit',
            submitHandler
        );

        function submitHandler(e){
            if(!e.target.dataset.action){
                return;
            }

            if(!e.target.checkValidity()){
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            if(!e.target.checkValidity()){
                return;
            }

            switch(e.target.dataset.action){
                case 'api' :
                    api[e.target.dataset.method](e.target);
                    break;
                case 'webRTC' :
                    CamRTC[e.target.dataset.method](e.target);
                    break;
            }
        }
    }
)();
