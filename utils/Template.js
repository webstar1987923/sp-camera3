class Template{
    constructor(){
        this.fill=fillTemplate;
        this.templates={};
    }
}

function fillTemplate(template,string){
    for(let key in template){
        const reg=new RegExp(
            `\{\{${key}\}\}`,
            'g'
        );
        string=string.replace(reg,template[key]);
    }

    return string;
}

module.exports=Template;
