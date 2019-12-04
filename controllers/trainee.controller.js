const {Session,Sport,Trainer,Train} = require('../database/models');
const {Op} = require('sequelize');
const path = require('path');
const traineeViews = "trainee"+path.sep;

const dashboard = async (req,res,next)=>{
      try{
      console.log("id",req.id);
      const userSessions = await Session.findAll({include:[{model:Sport,attributes:['name'],as:'sport'},{model:Trainer,as:'trainer',attributes:['name']}],where:{userId:req.id},raw:true});
      console.log(userSessions);
      res.render(traineeViews+'dashboard',{sessions:userSessions,layout:false});
     }
    catch(e){
        console.log(e);
        res.redirect('/trainee');
    }
}

const deleteSession = async (req,res,next)=>{
    const sessionId = req.params.id;
    try{
    const doc =  await Session.findOne({where:{id:sessionId,userId:req.id}});
    if(doc){
        await doc.destroy();
     }
    }
    catch(e){
        console.log(e);
    }                 
    res.redirect('/trainee/dashboard');
}

const catalog = async (req,res,next) =>{
    try{
    const sports = await Sport.findAll({attributes:["name"] ,raw:true});
    const trains = await Train.findAll({include:[{model:Trainer,attributes:['name']},{model:Sport,attributes:['name']}],attributes:['id','day','start_at','ends_at'],raw:true});
    console.log(trains);
    res.render(traineeViews+'catalog',{layout:false,sports,trains});  
}
    catch(e){
        res.redirect('/trainee/dashboard');
    }
}

const sport = async(req,res,next) =>{
    try{
    const train = await Train.findOne({where:{id:req.params.id},raw:true ,include:[{model:Trainer},{model:Sport}]});
    const sports = await Train.findAll({raw:true,where:{id:{[Op.ne]:train.id}},include:[{model:Sport,where:{name:train['sport.name']},attribute:['name']},{model:Trainer,attributes:['name']}],limit:3});
    console.log(sports);
    res.render(traineeViews+"sport",{layout:false,train,sports});
    }
    catch(e){
        res.redirect('/trainee/dashboard');
    }
}

const addSession = async(req,res,next) =>{
    const trainId = req.params.id;
    const userId  = req.id;
    try{
     const train =  await Train.findOne({raw:true,where:{id:trainId}});
     await Session.create({userId,trainerId:train.trainerId,sportId:train.sportId,start_at:train.start_at,ends_at:train.ends_at,day:train.day});
     res.redirect('/trainee/dashboard');
    }
    catch(e){
        res.redirect('/trainee/dashboard');
    }
}

module.exports = {
    deleteSession,
    dashboard,
    catalog,
    sport,
    addSession
};