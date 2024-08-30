// Dependencies
import classnames from 'classnames';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useRouteMatch } from 'react-router-dom';

import { MainFooter } from '../../components/Footer/MainFooter';
// Constants
import { ROUTES } from '../../constants';
// Store
import { setScrollTop } from '../../store/actions';
// Components
import Header from './Header';
// Styles
import './styles.scss';

const appearFrom: Record<string, 'bottom' | 'right' | 'left'> = {
  [ROUTES.HOME]: 'right',
  [ROUTES.PROFILE.DASHBOARD]: 'bottom',
  [ROUTES.PROFILE.LIKED_PRODUCTS]: 'bottom',
  [ROUTES.PROFILE.SETTINGS]: 'bottom',
  // [ROUTES.PROFILE.PAYMENT_METHODS]: 'bottom',
  [ROUTES.SHOP.INDEX]: 'right',
  [ROUTES.PRODUCTS.DETAIL]: 'right',
  [ROUTES.EVENTS.INDEX]: 'right',
  [ROUTES.CART]: 'right',
  [ROUTES.CHECKOUT]: 'right',
  [ROUTES.SEARCH_RESULT]: 'right',
  [ROUTES.US]: 'right',
  [ROUTES.CRYPTO.DEPOSIT]: 'right',
  [ROUTES.CRYPTO.WITHDRAW]: 'right',
  [ROUTES.AUTH.SIGN_IN]: 'right',
  [ROUTES.AUTH.SIGN_UP]: 'left'
};

// Export help center layout
export const HelpCenterLayout: FC = ({ children }) => {
  // States
  const [activeTransition, setActiveTransition] = useState(true);
  const [transitionClass, setTransitionClass] = useState<string>('appear-from-right');

  // Ref
  const scrollRef = useRef<HTMLDivElement>(null);

  // Get location from hook
  const { pathname } = useLocation();

  // Get dispatch from hook
  const dispatch = useDispatch();

  // Check product detail page
  const productMatch = useRouteMatch(ROUTES.PRODUCTS.DETAIL);
  const profileMatch = useRouteMatch(ROUTES.PROFILE.INDEX);

  // On path changed
  useEffect(() => {
    setTransitionClass(`appear-from-${appearFrom[productMatch?.isExact ? ROUTES.PRODUCTS.DETAIL : pathname]}`);
    setActiveTransition(true);
    if (!profileMatch?.isExact) {
      setTimeout(() => setActiveTransition(false), 1500);
    }
    // eslint-disable-next-line
  }, [pathname]);

  // Wheel handler
  const handleWheel = () => {
    if (scrollRef.current) {
      dispatch(setScrollTop(scrollRef.current.scrollTop));
    }
  };

  // Return help center layout
  return (
    <main className="d-help-center-layout" onScrollCapture={handleWheel}>
      <Header />
      <div
        ref={scrollRef}
        className={classnames('scrollbar', {
          [transitionClass]: activeTransition
        })}
      >
        <div className="d-content">{children}</div>
        <MainFooter />
      </div>
    </main>
  );
};

// Export layout
export default HelpCenterLayout;
