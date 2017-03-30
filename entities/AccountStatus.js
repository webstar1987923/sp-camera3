'use strict';

const accountStatus=[
    'pending',
    'active',
    'suspend',
    'disable'
];

class AccountStatus extends Array{
    constructor(){
        super();
        this.push.apply(this,accountStatus);

        for(let i in accountStatus){
            Object.defineProperty(
                this,
                accountStatus[i],
                {
                    enumerable:false,
                    writable:false,
                    value:Number(i)
                }
            );
        }

        Object.defineProperties(
            this,
            {
                isValid:{
                    enumerable:false,
                    writable:false,
                    value:isValid
                }
            }
        );
    }
};

function isValid(status){
    return this[status];
};

module.exports=AccountStatus;
