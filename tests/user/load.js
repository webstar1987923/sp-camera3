const User=require('../../entities/User.js');

const user=new User;

setTimeout(
    function(){
        user.load(
            'squonk',
            function(err,user){
                console.log('complete ',err,user);
            }
        );
    },
    100
);
