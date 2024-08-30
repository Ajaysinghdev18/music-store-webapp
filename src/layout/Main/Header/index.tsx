import { Button, Flex, Input, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/core';
import { useWeb3React } from '@web3-react/core';
import classnames from 'classnames';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { IoSearch } from "react-icons/io5";
import { CategoryApi } from '../../../apis';
import { IIcon, Icon, IconButton } from '../../../components';
import {
  ACCESS_TOKEN_KEY,
  REACT_APP_ENVIRONMENT,
  REACT_APP_LANG_KEY,
  ROUTES,
} from '../../../constants';
import { StorageHelper } from '../../../helpers';
import i18n from '../../../i18n';
import { profileLinks } from '../../../pages';
import { addToCart, setCategories, setUser } from '../../../store/actions';
import { getCart, getCategories, getUser } from '../../../store/selectors';
import { getUserImage } from '../../../utils';
import './styles.scss';
import { PrimaryButton } from '../../../components/Button/PrimaryButton';
import { IoChevronForwardOutline, IoPersonOutline } from 'react-icons/io5';
import { RxCross2 } from "react-icons/rx";

interface ILink {
  label: string;
  pathname: string;
  subLinks?: {
    label: string;
    pathname: string;
  }[];
}

export const getLangIcon = () => {
  switch (i18n.language) {
    case 'en': {
      return 'us-flag';
    }
    case 'nl': {
      return 'nl-flag';
    }
    case 'fr': {
      return 'fr-flag';
    }
    case 'de': {
      return 'de-flag';
    }
    case 'es': {
      return 'es-flag';
    }

    default: {
      return 'us-flag';
    }
  }
};

const Header: FC = () => {
  const { account } = useWeb3React();
  const [visibleProfile, setVisibleProfile] = useState<boolean>(false);
  const [visibleMenu, setVisibleMenu] = useState<boolean>(false);
  const [visibleLangMenu, setVisibleLangMenu] = useState<boolean>(false);
  const [visibleSearch, setVisibleSearch] = useState<boolean>(false);

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();
  const user = useSelector(getUser);
  const cart = useSelector(getCart);
  const categories = useSelector(getCategories);

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

  const fetchCategory = useCallback(() => {
    CategoryApi.readAll()
      .then((res) => {
        dispatch(setCategories(res.categories));
      })
      .catch((err) => console.log(err));
  }, [dispatch]);

  const handleToggleMobileMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setVisibleMenu(!visibleMenu);
    setVisibleProfile(false)
  };

  const handleToggleProfile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (user) {
      setVisibleMenu(false)
      setVisibleProfile(!visibleProfile);
    } else {
      history.push(ROUTES.AUTH.SIGN_IN);
    }
    setVisibleLangMenu(false);
  };

  const handleToggleLangMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setVisibleLangMenu(!visibleLangMenu);
    setVisibleProfile(false);
  };

  const handleSearchButtonClick = () => {
    setVisibleSearch(!visibleSearch);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const searchKey = e.currentTarget.value;
      history.push(`${ROUTES.SEARCH_RESULT}?${searchKey}`);
    }
  };

  const handleCart = () => {
    history.push(ROUTES.CART);
  };

  const handleLogout = () => {
    dispatch(setUser(null));
    dispatch(addToCart(null));
    StorageHelper.removeItem(ACCESS_TOKEN_KEY);
    history.push(ROUTES.HOME);
  };

  const handleChangeLang = (lang: string) => async () => {
    await i18n.changeLanguage(lang);
    StorageHelper.setItem(REACT_APP_LANG_KEY, lang);
    setVisibleLangMenu(false);
  };

  const navLinks = useMemo(() => {
    const links: ILink[] = categories
      .filter((cat) => cat.visibleInNav)
      .map(({ id, name, subCategories }) => ({
        label: name,
        pathname: `${ROUTES.PRODUCTS.BY_CATEGORY}?category=${id as string}`,
        subLinks: subCategories?.map((item) => ({
          label: item,
          pathname: `${ROUTES.PRODUCTS.BY_CATEGORY.replace(':categoryId', id as string)}`
        }))
      }));

    links.push(
      { label: t('Common.Artist'), pathname: ROUTES.ARTIST.LIST },
      { label: t('Common.Events'), pathname: ROUTES.EVENTS.INDEX },
      { label: t('Common.Venues'), pathname: ROUTES.VENUES.INDEX },
      { label: t('Common.Songs'), pathname: ROUTES.SONGS.INDEX },
      // { label: t('Common.Images'), pathname: ROUTES.IMAGES.INDEX },
      // { label: t('Common.Videos'), pathname: ROUTES.VIDEOS.INDEX },
      // { label: t('Common.Objects'), pathname: ROUTES.OBJECTS.INDEX },
      { label: t('Common.Merchandise'), pathname: ROUTES.MERCHANDISE.INDEX },
      { label: t('Common.Shop'), pathname: ROUTES.SHOP.INDEX },
      
      { label: t('Common.Us'), pathname: ROUTES.US }
    );

    return links;
  }, [t, categories]);



  useEffect(() => {
    window.onclick = () => {
      setVisibleProfile(false);
    };

    fetchCategory();

    return () => {
      window.onclick = null;
    };
  }, [fetchCategory]);

  useEffect(() => {
    if (account) {
      const updateUser = {
        ...user,
        accountWallet: account
      };
      dispatch(setUser(updateUser as any));
    }
  }, [account, dispatch, user]);

  return (
    <header className="d-header">
      <div className="content">
        <div onClick={handleToggleMobileMenu} className={classnames('menu-icon', { active: visibleMenu })}>
          <span />
          <span />
        </div>
        <Link to={ROUTES.HOME} className="logo">
          <img src={REACT_APP_ENVIRONMENT === 'demo' ? '/images/demo-logo.png' : '/images/logo.png'} alt="logo" />
        </Link>
        <div className="nav-links">
          <div className='nav-links-content'>
            {navLinks.map(({ label, pathname, subLinks }) =>
              subLinks && subLinks.length > 0 ? (
                <Menu key={label}>
                  <MenuButton className="dropdown-button" style={{ textTransform: 'uppercase' }}>{label}</MenuButton>
                  <MenuList className="dropdown-menu">
                    {subLinks.map((subLink) => (
                      <MenuItem key={subLink.label} className="sub-category-item text-body1">
                        <Link to={subLink.pathname} className='text-body1' style={{ textTransform: 'uppercase' }}>{subLink.label}</Link>
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              ) : (
                <Link key={pathname} to={pathname} style={{ textTransform: 'uppercase' }}>
                  {label}
                </Link>
              )
            )}
          </div>
          <div className="actions">
            <div className={classnames('search-bar', { visible: visibleSearch })}>
              <div className="search-input-wrapper">
                <div className="search-input">
                  <Icon name="play" />
                  <Input placeholder="Search." onKeyDown={handleSearch} />
                  <RxCross2 onClick={()=> setVisibleSearch(!visibleSearch)} size={30} cursor={'pointer'} color='white'/>
                </div>
              </div>
              <IoSearch onClick={handleSearchButtonClick} color='white' size={30}/>
            </div>
            <span
              className={classnames('badge', {
                active: cart?.products?.length
              })}
            >
              <span className="badge-text">{cart && cart.products?.length > 0 && cart?.products?.length}</span>
              <IconButton icon="shopping-bag" onClick={handleCart} style={{ width: 20 }} />
            </span>
            <IconButton icon={getLangIcon() as unknown as IIcon} style={{ width: 20 }} onClick={handleToggleLangMenu} />
            {user ? <img src={user?.avatar ? getUserImage(user) : '/images/avatar.png'} onClick={(e: any) => handleToggleProfile(e)} height={30} width={30} style={{objectFit:'cover', borderRadius:'50%', cursor:'pointer'}} alt="avatar" /> : <IoPersonOutline color='white' cursor={'pointer'} size={22} onClick={() => history.push(ROUTES.AUTH.SIGN_IN)} />}
            {user ? null : <PrimaryButton scheme='secondary' w={'fit-content'} rightIcon={<IoChevronForwardOutline />} onClick={() => history.push(ROUTES.AUTH.SIGN_IN)}>{t("Common.Subscribe Now")}</PrimaryButton>}
          </div>
        </div>
        <div style={{display:'flex'}}>
          <span
            className={classnames('badge badge--mobile', {
              active: cart?.products?.length
            })}
          >
            <span className="badge-text">{cart && cart?.products?.length > 0 && cart?.products.length}</span>
            <IconButton icon="shopping-bag" onClick={handleCart} style={{ width: 20 }} />
          </span>
          <span className={classnames('badge badge--mobile')}>
            <IconButton icon="person" onClick={handleToggleProfile} />
          </span>
          </div>
      </div>
      <div
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        className={classnames('profile', { visible: visibleMenu })}
      >
        <div className="toolbar">
          <div className="mobile-menu">
            {navLinks.map(({ label, pathname, subLinks }) =>
              subLinks && subLinks.length ? (
                <Menu key={label}>
                  <MenuButton className="dropdown-button" style={{ textTransform: 'uppercase' }}>{label}</MenuButton>
                  <MenuList className="dropdown-menu">
                    {subLinks.map((subLink) => (
                      <MenuItem key={subLink.label} className="sub-category-item text-body1">
                        <Link to={subLink.pathname} style={{ textTransform: 'uppercase' }}>{subLink.label}</Link>
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              ) : (
                <Link key={pathname} to={pathname} style={{ textTransform: 'uppercase' }}>
                  {label}
                </Link>
              )
            )}
            {!user && <IconButton icon="person" onClick={handleToggleProfile} />}
          </div>
          <div className='search-bar-container'>
            <div className={classnames('search-bar', { visible: visibleSearch })}>
              <div className="search-input-wrapper">
                <div className="search-input">
                  <Icon name="play" />
                  <Input placeholder="Search." onKeyDown={handleSearch} />
                </div>
              </div>
              <IconButton icon="search" onClick={handleSearchButtonClick} />
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        className={classnames('profile', { visible: visibleProfile })}
      >
        {user && (
          <div className="information">
            <div className="user">
              <div className="avatar">
                <img src={user?.avatar ? getUserImage(user) : '/images/avatar.png'} alt="avatar" style={{height:'100%', width:'100%', objectFit:'cover'}}/>
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
    </header>
  );
};

export default Header;
