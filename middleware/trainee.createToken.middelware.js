const jwt = require('jsonwebtoken');
const config = require('../config/server');

module.exports = async(req,res,next)=>{
    console.log('hello');
    let token = jwt.sign({id:req.user.id,email:req.user.email},config.secret);
    res.cookie('token',token,{signed:true,expires:new Date(Date.now()+(1000*60*60*24*10))});
    try{
    req.user.update({token});
    console.log('inserted token');
    res.json({"state":"tmam"});
   }
   catch(e){
       next({"msg":"cant sign in,try again later"});
       console.log(e);
   }
}