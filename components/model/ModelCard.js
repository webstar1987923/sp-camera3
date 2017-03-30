const links=require('../../config/links.js');
class ModelCard{
    constructor(model){
        this.innerHTML=`
            <figure
                class="modelItem"
                data-action='go'
                data-href='https://{{domainName}}{{modelProfileLink}}?cam-model=${model.userID}'
            >
                <img
                    alt='${model.userID} profile pic'
                    title='${model.gender} webcam model ${model.userID}'
                    src='${links.profileImgsLink}${model.profileImg}'
                />
                <div>
                    <em>${model.userID}</em>
                    
                </div>
            </figure>
        `
    }
}

module.exports=ModelCard;
