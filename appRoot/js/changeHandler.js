'use strict';

{{initWindowJS}}

(
    function(){

        window.on(
            'change',
            changeHandler
        );

        function changeHandler(e){
            if(!e.target.dataset.action){
                return;
            }
            switch(e.target.dataset.action){
                case 'loadPhotoID' :
                    loadImg(e.target,1024);
                    break;
                case 'loadFaceImg' :
                    loadImg(e.target,512);
                    break;
                case 'loadProfileImg' :
                    loadImg(e.target,null,128);
                    break;
                case 'loadImg' :
                    loadImg(e.target,1280);
                    break;
            }
        }

        function loadImg(input,width,height){
            var files = input.files;

            if (!files || files.length<1) {
                return;
            }

            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var img = new Image();
            img.onload = function(){
                var absMaxSize=1280;
                var requestedHeight=height;

                if(!height&&width&&width<img.width){
                    height=Math.round(img.height*(width/img.width));
                }

                if(!width&&requestedHeight&&requestedHeight<img.height){
                    width=Math.round(img.width*(requestedHeight/img.height));
                }

                if(width>absMaxSize){
                    width=absMaxSize;
                }

                if(height>absMaxSize){
                    height=absMaxSize;
                }

                if(width>img.width){
                    width=img.width;
                }

                if(height>img.height){
                    height=img.height;
                }

                height=height||img.height;
                width=width||img.width;

                canvas.width = width;
                canvas.height = height;

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                document.querySelector(
                    `img[data-group="${input.dataset.group}"]`
                ).src = canvas.toDataURL(
                    'image/png'
                );
            };

            img.src = URL.createObjectURL(files[0]);
        }
    }
)();
