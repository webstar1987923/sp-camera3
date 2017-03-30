const User=require('../../entities/User.js');

user=new User;
user.firstName='Billy';
user.lastName='Joe';
user.userID='squonk';
user.email='test@test.com';

user.private.password='test';

user.DOB=new Date().getTime();

user.country='US';
user.city='Nowheresville';
user.state='None';

user.gender='male';

console.log(user);

setTimeout(
    function(){
        user.create(
            function(err,user){
                if(!err){
                    throw('should have failed user is too young');
                }
                console.log('user too young ');
                ageUser();
            }
        );
    },
    100
);

function ageUser(){
    user.DOB=new Date('1984').getTime();
    user.create(
        function(err,user){
            console.log('user aged quickly ;)',err,user);
        }
    );
}
