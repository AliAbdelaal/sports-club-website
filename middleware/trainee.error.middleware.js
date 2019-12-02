module.exports = (err,req,res,next)=>{
    console.log(err);
    res.json({"state":"error :("});
}