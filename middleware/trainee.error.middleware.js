module.exports = (err,req,res,next)=>{
    console.log(err);
    req.flash('errors',err);
    if(req.path == '/auth/register')
      res.redirect("/trainee/register");
    else
      res.redirect("/trainee/signin");
}