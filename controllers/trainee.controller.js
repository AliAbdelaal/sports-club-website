const {Session,Sport,Trainer,Train,TrainerReviews,User} = require('../database/models');
const {Op,fn,col} = require('sequelize');
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
    const trains = await Train.findAll({include:[{model:Trainer,attributes:['name','id']},{model:Sport,attributes:['name']}],attributes:['id','day','start_at','ends_at'],raw:true});
    console.log(trains);
    res.render(traineeViews+'catalog',{layout:false,sports,trains});  
}
    catch(e){
        res.redirect('/trainee/dashboard');
    }
}

const sport = async(req,res,next) =>{
    try{
    const train = await Train.findOne({where:{id:req.params.id},raw:true ,include:[{model:Trainer,attributes:['id','name','experience','description','experience','previous_jobs']},{model:Sport}]});
    const sports = await Train.findAll({raw:true,where:{id:{[Op.ne]:train.id}},include:[{model:Sport,where:{name:train['sport.name']},attribute:['name']},{model:Trainer,attributes:['name']}],limit:3});
    const rating = await TrainerReviews.findOne({raw:true,where:{trainerId:train['trainer.id']},attributes:[[fn('AVG', col('rating')), 'rating']]});
    console.log(train);
    rating.rating = Math.floor(rating.rating);
    res.render(traineeViews+"sport",{layout:false,train,sports,rating,jobs:train['trainer.previous_jobs'],
    helpers:{
        drawRating:function(val){
            let str ='<div>';
            for(let i =  0; i<val; i++)
               str+= "<span class ='fa fa-star checked'></span>";
            for(let i = 0; i <5-val;i++)
               str+= "<span class = 'fa fa-star'></span>";
            str+='</div>';
            return str;
        }
    }
    });
    }
    catch(e){
        console.log('rendeering');
        console.log(e);
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

const trainerView = async (req,res,next) =>{
    if(req.params.id){
        try{
        const trainer = await Trainer.findOne({raw:true,where:{
           id :req.params.id
        },attributes:[
            'name',
            'description',
            'experience',
            'previous_jobs'
        ]});
        const reviews = await Trainer.findAll({attributes:['users.name','users.trainerreviews.rating','users.trainerreviews.description'],raw:true,where:{id:req.params.id},include:[{model:User,attributes:['name'],through:{
            attributes:['description','rating'],
            where:{
                trainerId:req.params.id
            }
        }}]});
        var rating = null;
        if(reviews.length)
        rating = Math.floor(reviews.reduce((prev,curr)=> prev+=curr.rating,0)/reviews.length);
        console.log(reviews);
        res.render( traineeViews+'trainer',{layout:false,trainer,rating,reviews,helpers:{
            drawRating:function(val){
                let str ='<div>';
                for(let i =  0; i<val; i++)
                   str+= "<span class ='fa fa-star checked'></span>";
                for(let i = 0; i <5-val;i++)
                   str+= "<span class = 'fa fa-star' style ='color:black'></span>";
                str+='</div>';
                return str;
            }
        }});
        }
        catch(e){
            console.log(e);
            res.redirect('/trainee/dashboard');       
        }
    }
    else
     res.redirect('/trainee/dashboard');
}

module.exports = {
    deleteSession,
    dashboard,
    catalog,
    sport,
    addSession,
    trainerView
};