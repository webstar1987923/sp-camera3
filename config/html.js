const GenderList=require('../components/gender/GenderSelector.js');
const ImageInput=require('../components/files/Image.js');
const ModelList=require('../components/model/ModelList.js');

const Base64File=require('js-base64-file');
const links=require('./links.js');
const ports=require('./ports.js');
const dataset=require('./dataset.js');
const text=require('./text.js');

const base64File=new Base64File();

const modelList=new ModelList();

class Config{
    constructor(){
        this.genderList=genderList;
        this.defaultImg=defaultImg;
        this.modelsAll=modelList.all;
        this.modelsOnline=modelList.online;
        this.modelsStreaming=modelList.streaming;

        //image inputs
        this.imageInput=inputImage;
        this.profileImageInput=new ImageInput(
            {
                fileAction:'loadProfileImg',
                chooseWhat:'a Profile Pic'
            }
        ).innerHTML;
        this.imagePhotoIDInput=new ImageInput(
            {
                chooseWhat:'Your Photo ID',
                fileAction:'loadPhotoID'
            }
        ).innerHTML;
        this.imageModelFaceInput=new ImageInput(
            {
                chooseWhat:'Your Face Pic',
                fileAction:'loadFaceImg'
            }
        ).innerHTML;

        Object.assign(
            this,
            ports,
            links,
            dataset,
            text
        );
    }
}

const defaultImg=`data:image/png;base64,${
    base64File.loadSync(
        `${__dirname}/../appRoot/content/`,
        'default.png'
    )
}`;

const genderList=new GenderList().innerHTML;
const inputImage=new ImageInput().innerHTML;

module.exports=Config;
