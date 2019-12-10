module.exports = async (req,res,next)=>
{
   console.log('logged out succesfully');
   res.cookie('user',null,{expires:new Date(Date.now())});
   res.redirect("/trainee");
}