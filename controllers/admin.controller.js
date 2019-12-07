const {Session,Sport,Trainer,Train} = require('../database/models');
const {Op} = require('sequelize');
const path = require('path');
const adminViews = "admin"+path.sep;

const dashboard = async(req,res) =>{
    console.log(req.signedCookies['token']);
    console.log('nice sign in');
    res.render(adminViews+'panel',{layout:false});
};

const createTrainer = async(req,res) =>{

    console.log("creating trainer")
    let{name,email,description,experience} = req.body;
    try{
        const record = await Trainer.create({name,email,description,experience});
    }
    catch (e){
        next([{"msg":"cant connect to server,try again later"}]);
    }
    res.render(adminViews+'panel',{layout:false});
};

const createTraining = async(req,res) =>{

    console.log("creating training")
    let{name,sportId,trainerId,level,day,start_at,ends_at,description,price} = req.body;
    try{
        const record = await Train.create({name,sportId,trainerId,level,day,start_at,ends_at,description,price});
    }
    catch (e){
        console.log(e);
        next([{"msg":"cant connect to server,try again later"}]);
    }
    res.render(adminViews+'panel',{layout:false});
};

module.exports = {dashboard,createTrainer,createTraining}

