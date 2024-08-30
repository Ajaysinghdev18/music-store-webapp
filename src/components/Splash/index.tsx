// Dependencies
import React, { FC } from 'react';

// Components
import { AnimationOnScroll } from '../AnimationOnScroll';

// Constants
import { REACT_APP_ENVIRONMENT } from '../../constants';

// Styles
import './styles.scss';

// Export Splash component
export const Splash: FC = () => {
  // Return
  return (
    <div className="splash">
      <AnimationOnScroll animation="animate__fadeIn">
        <img
          src={REACT_APP_ENVIRONMENT === 'demo' ? '/images/demo-logo.png' : '/images/splash/splash.gif'}
          alt="splash"
        />
      </AnimationOnScroll>
    </div>
  );
};
