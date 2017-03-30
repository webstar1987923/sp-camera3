'use strict';

const Range=require('range-class-js');

/**
 * @class Validator
 */
class Validator{

    /**
     * constructor
     * @method constructor
     * @return {void}
     */
    constructor() {
        this.requirement=requirement;
        this.unique=isUnique;
        this.exactMatch=exactMatch;

        this.number=isNumber;
        this.range=rangeCheck;

        this.array=isArray;
        this.string=isString;
        this.length=length;
        this.contains=isChild;

        this.object=isObject;

        this.oldEnough=isOldEnough;
        this.adult=isOldEnough.bind(this,18);
        this.canDrinkUS=isOldEnough.bind(this,21);
        this.canDrinkJP=isOldEnough.bind(this,20);
        this.canDrinkEU=isOldEnough.bind(this,16);
    }
}

function requirement(param){
    let valid=true;

    if(!param && param!==0 && param!==false){
        valid=false;
    }
    return valid;
}

function isChild(container,value){
    let valid=true;

    if(!this.requirement(value)){
        valid=false;
    }

    if(!this.array(container)){
        valid=false;
    }

    if(!container.includes(value)){
        valid=false;
    }

    return valid;
}


function isUnique(container,value){
    let valid=true;

    if(!this.requirement(value)){
        valid=false;
    }

    if(!this.array(container)){
        valid=false;
    }

    if(container.includes(value)){
        valid=false;
    }

    return valid;
}

function isNumber(value){
    let valid=true;

    if(!this.requirement(value)){
        valid=false;
    };

    if(typeof value !== 'number' || isNaN(value)){
        valid=false;
    }

    return valid;
}

function isArray(value){
    let valid=true;

    if(!this.requirement(value)){
        valid=false;
    }

    if(!Array.isArray(value)){
        valid=false;
    }

    return valid;
}

function isObject(value){
    let valid=true;

    if(!this.requirement(value)){
        valid=false;
    };

    if(typeof value !== 'object' || Array.isArray(value)){
        valid=false;
    }

    return valid;
}

function isString(value){
    let valid=true;

    if(!this.requirement(value)){
        valid=false;
    }

    if(typeof value !== 'string'){
        valid=false;
    }

    return valid;
}

function length(expectedLength,value){
    let valid=true;

    if(!this.requirement(value)){
        valid=false;
    }

    if(value.length!==expectedLength){
        valid=false;
    }

    return valid;
}

function exactMatch(expectedValue,value){
    let valid=true;

    if(value!==expectedValue){
        valid=false;
    }

    return valid;
}

function rangeCheck(range,value){
    let valid=true;

    if(!this.requirement(range)){
        valid=false;
    }

    if(!(range instanceof Range)){
        valid=false;
    }

    if(!this.number(value)){
        valid=false;
    };

    if(!range.isValid(value)){
        valid=false;
    }

    return valid;
}

function isOldEnough(oldEnough=1,timestamp=this.DOB){
    const today = new Date();
    const birthDate = new Date(timestamp);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return(age>oldEnough-1);
}

module.exports=Validator;
