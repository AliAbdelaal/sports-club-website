const jwt = require('jsonwebtoken');
const config = require('../config/server');
const path = require('path');
const adminViews = "admin"+path.sep;

module.exports = async(req,res,next)=>{
    let token = jwt.sign({id:req.user.id,email:req.user.email},config.secret);
    res.cookie('token',token,{signed:true,expires:new Date(Date.now()+(1000*60*60*24*10))});
    try{
        req.user.update({token});
        console.log('inserted token');
        // res.redirect("/admin/panel.html");
        res.render(adminViews+'panel',{layout:false,errors:null});
    }
    catch(e){
        next([{"msg":"cant sign in,try again later"}]);
    }
}