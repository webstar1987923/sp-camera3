(
    function(){
        //intercept clicks and allow bubble
        //to perform local and global event handlers
        document.querySelector('.chatTabs').addEventListener(
            'click',
            handleClicks
        );

        function handleClicks(e){

            var labels=[
                'users',
                'chat'
            ];

            var label=e.target.dataset.label;

            if(!labels.includes(label)){
                return;
            }

            switch(label){
                case 'chat' :
                    app.chatUI();
                    break;
                case 'users' :
                    app.chatUsersUI();
                    break;
            }
        }
    }
)();
