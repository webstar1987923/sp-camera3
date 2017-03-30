'use strict';

const Genders=require('../../entities/Genders.js');
const genders=new Genders;

class GenderSelector  {
    constructor(){
        this.innerHTML=`
            <select required data-type='gender'>
                ${this.getGenderOptions()}
            </select>
        `;
    }

    getGenderOptions(){
        let genderOptions='';
        for(let gender of genders){
            genderOptions=`
                ${genderOptions}
                <option value='${gender}'>
                    ${gender}
                </option>
            `
        }
        return genderOptions;
    }
}

module.exports=GenderSelector;
