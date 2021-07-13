

const ws =io('/') 
const vidBox=document.getElementById('video-grid');
const totalusers = {};


var obj=new Peer(undefined,{
  path:'peerjs',
  host:'/',
  port:'443',
});

const myLocalVideo=document.createElement('video');

let myLocalVideoStream
myLocalVideo.autoplay = true;
myLocalVideo.playsInline = true;



navigator.mediaDevices.getUserMedia({
  video:true,
  audio:true
}).then(stream=>{

  myLocalVideoStream=stream;

    addingVidAudio(myLocalVideo,stream);

    obj.on('call', call => {
      console.log('fghj')
      call.answer(stream)
      const video = document.createElement('video')
      video.autoplay = true;
       video.playsInline = true;
       console.log('gvhb')
      call.on('stream', userVideoStream => {
        addingVidAudio  (video, userVideoStream)
      })
    })


    ws.on('user-connected',userId=>{
      setTimeout(function() {
        addingnewpeer(userId,stream);
    }, 1000)
    
     })
})


obj.on('open',id=>{

  ws.emit('join-room',ROOM_ID,id);
  console.log(ROOM_ID)
})



const addingnewpeer=(userId,stream)=>{
  
  const call = obj.call(userId, stream)
  const video = document.createElement('video')
  
  call.on('stream', userVideoStream => {
    addingVidAudio(video, userVideoStream)
   console.log('ghjkl')
   video.autoplay = true;
     video.playsInline = true;
     stream.playsInline = true;
  })
  call.on('close', () => {
    video.remove()
  })

  totalusers[userId] = call
}


const addingVidAudio=(video,stream)=>{
  video.srcObject=stream;
   video.addEventListener('loadmetadata',()=>{
     video.play();
     
   })
  vidBox.append(video);
}

let msg = $('input');

  $('html').keydown( (e)=> {
  
    if (e.which == 13 && msg.val().length !== 0) {
      console.log(msg.val())
      ws.emit('message', msg.val());
      
      msg.val('')
    }
  });
  ws.on('createMessage',message =>{
    $('ul').append(`<li class="everymsg"><b>user</b><br/>${message}</li>`)
   
  })

   ws.on('user-disconnected', userId => {
    if (totalusers[userId]) totalusers[userId].close()
    
  })

  const muteonandoff = () => {
    const x = myLocalVideoStream.getAudioTracks()[0].enabled;
    if (x) {
      myLocalVideoStream.getAudioTracks()[0].enabled = false;
      microphoneslash();
    } else {
      microphonenonslash();
      myLocalVideoStream.getAudioTracks()[0].enabled = true;
    }
  }


  const vidonandoff = () => {
    
    let y = myLocalVideoStream.getVideoTracks()[0].enabled;
    if (y) {
      myLocalVideoStream.getVideoTracks()[0].enabled = false;
      vidslash()
    } else {
      vidnonslash()
      myLocalVideoStream.getVideoTracks()[0].enabled = true;
    }
  }

  const showChat = () => {
    
    let z = document.getElementById('msgblock').style.display;
    if (z=="block") {
      document.getElementById('msgblock').style.display = "none";
      
    } else {
      document.getElementById('msgblock').style.display = "block";
      
    }
   
  }
 


  const microphonenonslash = () => {
    const nonslash = `
      <i class="fas fa-microphone"></i>
    `
    document.querySelector('.icon2').innerHTML = nonslash;
  }

  const microphoneslash = () => {
    const slash = `
      <i class="unmute fas fa-microphone-slash"></i>
    `
    document.querySelector('.icon2').innerHTML = slash;
  }
  
  const vidnonslash = () => {
    const nonslash = `
      <i class="fas fa-video"></i>
    `
    document.querySelector('.icon1').innerHTML = nonslash;
  }
  
  const vidslash = () => {
    const slash = `
    <i class="stop fas fa-video-slash"></i>
    `
    document.querySelector('.icon1').innerHTML = slash;
  }



  
  

  


  