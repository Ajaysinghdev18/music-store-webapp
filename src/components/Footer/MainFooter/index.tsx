import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronForwardOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';

import casperImage from '../../../assets/images/Casper_Wordmark_White_RGB.png';
import footer from '../../../assets/images/footerImage.png';
import { REACT_APP_ENVIRONMENT, ROUTES } from '../../../constants';
import { getUser } from '../../../store/selectors';
import { PrimaryButton } from '../../Button/PrimaryButton';
import { Icon } from '../../Icon';
import './styles.scss';

interface IFooterHomeBanner {
  heading?: string | any;
  basicButtonText?: string | any;
  secondaryrButtonText?: any;
  basicRightIcon?: any;
  secondaryRightIcon?: any;
}

export const FooterBanner: FC<IFooterHomeBanner> = ({
  heading,
  basicButtonText,
  secondaryRightIcon = null,
  secondaryrButtonText,
  basicRightIcon = null
}) => {
  const history = useHistory();
  return (
    <div className="footer-banner-container">
      <h1 className="text-heading1 text--center">{heading}</h1>
      <div className="hero-button-container">
        {secondaryrButtonText ? (
          <PrimaryButton
            onClick={() => history.push(ROUTES.SHOP.INDEX)}
            width={'48%'}
            scheme="secondary"
            rightIcon={secondaryRightIcon}
          >
            {secondaryrButtonText}
          </PrimaryButton>
        ) : null}
        {basicButtonText ? (
          <PrimaryButton
            width={'48%'}
            onClick={() => history.push(ROUTES.PROFILE.DASHBOARD)}
            scheme="basic"
            rightIcon={basicRightIcon}
          >
            {basicButtonText}
          </PrimaryButton>
        ) : null}
      </div>
    </div>
  );
};

export const MainFooter = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const user = useSelector(getUser);
  const { pathname } = useLocation();
  return (
    <footer className="main-footer-container">
      {pathname === ROUTES.AUTH.SIGN_IN || pathname === ROUTES.AUTH.SIGN_UP ? null : (
        <>
          <div className="footer-gradiant" />
          <div className="hero-banner-section">
            <FooterBanner
              heading={t("Home.Explore Through the Most Exciting Music NFT's")}
              secondaryrButtonText={t('Home.Explore')}
              basicButtonText={t('Home.Go to Dashboard')}
              basicRightIcon={<IoChevronForwardOutline />}
              secondaryRightIcon={<IoChevronForwardOutline />}
            />
          </div>
        </>
      )}
      <div className="footer-container">
        <div className="footer-header">
          <div className="section-1">
            <img
              src={REACT_APP_ENVIRONMENT === 'demo' ? '/images/demo-logo.png' : '/images/logo.png'}
              alt="logo"
              height={'100%'}
              width={'50%'}
            />
          </div>
          <div className="section-2">
            <p className="text-body1">{t('Layout.Marketplace')}</p>
            <p className="text-body1 ">{t('Layout.My Account')}</p>
            <p className="text-body1">{t('Layout.Resources')}</p>
          </div>
          <div className="section-3" style={{ justifyContent: user ? 'end' : 'space-between' }}>
            <PrimaryButton w={'fit-content'} scheme="basic" rightIcon={<IoChevronForwardOutline />}>
              {t('Common.Subscribe to a Newsletter')}
            </PrimaryButton>
            {user ? null : (
              <PrimaryButton
                w={'38%'}
                scheme="secondary"
                rightIcon={<IoChevronForwardOutline />}
                onClick={() => history.push(ROUTES.AUTH.SIGN_IN)}
              >
                {t('Common.Subscribe Now')}
              </PrimaryButton>
            )}
          </div>
        </div>
        <div className="divider" />
        <div className="footer-main">
          <div className="section-1">
            <span className="text-body1 description">
              {t(
                'Layout.Welcome to our online marketplace where you can buy and collect unique Music NFTs.Our carefully curated selection features rare and exclusive tracks from talented musicians and producers around the world.'
              )}
            </span>
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
          </div>
          <div className="section-2">
            <div className="footer-category-item">
              <Link to={ROUTES.SHOP.INDEX} className="text-body1">
                {t('Layout.All NFTs')}
              </Link>
              <Link to={ROUTES.EVENTS.INDEX} className="text-body1">
                {t('Layout.Event Tickets')}
              </Link>
              <Link to={ROUTES.SHOP.INDEX} className="text-body1">
                {t('Layout.Categories')}
              </Link>
            </div>
            <div className="footer-category-item">
              <Link to={ROUTES.PROFILE.PREFIX} className="text-body1">
                {t('Layout.Profile')}
              </Link>
              <Link to={ROUTES.PROFILE.LIKED_PRODUCTS} className="text-body1">
                {t('Layout.Favorites')}
              </Link>
              <Link to={ROUTES.PROFILE.WALLET.LIST} className="text-body1">
                {t('Layout.My Orders')}
              </Link>
              {/* <Link to={ROUTES.PROFILE.PAYMENT_METHODS} className="text-body1">Payment Methods</Link> */}
              <Link to={ROUTES.PROFILE.SETTINGS} className="text-body1">
                {t('Layout.Settings')}
              </Link>
            </div>
            <div className="footer-category-item">
              <Link to={ROUTES.HELP_CENTER.INDEX} className="text-body1">
                {t('Layout.Help Center')}
              </Link>
              <Link to="#" className="text-body1">
                {t('Layout.Blog')}
              </Link>
              <Link to={ROUTES.ARTICLE.LIST} className="text-body1">
                {t('Layout.Newsletter')}
              </Link>
              <Link to={ROUTES.US} className="text-body1">
                {t('Layout.About')}
              </Link>
              <Link to="#" className="text-body1">
                {t('Layout.Careers')}
              </Link>
            </div>
          </div>
          <div className="section-3">
            <img src={footer} width={'100%'} />
          </div>
        </div>
        <div className="divider" />
        <div className="footer-bottom">
          <div className="section-1">
            <p className="text-body1">Copyright@Music Store.io</p>
            <p className="text-body1">info@music-store.io</p>
          </div>
          <div className="section-2">
            <p className="text-body1">Powered by</p>
            <img src={casperImage} style={{ marginLeft: 10 }} />
          </div>
          <div className="section-3">
            <p className="text-body1">Privacy Policy</p>
            <p className="text-body1">Terms & Conditions</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
