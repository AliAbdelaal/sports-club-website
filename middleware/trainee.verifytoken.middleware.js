const {User} = require('../database/models/users');
const jwt = require('jsonwebtoken');
const config = require('../config/server');

module.exports = async (req,res,next)=>{
    if(req.signedCookies['token']){
       try{
         let decode = jwt.verify(req.signedCookies['token'],config.secret,{ignoreExpiration:true});
         const user = await User.findOne({where:{id:decode.id}});
         if(user){
            if(user.token == req.signedCookies['token'])
                next();
            else{
                next({"msg":"not your token!"})
            }    
         }
         else{
             next({"msg":"invalid credentatials"});
         }
       }
       catch(e){
         next({"msg":"cant connect to server at the moment"});
       }
    }
    else{
        next({"msg":"please signin once more"});
    }
}