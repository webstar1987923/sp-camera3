const UserList=require('../../entities/UserList.js');
const ModelCard=require('./ModelCard.js');
const links=require('../../config/links.js');

const userList=new UserList;

class ModelList{
    constructor(){

    }

    get all(){
        return populateHTML('models').join('')||none('models');
    }

    get online(){
        return populateHTML('streaming').join('')
            +populateHTML('onlineModels').join('')
            // ||none('onlineModels');
            ||populateHTML('models');
    }

    get streaming(){

        return populateHTML('streaming').join('')||none('streaming');
    }
}

function none(type){
    let state='Streaming';
    let nextState='Online';
    let href=links.modelsOnlineLink;

    switch(type){
        case 'streaming' :
            //defaults
            break;
        case 'onlineModels' :
            state='Online';
            nextState='All';
            href=links.modelsLink;
            break;
        case 'models' :
            state='';
            break;

    }

    return `
        <div class='noModels'>
            
                ${
                    (
                        function(){
                            if(state){
                                return `
                                    <a
                                        class="btn btn-large blue waves-effect"
                                        title='See ${nextState} Webcam Models Here.'
                                        href='${href}'
                                    >
                                        Checkout ${nextState.toLowerCase()} models
                                    </a>
                                    
                                `
                            }
                        }
                    )()
                }
        </div>
    `;
}

function populateHTML(type){
    const models=[];
    try{
        for(let model of userList[type]){
            models.push(
                new ModelCard(model).innerHTML
            );
        }
    }catch(err){

    }

    return models;
}

module.exports=ModelList;
