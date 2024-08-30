// Dependencies
import React, { FC, useState } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { IIcon, Icon, IconButton } from '../../../components';
import classnames from 'classnames';

// Constants
import { ACCESS_TOKEN_KEY, REACT_APP_ENVIRONMENT, REACT_APP_LANG_KEY, ROUTES } from '../../../constants';
import i18n from '../../../i18n';

// Styles
import './styles.scss';
import { getLangIcon } from '../../Main/Header';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../../store/selectors';
import { useTranslation } from 'react-i18next';
import { StorageHelper } from '../../../helpers';
import { Button, Flex } from '@chakra-ui/core';
import { getUserImage } from '../../../utils';
import { profileLinks } from '../../../pages';
import { addToCart, setUser } from '../../../store/actions';

// Constants
const navLinks = [
  { label: 'Home', pathname: ROUTES.HELP_CENTER.INDEX },
  { label: 'FAQ', pathname: ROUTES.HELP_CENTER.FAQ.INDEX },
  { label: 'Ticket', pathname: ROUTES.HELP_CENTER.TICKETS.INDEX }
];

// Create header component
const Header: FC = () => {
  // States
  const [visibleProfile, setVisibleProfile] = useState<boolean>(false);
  const [visibleLangMenu, setVisibleLangMenu] = useState<boolean>(false);
  const history = useHistory();
  const user = useSelector(getUser);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleToggleLangMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setVisibleLangMenu(!visibleLangMenu);
    setVisibleProfile(false);
  };


  const handleToggleProfile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (user) {
      setVisibleProfile(!visibleProfile);
    } else {
      history.push(ROUTES.AUTH.SIGN_IN);
    }
    setVisibleLangMenu(false);
  };

  const languages = [
    {
      icon: <Icon name="us-flag" />,
      lang: 'en',
      label: t('Common.English')
    },
    {
      icon: <Icon name="nl-flag" />,
      lang: 'nl',
      label: t('Common.Dutch')
    },
    {
      icon: <Icon name="fr-flag" />,
      lang: 'fr',
      label: t('Common.French')
    },
    {
      icon: <Icon name="de-flag" />,
      lang: 'de',
      label: t('Common.German')
    },
    {
      icon: <Icon name="es-flag" />,
      lang: 'es',
      label: t('Common.Spanish')
    }
  ];

  const handleChangeLang = (lang: string) => async () => {
    await i18n.changeLanguage(lang);
    StorageHelper.setItem(REACT_APP_LANG_KEY, lang);
    setVisibleLangMenu(false);
  };

  const handleLogout = () => {
    dispatch(setUser(null));
    dispatch(addToCart(null));
    StorageHelper.removeItem(ACCESS_TOKEN_KEY);
    history.push(ROUTES.HOME);
  };

  // Return header component
  return (
    <header className="d-help-center-header">
      <div className="content">
        <Link to={ROUTES.HOME} className="logo">
          <img src={REACT_APP_ENVIRONMENT === 'demo' ? '/images/demo-logo.png' : '/images/logo.png'} alt="logo" />
        </Link>
        <div className="nav-links">
          {navLinks.map(({ label, pathname }, index) => (
            <div key={index} className="nav-link">
              <NavLink key={pathname} to={pathname}>
                {label}
              </NavLink>
            </div>
          ))}
            <IconButton icon={getLangIcon() as unknown as IIcon} style={{ width: 20 }} onClick={handleToggleLangMenu} />
            <IconButton icon="person" onClick={handleToggleProfile} style={{ width: 20, marginLeft: 40 }} />
        </div>
        <div
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        className={classnames('profile', { visible: visibleProfile })}
      >
        {user && (
          <div className="information">
            <div className="user">
              <div className="avatar">
                <img src={user?.avatar ? getUserImage(user) : '/images/avatar.png'} alt="avatar" />
              </div>
              <span className="name">
                {user?.name?.split(' ').map((name, index) => (
                  <React.Fragment key={index}>
                    {name}
                    <br />
                  </React.Fragment>
                ))}
              </span>
            </div>
            <div className="navs">
              {profileLinks(t).map(({ path, icon, name }) => (
                <NavLink key={path} exact className="nav-link" activeClassName="nav-link--active" to={path}>
                  <Icon name={icon} />
                  <span>{name}</span>
                </NavLink>
              ))}
            </div>
            <Flex justifyContent="end">
              <Button className="d-outlined-button  logout-button" onClick={handleLogout}>
                {t('Layout.Log Out')}
              </Button>
            </Flex>
          </div>
        )}
      </div>
         <div
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        className={classnames('lang-select', { visible: visibleLangMenu })}
      >
        {languages.map(({ icon, lang, label }, index) => (
          <div key={index} className="lang-select-option" onClick={handleChangeLang(lang)}>
            <span className="lang-icon">{icon}</span>
            <span className="lang-label">{label}</span>
          </div>
        ))}
      </div>
      </div>
     
    </header>
  );
};

export default Header;
