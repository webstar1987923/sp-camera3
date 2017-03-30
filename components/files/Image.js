'use strict';

class ImageLoader  {
    constructor(config={}){
        const defaults={
            chooseWhat:'a File',
            buttonAction:'chooseImg',
            fileAction:'loadImg'
        };

        config=Object.assign({},defaults,config);

        const now=`${config.fileAction}${Math.random()*999999}${new Date().getTime()}${Math.random()*999999}`

        this.innerHTML=`
            <div>
                <input
                    type='file'
                    class='image-loader'
                    accept='image/*'
                    data-group='${now}'
                    data-action='${config.fileAction}'
                />
                <button
                    class="default"
                    data-group='${now}'
                    data-action='${config.buttonAction}'
                    type='button'
                >
                    Choose ${config.chooseWhat}
                </button>
                <img
                    data-group='${now}'
                    data-image-type='${config.fileAction}'
                    src='{{defaultImg}}'
                />
            </div>
        `;
    }
}

module.exports=ImageLoader;
