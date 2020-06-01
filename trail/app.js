const express=require('express');
const app=express();
const passport=require('passport');
const mongoose=require('mongoose');
const socket=require('socket.io');  
const passportSetup = require('./config/passport-setup');
const flash=require('connect-flash');
const session=require('express-session');
const auth=require('./config/auth');
const Chat=require('./models/chat');
require('./config/passport-setup-local')(passport);

mongoose.connect('mongodb+srv://root:9755@cluster0-n1q9f.mongodb.net/test?retryWrites=true&w=majority',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set('view engine','ejs');

app.use(express.urlencoded({extended:false}));

app.use(express.static('public'))

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}))

app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

app.use((req,res,next)=>{
  res.locals.success_msg=req.flash('success_msg');
  res.locals.error =req.flash('error');
  res.locals.chat=req.user;
  next();
})

app.use('/auth',require('./routes/auth-routes'));

app.use('/auth',require('./routes/user-routes'));

app.get('/chat',auth.authCheck,(req,res)=>{
  res.sendFile(__dirname + '/public/assets/index.html');
});

const server=app.listen(4000,function(){
  console.log('running on port number 4000');
});

const io=socket(server);

io.on('connection',(socket)=>{
  console.log('connection made');
  Chat.find().limit(100).sort({id:1}).then((data)=>{
    socket.emit('output',data);
  })
  socket.on('chat',function(message){
     const chat=new Chat({
       handler : message.name,
       message : message.message
     })

     chat.save().then((data)=>{
       console.log(data);
       io.sockets.emit('chat',data);
     })
  });
})