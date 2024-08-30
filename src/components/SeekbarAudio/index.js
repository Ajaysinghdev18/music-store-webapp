import React, { useRef, useState, useEffect } from 'react';
import { BiPause, BiPlay } from "react-icons/bi";
export const Audio = ({ src }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const setAudioDuration = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', setAudioDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
    };
  }, []);
  useEffect(()=>{
    if(currentTime === duration){
      setCurrentTime(0)
      setIsPlaying(false)
    }
  },[currentTime])

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    audio.currentTime = e.target.value;
    setCurrentTime(e.target.value);
  };

  const curPercentage = (currentTime / duration) * 100;

  return (
    <div className="custom-audio-player">
      {/* Audio Element */}
      <audio ref={audioRef} src={src}></audio>
      <div className="bar">
        <button
          className="bar__progress"
          onClick={togglePlay}
        >
          <span
            className="bar__progress__knob"
            style={{ left: `${curPercentage - 3}%` }}
          >
            {isPlaying ? <BiPause size={34} /> : <BiPlay size={34} />}
          </span>
        </button>
      </div>
    </div>
  );
};

