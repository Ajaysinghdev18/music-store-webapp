// Dependencies
import React, { FC, memo, useEffect, useMemo, useState } from 'react';

import { SCREEN_RESOLUTION } from '../../shared/enums/screen-resolution.enum';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const WaveSurferJS = require('wavesurfer.js');

// Interfaces
export interface WaveSurferOptions {
  audioRate?: number;
  audioContext?: object;
  audioScriptProcessor?: object;
  autoCenter?: boolean;
  backend?: string;
  backgroundColor?: string;
  barGap?: number;
  barHeight?: number;
  barMinHeight?: number;
  barRadius?: number;
  barWidth?: number;
  closeAudioContext?: boolean;
  container?: string | HTMLElement;
  cursorColor?: string;
  cursorWidth?: number;
  drawingContextAttributes?: object;
  fillParent?: boolean;
  forceDecode?: boolean;
  height?: number;
  hideScrollbar?: boolean;
  hideCursor?: boolean;
  interact?: boolean;
  loopSelection?: boolean;
  maxCanvasWidth?: number;
  mediaControls?: boolean;
  mediaType?: string;
  minPxPerSec?: number;
  normalize?: boolean;
  partialRender?: boolean;
  pixelRatio?: number;
  plugins?: any[];
  progressColor?: string;
  regionsMinLength?: number;
  removeMediaElementOnDestroy?: boolean;
  renderer?: any;
  responsive?: boolean;
  scrollParent?: boolean;
  skipLength?: number;
  waveColor?: string;
  xhr?: any;
}

interface IWaveSurferProps {
  className?: string;
  src: string;
  options?: WaveSurferOptions;
  autoPlay?: boolean;
  onInit?: (wavesurfer: any) => void;
  onReady?: (wavesurfer: any) => void;
  onFinish?: () => void;
  onProcess?: (duration: number) => void;
  onSeek?: (duration: number) => void;
}

// Constants
const defaultOptions: WaveSurferOptions = {
  barGap: 8,
  barWidth: 3,
  barRadius: 1.5,
  cursorWidth: 0,
  height: 168,
  responsive: true,
  waveColor: 'cyan',
  progressColor: 'magenta'
};

// Create wave surfer component
export const WaveSurfer: FC<IWaveSurferProps> = memo(
  ({ className = '', src, options, autoPlay = false, onInit, onReady, onFinish, onProcess, onSeek }) => {
    // States
    const [surfer, setSurfer] = useState<any>();

    // Create id
    const id = useMemo(() => `waveform-${Math.floor(Math.random() * 100000)}`, []);

    // On id, options, onInit changed
    useEffect(() => {
      const waveOptions = {
        barGap: 8,
        barWidth: 3,
        height: 168
      };

      if (window.innerWidth < SCREEN_RESOLUTION.SM) {
        waveOptions.barGap = 2;
        waveOptions.barWidth = 1;
      } else if (window.innerWidth < SCREEN_RESOLUTION.MD) {
        waveOptions.barGap = 3;
        waveOptions.barWidth = 1.5;
      } else if (window.innerWidth < SCREEN_RESOLUTION.LG) {
        waveOptions.barGap = 4;
        waveOptions.barWidth = 2;
      }

      const wavesurfer = WaveSurferJS.create({
        container: `#${id}`,
        ...defaultOptions,
        ...options,
        ...waveOptions
      });

      setSurfer(wavesurfer);
      if (onInit) {
        onInit(wavesurfer);
      }

      return () => wavesurfer.destroy();
    }, [id, options, onInit]);

    // On surfer and src changed
    useEffect(() => {
      if (!surfer) return;

      surfer.load(src);
    }, [surfer, src]);

    // On surfer, autoplay and onReady changed
    useEffect(() => {
      if (!surfer) return;

      const wavesurfer: any = surfer;
      const _onReady = () => {
        if (autoPlay) {
          wavesurfer.play();
        }
        if (onReady) {
          onReady(wavesurfer);
        }
      };
      const _onFinish = () => {
        if (onFinish) {
          onFinish();
        }
      }
      wavesurfer.on('ready', _onReady);
      wavesurfer.on('finish', _onFinish);
      return () => wavesurfer.un('ready', _onReady);
    }, [surfer, autoPlay, onReady, onFinish]);

    // On surfer and onProcess changed
    useEffect(() => {
      if (!surfer || !onProcess) return;
      const wavesurfer: any = surfer;
      const _onProcess = () => {
        onProcess(wavesurfer.getCurrentTime());
      };
      wavesurfer.on('audioprocess', _onProcess);
      return () => wavesurfer.un('audioprocess', _onProcess);
    }, [surfer, onProcess]);

    // On surfer and onSeek changed
    useEffect(() => {
      if (!surfer || !onSeek) return;

      const wavesurfer: any = surfer;
      const _onSeek = () => {
        onSeek(wavesurfer.getCurrentTime());
      };
      wavesurfer.on('seek', _onSeek);
      return () => wavesurfer.un('seek', _onSeek);
    }, [surfer, onSeek]);

    // Return wave-surfer component
    return useMemo(() => <div id={id} className={className} />, [id, className]);
  }
);
