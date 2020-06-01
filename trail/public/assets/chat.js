const name=Qs.parse(location.search,{
  ignoreQueryPrefix : true
});
const username=name.name;

let socket=io.connect('http://localhost:4000/');

let message=document.getElementById('message'),
    handle =document.getElementById('handle'),
    output=document.getElementById('output'),
    outputp=document.getElementById('output-p'),
    send=document.getElementById('send'),
    chatWindow=document.querySelector('#chat-window');

handle.value=username;

message.addEventListener('keydown',()=>{
  socket.emit('typing',handle.value);
})

send.addEventListener('click',()=>{
  socket.emit('chat', {
    name : username,
    message : message.value
  });
  message.value='';
 
});

socket.on('output',(data)=>{
  if(username==='Rachit'){
    data.forEach((gg)=>{
      output.innerHTML+=`<p><strong>${gg.handler} : </strong>${gg.message}</p>`;
      chatWindow.scrollTop=chatWindow.scrollHeight;
    })
  }else{
   data.forEach((gg)=>{
     output.innerHTML+=`<p><strong>Anonymous : </strong>${gg.message}</p>`;
     chatWindow.scrollTop=chatWindow.scrollHeight;
   })
   
  }
})

socket.on('chat',(data)=>{
  if(username==='Rachit'){
    output.innerHTML+=`<p><strong>${data.handler} : </strong>${data.message}</p>`;
    chatWindow.scrollTop=chatWindow.scrollHeight;
  }else{
    output.innerHTML+=`<p><strong>Anonymous : </strong>${data.message}</p>`;
    chatWindow.scrollTop=chatWindow.scrollHeight;
  }
});



