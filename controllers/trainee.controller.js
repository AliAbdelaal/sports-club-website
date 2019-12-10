const {Session,Sport,Trainer,Train,TrainerReviews,User,sequelize} = require('../database/models');
const {Op,fn,col,QueryTypes} = require('sequelize');
const path = require('path');
const traineeViews = "trainee"+path.sep;

const dashboard = async (req,res,next)=>{
      try{
      console.log("id",req.id);
      const user = await User.findOne({raw:true,where:{id:req.id},attributes:['name']});
      const userSessions = await Session.findAll({include:[{model:Sport,attributes:['name'],as:'sport'},{model:Trainer,as:'trainer',attributes:['name']}],where:{userId:req.id},raw:true});
      console.log(userSessions);
      res.render(traineeViews+'dashboard',{sessions:userSessions,user,layout:false});
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
            'id',
            'name',
            'description',
            'experience',
            'previous_jobs'
        ]});
        const reviews = await Trainer.findAll({attributes:['users.name','users.trainerreviews.rating','users.trainerreviews.description','id'],raw:true,where:{id:req.params.id},include:[{model:User,attributes:['name','id'],through:{
            attributes:['description','rating'],
            where:{
                trainerId:req.params.id
            }
        }}]});
        const currUserReview = reviews.filter((curr) => curr['users.id'] == req.id && curr.id == req.params.id);
        const similarTrainers = await sequelize.query(`select t.id ,t.name,t.description ,AVG(rev.rating) as rating 
        from trainers as t left join trainerreviews as rev on t.id = rev.trainerId 
        where t.id != ${req.params.id}
        group by t.id , t.name 
        order by rating DESC 
        Limit 3`,{type:QueryTypes.SELECT,raw:true});
        console.log(similarTrainers);
        // console.log(reviews);
        // console.log(currUserReview);
        var rating = null;
        if(reviews.length)
        rating = Math.floor(reviews.reduce((prev,curr)=> prev+=curr.rating,0)/reviews.length);
        res.render( traineeViews+'trainer',{layout:false,trainer,rating,reviews,currUserReview,similarTrainers,helpers:{
            drawRating:function(val){
                let str ='<div>';
                for(let i =  0; i<val; i++)
                   str+= "<span class ='fa fa-star checked'></span>";
                for(let i = 0; i <5-val;i++)
                   str+= "<span class = 'fa fa-star' style ='color:black'></span>";
                str+='</div>';
                return str;
            },
            drawInputStars:function(val){
                let str ='<div>';
                for(let i = 0; i < val;i++)
                   str+= `<span id=${i} onclick='displayStars(${i})' class = 'fa fa-star input-star' style ='color:orange'></span>`;
                for(let i = val ; i <5;i++)
                   str+= `<span id=${i} onclick='displayStars(${i})' class = 'fa fa-star input-star' style ='color:black'></span>`;
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

const addReview = async(req,res,next)=>{
    try{    
    const review = await TrainerReviews.findOne({where:{
        trainerId:req.body.trainer,
        userId:req.id
    }});
     if(review)
     await review.update(req.body);
     else{
         const body = {
             userId:req.id,
             trainerId:req.body.trainer,
             rating:req.body.rating,
             description:req.body.description
         }
         await TrainerReviews.create(body);
     }
     res.redirect(`/trainee/trainer/${req.body.trainer}`);
    }
    catch(e){
        console.log(e);
        res.redirect("/trainee/dashboard");
    }
}
module.exports = {
    deleteSession,
    dashboard,
    catalog,
    sport,
    addSession,
    trainerView,
    addReview
};