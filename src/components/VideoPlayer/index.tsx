import React, { useEffect, useRef, useState } from 'react';
import './styles.scss'
import { BiPause, BiPlay, BiFullscreen } from 'react-icons/bi';

interface CustomVideoProps {
  videoUrl: string | any;
}

const CustomVideo: React.FC<CustomVideoProps> = ({ videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  useEffect(()=>{
    if(currentTime === videoRef.current?.duration){
      setCurrentTime(0)
      setIsPlaying(false)
    }
  },[currentTime])
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  }
  };
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = parseFloat(e.target.value);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <div  style={{ height: '100%', width: '100%' }}>
      <div  style={{ height: '80%', width: '100%', position:'relative'}}>
      <video
        ref={videoRef}
        controls={false} 
        src={videoUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        style={{ height: '100%', width: '100%', background:'black' }}
      />
      <div className='fullScreen'>
      <BiFullscreen color='white'  onClick={toggleFullScreen} size={34} />
      </div>
        </div>
        <div  style={{ height: '20%', width: '100%', display:'flex', justifyContent:'center', marginTop:'5%' }}>
      <div className="bar">
            <button
                className="bar__progress"
                onClick={togglePlay}
            >
                <span
                    className="bar__progress__knob"
                    style={{ left:  `${(currentTime / (videoRef.current?.duration || 1)) * 100 - 3}%` }}
                >
                    {isPlaying ? <BiPause size={34} /> : <BiPlay size={34} />}
                </span>
            </button>
        </div>
        </div>
    </div>
  );
};

export default CustomVideo;
