// Dependencies
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

// Assets
import casperImage from '../../assets/images/Casper_Wordmark_White_RGB.png';
// Global constants
import { ROUTES } from '../../constants';
// Hooks
import { useWindowSize } from '../../shared/hooks/useWindowSize';
// Icon
import { Icon } from '../Icon';
// Component
import { MainFooter } from './MainFooter';
// Styles
import './styles.scss';

// Export footer component
export const Footer: FC = () => {
  // Window size
  const { isTablet } = useWindowSize();
  // Get location from hook
  const { pathname } = useLocation();
  const { t } = useTranslation();

  if (
    !isTablet &&
    (pathname === '/' ||
      pathname.includes(ROUTES.EVENTS.PREFIX) ||
      pathname.includes(ROUTES.PRODUCTS.PREFIX) ||
      pathname.includes(ROUTES.PROFILE.PREFIX) ||
      pathname.includes(ROUTES.AUTH.SIGN_UP) ||
      pathname.includes(ROUTES.AUTH.SIGN_IN) ||
      pathname.includes(ROUTES.AUTH.RESET_PASSWORD) ||
      pathname.includes(ROUTES.AUTH.VERIFY) ||
      pathname.includes(ROUTES.AUTH.FORGOTPASSWORD) ||
      pathname.includes(ROUTES.ARTICLE.LIST) ||
      pathname.includes(ROUTES.ARTIST.LIST) ||
      pathname.includes(ROUTES.ARTIST.DETAIL))
  ) {
    return <MainFooter />;
  }

  return (
    <footer className="d-footer">
      <div className="casper">
        <span className="text-body1">{t('Home.Powered by')}</span>
        <img src={casperImage} alt="casper" />
      </div>
      <div className="social-link-group">
        <Link className="social-link" to="#">
          <Icon name="spotify" />
        </Link>
        <Link className="social-link" to="#">
          <Icon name="youtube" />
        </Link>
        <Link className="social-link" to="#">
          <Icon name="facebook" />
        </Link>
        <Link className="social-link" to="#">
          <Icon name="instagram" />
        </Link>
      </div>
      <div className="content">
        <span className="text-body1">info@music-store.io</span>
        <div className="inner-link-group">
          <Link className="text-body1" to={ROUTES.PRIVACY_STATEMENT}>
            {t('Layout.Privacy Statement')}
          </Link>
          <Link className="text-body1" to={ROUTES.TERMS_CONDITIONS}>
            {t('Layout.Terms & Conditions')}
          </Link>
          <Link className="text-body1" to={ROUTES.HELP_CENTER.INDEX}>
            {t('Layout.Help Center')}
          </Link>
        </div>
        <span className="text-body1">{t('Layout.Copyright')} @ Music Store.io</span>
      </div>
    </footer>
  );
};

export default Footer;
