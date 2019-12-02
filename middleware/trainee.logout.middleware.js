module.exports = async(req,res,next)=>{
    res.cookie('user',null,{expires:new Date(Date.now())});
    next();
}