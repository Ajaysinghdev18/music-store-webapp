import { useState, useEffect } from 'react';

import { SCREEN_RESOLUTION } from '../enums/screen-resolution.enum';

export interface IWindowSize {
  width?: number;
  height?: number;
  isMobile?: boolean;
  isTablet?: boolean;
  resolution?: SCREEN_RESOLUTION;
}

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<IWindowSize>({});

  useEffect(() => {
    function handleResize() {
      const resolutions = Object.values(SCREEN_RESOLUTION) as SCREEN_RESOLUTION[];
      let id = resolutions.findIndex((item) => item > window.innerWidth) - 1;
      if (id === -2) id = resolutions.length - 1;

      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < SCREEN_RESOLUTION.LG,
        isTablet: window.innerWidth < 1400,
        resolution: resolutions[id]
      });
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};
