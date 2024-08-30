// Dependencies
import React, { createRef, FC, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

// Store
import { getScrollTop } from '../../store/selectors';
import { useWindowSize } from '../../shared/hooks/useWindowSize';
import { SCREEN_RESOLUTION } from '../../shared/enums/screen-resolution.enum';

// Interface
interface IAnimationOnScrollProps {
  animation: string;
  delay?: number;
  isSubElement?: boolean;
  className?: string;
}

// Export AnimationOnScroll component
export const AnimationOnScroll: FC<IAnimationOnScrollProps> = ({
  children,
  animation,
  delay = 0,
  isSubElement = false,
  className
}) => {
  // State
  const [position, setPosition] = useState<number>(0);
  const [isInViewport, setIsInViewport] = useState(false);
  const [opacity, setOpacity] = useState(0);

  // Ref
  const ref = createRef<HTMLDivElement>();

  // Get scroll top from store
  const scrollTop = useSelector(getScrollTop);

  // Get window size from hook
  const windowSize = useWindowSize();

  // Check device size
  const isMobile = useMemo(
    // @ts-ignore
    () => windowSize && windowSize?.resolution < SCREEN_RESOLUTION.LG,
    [windowSize]
  );

  // On ref changed
  useEffect(() => {
    let top = 0;
    let parent = ref.current?.parentElement;
    let current = ref.current;

    if (!isMobile && isSubElement) {
      while (current && parent && parent.tagName !== 'BODY') {
        top += current.offsetTop | 0;
        current = parent as HTMLDivElement;
        parent = parent.parentElement;
      }

      setPosition(top);
    } else {
      setPosition(ref.current?.offsetTop as number);
    }
  }, [ref, isMobile, isSubElement]);

  // On scroll top changed
  useEffect(() => {
    if (position > 0 && scrollTop + window.innerHeight * 0.8 > position) {
      setIsInViewport(true);
    }
  }, [scrollTop, position]);

  // On position changed
  useEffect(() => {
    if (position > 0 && position < window.innerHeight * 0.8) {
      setIsInViewport(true);
    }
  }, [position]);

  // On viewport change
  useEffect(() => {
    if (isInViewport) {
      setTimeout(() => setOpacity(1), delay * 1000);
    }
  }, [isInViewport, delay]);

  // Return AnimationOnScroll component
  return (
    <div
      ref={ref}
      style={{
        opacity,
        animationDelay: `${delay}s`
      }}
      className={`animate__animated ${className} ${isInViewport ? animation : ''}`}
    >
      {children}
    </div>
  );
};
