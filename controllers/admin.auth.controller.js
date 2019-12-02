const {validationResult} = require('express-validator');
const {User} = require('../database/models/users');
const config = require('../config/server');
const crypto = require('crypto');
const path = require('path');
const traineeViews = "trainee"+path.sep;


const registerController = async (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       next(errors.array());
    }
    else {
        console.log(req.body);
        let{name,email,password1,age,gender} = req.body;
        try{
        const record = await User.create({name,email,password:password1,age,gender,super:1,token:null});
        }
        catch (e){
           next([{"msg":"cant connect to server,try again later"}]);
        }
       res.redirect("/");
    }
 };

 const signinController = async (req,res,next)=>{
    console.log(req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       next(errors.array());
    }
    else{
       try{
          const user = await User.findOne({where:{email:req.body.email,super:1}});
          if(user){
             let hash  = crypto.createHmac('sha256',config.secret).update(req.body.password).digest('hex');
             if(hash != user.password){
                next([{"msg":"wrong password"}]);
             }
             else{ 
               req.user = user;
               next();
             }
          }
          else{
             next([{"msg":'wrong email'}]);
          }
       }
       catch(e){
          next([{"msg":"cant connect to server,try again later"}]);
       }
    }
 }

 const logoutController = async (req,res,next)=>
 {
   res.json({"state":'logged out'});
 }
 module.exports={
     registerController,
     logoutController,
     signinController
 }