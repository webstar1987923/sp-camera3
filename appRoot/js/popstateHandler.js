'use strict';

{{initWindowJS}}

(
    function(){
        window.on(
            'popstate',
            popstateHandler
        );

        function popstateHandler(e){
            if(app.stripe){
                app.stripe.close();
            }

            //handle others here with case statement
        }
    }
)();
