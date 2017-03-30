const User=require('../../entities/User.js');

const user=new User;

setTimeout(
    function(){
        user.load(
            'squonk',
            function(err,user){
                console.log('loaded squonk ',err,user);
                updateSquonk();
            }
        );
    },
    100
);

function updateSquonk(){
    user.firstName='Charles';
    user.update(
        function(err,user){
            console.log('updated squonk ',err,user);
        }
    );
}
