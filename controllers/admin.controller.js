const {Session,Sport,Trainer,Train,sequelize} = require('../database/models');
const {Op,fn,col,QueryTypes} = require('sequelize');
const path = require('path');
const adminViews = "admin"+path.sep;

const dashboard = async(req,res) =>{
    console.log(req.signedCookies['token']);
    console.log('nice sign in');
    // const trains = await Train.findAll(
    //     {attributes: { exclude: ['trainerId','sportId','createdAt','updatedAt'] },include:[
    //         {model:Trainer,attributes:['name']},
    //         {model:Sport,attributes:["name"]}
    //     ]}
    // );
    // const trainers = await Trainer.findAll(
    //     {attributes: { exclude: ['trainerId','sportId','createdAt','updatedAt'] },include:[
    //         {model:Trainer,attributes:['name']},
    //         {model:Sport,attributes:["name"]}
    //     ]}
    // );
    // console.log(JSON.stringify(trains));
    let sessions = null;
    let trainers = null;
    try{
       sessions = await sequelize.query('SELECT trainers.name as trainer ,sports.name as sport ,t1.users,t1.name,t1.level from (SELECT t1.trainerId ,t1.sportId,t1.users,trains.name,trains.level from (SELECT `trainerId`, `sportId`, COUNT(`userId`) AS `users` FROM `sessions` AS `sessions` GROUP BY `trainerId`, `sportId`) as t1 INNER join trains on t1.trainerId = trains.trainerId AND t1.sportId = trains.sportId) as t1 inner JOIN trainers on t1.trainerId = trainers.id INNER JOIN sports on t1.sportId = sports.id order by t1.users DESC',{raw:true,type:QueryTypes.SELECT});
       trainers = await sequelize.query("select trainers.name,t1.sessions,t1.subs,t1.rating from (select t1.trainerId,sessions,subs,AVG(rating) as rating from (select t1.trainerId,sessions,COUNT(t1.trainerId) subs from (select trainerId,count(*) as sessions from trains group by trainerId ) as t1 left join sessions on t1.trainerId = sessions.trainerId GROUP by t1.trainerId) as t1 left join trainerreviews on t1.trainerId = trainerreviews.trainerId GROUP by (t1.trainerId)) as t1 left JOIN trainers on t1.trainerId = trainers.id",{raw:true,type:QueryTypes.SELECT});
       console.log(trainers);
    }
    catch(e){
        console.log(e);
    }
    res.render(adminViews+'panel',{sessions,trainers,layout:false,helpers:{
        drawRating:function(val){
            val = Math.floor(val);
            let str ='<div>';
            for(let i =  0; i<val; i++)
               str+= "<span class ='fa fa-star checked'></span>";
            for(let i = 0; i <5-val;i++)
               str+= "<span class = 'fa fa-star' style ='color:black'></span>";
            str+='</div>';
            return str;
        }
    }});
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

