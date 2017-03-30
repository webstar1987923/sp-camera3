'use strict';

{{initWindowJS}}

(
    function(){

        window.on(
            'keyup',
            submitHandler
        );

        function submitHandler(e){
            console.log(e.target.pattern)
            if(!e.target.pattern){
                return;
            }

            e.target.setCustomValidation('');
        }
    }
)();
