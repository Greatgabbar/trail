module.exports={
  
  authCheck : (req,res,next)=>{
  if(req.isAuthenticated()){
    next();
  }else{
    req.flash('error','Please login to view the data');
    res.redirect('/auth/login');
  }
  },

  revauthCheck : (req,res,next)=>{
    if(req.isAuthenticated()){
      res.redirect('/auth/dashboard');
    }else{
      next();
    }
  }

}