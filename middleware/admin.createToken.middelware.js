const jwt = require('jsonwebtoken');
const config = require('../config/server');
const path = require('path');
const adminViews = "admin"+path.sep;
const {User} = require('../database/models');


module.exports = async(req,res,next)=>{
    let token = jwt.sign({id:req.user.id,email:req.user.email},config.secret);
    res.cookie('token',token,{signed:true,expires:new Date(Date.now()+(1000*60*60*24*10))});
    try{
        await req.user.update({token});
        console.log('inserted token');
        res.redirect("/admin/dashboard");
    }
    catch(e){
        next([{"msg":"cant sign in,try again later"}]);
    }
}