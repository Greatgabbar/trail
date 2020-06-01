const router=require('express').Router();
const bcrypt=require('bcrypt');
const User=require('../models/user');
const passport=require('passport');
const auth=require('../config/auth');



router.get('/login',auth.revauthCheck,(req,res)=>{
  res.render('login');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/auth/dashboard',
    failureRedirect: '/auth/login',
    failureFlash :true
  })(req, res, next);
});

router.get('/prof',(req,res)=>{
  res.render('profileUpdate');
});

router.post('/prof',(req,res)=>{
  const err=[];
  const {pass,re_pass} = req.body;
  if(pass!==re_pass){
    err.push('Password Doesn\'t Match');
  }
  if(pass.length <6){
    err.push('Password Should be 6 character long');
  }  
  if(err.length>0){
    res.render('profileUpdate',{
      pass,
      re_pass,
      err
    });
  }else{
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(pass, salt, function(err, hash) { 
          User.findOneAndUpdate({email : req.user.email},{$set:{pass : hash}},{upsert:true}).then((data)=>{
             console.log('data upadete :::' + data);
             res.redirect('/auth/dashboard');
          }) 
      });
  });
  }

})

router.get('/dashboard',auth.authCheck,(req,res)=>{
  res.render('dashboard',{user : req.user});
})

router.get('/logout',(req,res)=>{
  req.logOut();
  req.flash('success_msg','You are now successfully logout');
  res.redirect('/auth/login');
});

router.get('/signup',auth.revauthCheck,(req,res)=>{
  res.render('signup');
});

router.post('/signup',(req,res)=>{
  const {name,email,pass,re_pass} = req.body;
  const err=[];
  if(!pass || !name || !email || !re_pass){
    err.push('Please fill all the fields');
  }
  if(pass!==re_pass){
    err.push('Password Doesn\'t Match');
  }
  if(pass.length <6){
    err.push('Password Should be 6 character long');
  }
 
  if(err.length>0){
    res.render('signup',{
      name,
      email,
      pass,
      re_pass,
      err
    });
  }else{
    User.findOne({email : email}).then((user)=>{
      if(user){
        err.push('Email already registered');
        res.render('signup',{
          name,
          email,
          pass,
          re_pass,
          err
        });
      }else{
        const user=new User({
          name : name,
          email : email,
          pass :pass,
        });
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(pass, salt, function(err, hash) { 
              user.pass=hash;
              user.save().then((newUser)=>{
                req.flash('success_msg','You are succesfully registered');
                res.redirect('/auth/login');
              }).catch(err=>{
                console.log(err);
              }); 
          });
      });
           
      }
    });
  } 
});

module.exports = router;