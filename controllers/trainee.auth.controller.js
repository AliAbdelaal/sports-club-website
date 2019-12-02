const {validationResult} = require('express-validator');
const {User} = require('../database/models/users');
const config = require('../config/server');
const crypto = require('crypto');

const registerController = async (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       next(errors.array());
    }
    else {
        let{name,email,password,age,gender} = req.body;
        try{
        const record = await User.create({name,email,password,age,gender});
        }
        catch (e){
           next(e);
        }
        res.json({state:'registerd'});
    }
 };

 const signinController = async (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       next(errors.array());
    }
    else{
       try{
          const user = await User.findOne({where:{email:req.body.email}});
          if(user){
             let hash  = crypto.createHmac('sha256',config.secret).update(req.body.password).digest('hex');
             if(hash != user.password){
                next({"msg":"wrong password"});
             }
             else{ 
               req.user = user;
               next();
             }
          }
          else{
             next({"msg":'wrong email'});
          }
       }
       catch(e){
          console.log(e);
          next({"msg":"cant connect to server,try again later"});
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