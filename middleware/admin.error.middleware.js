module.exports = (err,req,res,next)=>{
    console.log(err);
    req.flash('errors',err);
    res.redirect("/admin/signin");
}