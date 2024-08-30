import React, { ChangeEvent, FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';

import { AuthApi, UserApi } from '../../apis';
import { AnimationOnScroll, IIcon, Icon } from '../../components';
import { ROUTES } from '../../constants';
import { UserModel } from '../../shared/models';
import { setUser } from '../../store/actions';
import { getUser } from '../../store/selectors';
import { getUserImage } from '../../utils';
import { DashboardTab, LikedProductsTab, STATUS, SettingsTab, WalletTab, WheelTab } from './Tabs';
import './styles.scss';
import { KYCIcon, NotVerified, Rejected, Processing, } from '../../assets/icons';
import { useTranslation } from 'react-i18next';
import { SubscribedArtistTab } from './Tabs/SubscribedArtist';

interface IProfileLink {
  path: string;
  icon: IIcon;
  name: string;
}

export const profileLinks = (t: any): IProfileLink[] => ([
  {
    path: ROUTES.PROFILE.DASHBOARD,
    icon: 'dashboard',
    name: t('Profile.Dashboard')
  },
  {
    path: ROUTES.PROFILE.LIKED_PRODUCTS,
    icon: 'heart-fill',
    name: t('Profile.Liked Products')
  },
  {
    path: ROUTES.PROFILE.SUBSCRIBED_ARTIST,
    icon: 'heart-fill',
    name: t('Profile.SubscribedArtist')
  },
  {
    path: ROUTES.PROFILE.WALLET.LIST,
    icon: 'wallet',
    name: t('Profile.Wallet')
  },
  {
    path: ROUTES.PROFILE.SETTINGS,
    icon: 'settings',
    name: t('Profile.Settings')
  },
  {
    path: ROUTES.PROFILE.WHEEL,
    icon: 'wallet',
    name: t('Profile.Wheel')
  },
  // {
  //   path: ROUTES.PROFILE.PAYMENT_METHODS,
  //   icon: 'payment',
  //   name: 'Payment Methods'
  // }
]);

export const ProfilePage: FC = () => {
  const { pathname } = useLocation<Location>();

  const uploadRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  const user = useSelector(getUser);

  const handleAvatarClick = () => {
    if (uploadRef) {
      uploadRef.current?.click();
    }
  };

  const { t } = useTranslation();

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const avatar = files[0];
      const formData = new FormData();

      formData.append('avatar', avatar);

      if (user?.id) {
        UserApi.updateAvatar(user.id, formData)
          .then((res) => {
            const user = new UserModel(res.user);
            dispatch(setUser(user));
          })
          .catch((err) => console.log(err));
      }
    }
  };
  useEffect(() => {
    AuthApi.me()
      .then((res) => {
        const user = new UserModel(res.user);
        if (user) {
          dispatch(setUser(user));
        }
      })
      .catch((err) => console.log(err));
  }, [])

  return (
    <div className="profile-page">
      <div className="content">
        <AnimationOnScroll animation="animate__fadeIn" isSubElement>
          <div className="navbar">
            <div className="profile">
              <div className="avatar" onClick={handleAvatarClick}>
                <img src={user?.avatar ? getUserImage(user) : '/images/avatar.png'} alt="avatar" />
                <div className="avatar-edit-mask">
                  <Icon name="edit" />
                </div>
              </div>
              <input ref={uploadRef} type="file" accept="image/*" className="avatar-upload" onChange={handleUpload} />
              <h3 className="text-heading3 text--center">{user?.name}</h3>
              <div className="kyc-verified-mark">
                <h4 className="text-heading4">{user?.name.replace(' ', '.')}</h4>
                <div>
                  {user?.KYCStatus === STATUS.NOT_VERIFIED ? <NotVerified /> : user?.KYCStatus === STATUS.UNDER_VERIFICATION ? <Processing /> : user?.KYCStatus === STATUS.REJECTED ? <Rejected /> : user?.KYCStatus === STATUS.VERIFIED ? <KYCIcon /> : null}
                </div>
              </div>
              <div>
              </div>
            </div>
            <div className="profile-tab-menu">
              {profileLinks(t).map(({ path, icon, name }, index) => (
                <AnimationOnScroll key={path} animation="animate__fadeIn" delay={index + 2}>
                  <NavLink exact className="nav-link" activeClassName="nav-link--active" to={path}>
                    <Icon name={icon} />
                    <span className="text-body1">
                      {index === profileLinks.length - 1 ? (
                        <>
                          {name.split(' ')[0]} <span className="sm-none">{name.split(' ')[1]}</span>
                        </>
                      ) : (
                        name
                      )}
                    </span>
                  </NavLink>
                </AnimationOnScroll>
              ))}
            </div>
            <NavLink
              exact
              className="settings-link"
              activeClassName="settings-link--active"
              to={ROUTES.PROFILE.SETTINGS}
            >
              <Icon name="settings" />
            </NavLink>
          </div>
        </AnimationOnScroll>
        <div className="tab-section">
          {pathname === ROUTES.PROFILE.DASHBOARD && <DashboardTab />}
          {pathname === ROUTES.PROFILE.LIKED_PRODUCTS && <LikedProductsTab />}
          {pathname === ROUTES.PROFILE.WALLET.LIST && <WalletTab />}
          {pathname === ROUTES.PROFILE.SETTINGS && <SettingsTab />}
          {pathname === ROUTES.PROFILE.SUBSCRIBED_ARTIST && <SubscribedArtistTab />}
          {pathname === ROUTES.PROFILE.WHEEL && <WheelTab />}

          {/* {pathname === ROUTES.PROFILE.PAYMENT_METHODS && <PaymentMethodsTab />} */}
        </div>
        {/* {pathname === ROUTES.PROFILE.PAYMENT_METHODS && (
          <div className="payment-background">
            <div className="backdrop" />
            <img src="/images/bitcoin-icon-background.png" alt="bitcoin" />
            <img src="/images/dollar-icon-background.png" alt="dollar" />
          </div>
        )} */}
      </div>
    </div>
  );
};
