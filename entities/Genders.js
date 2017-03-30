'use strict';

const genders=[
    'male',
    'female',
    'trans',
    'other'
];

class Genders extends Array{
    constructor(){
        super();
        this.push.apply(this,genders);

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

function isValid(gender){
    return this.includes(gender);
};

module.exports=Genders;
