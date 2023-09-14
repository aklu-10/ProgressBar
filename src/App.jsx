import React, { useState } from 'react'

const App = () => {

  const [progress, setProgress] = useState(0);

  const handleDownload = async () =>
  {
    let response = await fetch("/vid.mp4");

    if(!response.body) return;

    const totalLength = parseInt(response.headers.get("Content-Length"));
    const reader = response.body.getReader();

    let chunks = [];
    let receivedLength = 0;

    while(true)
    {
      let {value, done} = await reader.read();

      if(done) break;

      receivedLength+=value.length;
      let step =  ( receivedLength / totalLength ) * 100;
      setProgress(parseInt(step.toFixed()));
      chunks.push(value);
    }

    let blob = new Blob(chunks);
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "video.mp4";

    const handleOnDownload = () =>
    {
      setTimeout(()=>
      {
        URL.revokeObjectURL(url);
        a.removeEventListener('click', handleOnDownload);
      },150)
    }

    a.addEventListener('click', handleOnDownload, false);

    a.click();

  }

  return (

    <div style={{display:'flex', flexDirection:'column', justifyContent:'center' ,alignItems:'flex-start', padding:'10px'}}>

      <video src='./vid.mp4' width={500} controls></video>

      <p>Progress - </p>

      <div style={{position:'relative', width: progress+'%', height:'40px', overflow:'hidden'}}>
        <div style={{position:'absolute', background:'rgba(0,220,0,1)', textAlign:'center',color:'white', padding:'10px', width:'100%', left:0}}>{progress!=0 ? progress+' %' : 'progress will be shown here' }</div>
      </div>

      <button style={{padding:'10px 20px', marginTop:'10px', background:'rgba(0,0,200,.7)', color:'white', border:'none'}}onClick={handleDownload}>Download</button>

    <p>Note - <em>Please throttle your network speed to see the progress properly  </em></p>

    </div>
  )
}

export default App