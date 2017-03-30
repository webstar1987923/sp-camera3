const dataset=require('./dataset.js');
const text=require('./text.js');

class Config{
    constructor(){
        this.lightBlue='rgb(3,169,244)';
        this.darkBlue='rgb(2,119,189)';
        this.linkOnColor='rgb(250,250,250)';
        this.textOnColor='rgb(250,250,250)';
        this.defaultTextColor='white';
        this.invalidColor='rgba(255,220,200,.7)';

        //shadows
        this.shadowColor='rgba(0,0,0,.7)';
        this.faintGreenShadow='0 0 .1em rgb(200,255,210)';

        //transtions
        this.transitionTime='300ms';

        Object.assign(
            this,
            dataset,
            text
        );
    }
}

module.exports=Config;
