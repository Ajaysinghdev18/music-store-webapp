// States
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { WaveSurfer } from '../WaveSurfer';

// Components
import { IconButton } from '../IconButton';

// Styles
import './styles.scss';

// Interfaces
interface IAudioPlayerProps {
  src: string;
}

// Export audio player component
export const AudioPlayer: FC<IAudioPlayerProps> = ({ src }) => {
  // States
  const [duration, setDuration] = useState<number>(0);
  const [waveWidth, setWaveWidth] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);

  // Refs
  const playerRef = useRef<any>();
  const wavesurfer = useRef<any>();

  // Calc pixel per second in wave
  const pixelPerSecond = useMemo(() => {
    if (duration) {
      return waveWidth / duration;
    } else {
      return 10;
    }
  }, [waveWidth, duration]);

  // Seek handler
  const handleSeek = useCallback(
    (e) => {
      let offset = e.clientX + playerRef.current.scrollLeft;
      let el = e.target;
      while (el) {
        offset -= el.offsetLeft;
        el = el.offsetParent;
      }
      const time = offset / pixelPerSecond;
      wavesurfer.current.seekTo(time / wavesurfer.current.getDuration());
      wavesurfer.current.play();
      setPlaying(true);
    },
    [pixelPerSecond]
  );

  // Toggle play handler
  const handleTogglePlay = useCallback(() => {
    if (wavesurfer.current) {
      if (playing) {
        // wavesurfer?.current.pause();
      } else {
        // wavesurfer?.current.play();
      }
      setPlaying(!playing);
    }
  }, [playing]);

  // Wave surfer ready handler
  const handleWaveReady = (wave: any) => {
    wavesurfer.current = wave;
    setDuration(wave.getDuration());
  };

  const handleWaveFinish = () => {
    setPlaying(false);
  };

  // Create surfer element
  const waveSurferElement = useMemo(() => <WaveSurfer src={src} onReady={handleWaveReady} onFinish={handleWaveFinish} />, [src]);

  // On mounted
  useEffect(() => {
    setWaveWidth(playerRef.current.clientWidth);
    window.onresize = () => setWaveWidth(playerRef.current.clientWidth);

    return () => {
      window.onresize = null;
    };
  }, []);

  // Return audio player component
  return (
    <div className="d-audio-player">
      <IconButton
        icon={playing ? 'pause' : 'play-outline'}
        className="play-button"
        onClick={handleTogglePlay}
        isDisabled={!wavesurfer.current}
      />
      <div className="wave-surfer" onClick={handleSeek} ref={playerRef}>
        {src && waveSurferElement}
      </div>
    </div>
  );
};
