import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import { DiscoverSection } from '../../components/DiscoverSection';
import { ROUTES } from '../../constants';
import { PRODUCT_TYPE } from '../../shared/enums';
import { TabTitle, metaTagByDesc, metaTagByKey, metaTagByTitle, metaTagByWeb } from '../../utils/generaltittlefunction';
import './styles.scss';

export const ShopPage: FC = () => {
  const { t } = useTranslation();

  const history = useHistory();

  const handleSubscribe = () => {
    history.push(ROUTES.ARTIST.LIST);
  };
  // const filteredProduct = !user ? products.slice(0, productsToShow) : user?.subscribedArtist?.length === 0 ? products.slice(0, productsToShow) : isSubscribedToAllArtist ? products : products.slice(0, productsToShow)

  if (history.location.pathname === ROUTES.SHOP.INDEX) {
    TabTitle(t('Common.Shop - Digital Music Shopping Market Place'));
  } else if (history.location.pathname === ROUTES.EVENTS.INDEX) {
    TabTitle(t('Common.Events - Digital Music Shopping Market Place'));
  } else if (history.location.pathname === ROUTES.SONGS.INDEX) {
    TabTitle(t('Common.Songs - Digital Music Shopping Market Place'));
  } else if (history.location.pathname === ROUTES.ARTIST.LIST) {
    TabTitle(t('Common.Songs - Digital Music Shopping Market Place'));
  } else if (history.location.pathname === ROUTES.MERCHANDISE.INDEX) {
    TabTitle(t('Common.Merchandise - Digital Music Shopping Market Place'));
  } else if (history.location.pathname === ROUTES.VIDEOS.INDEX) {
    TabTitle(t('Common.Videos - Digital Music Shopping Market Place'));
  } else if (history.location.pathname === ROUTES.IMAGES.INDEX) {
    TabTitle(t('Common.Images - Digital Music Shopping Market Place'));
  } else if (history.location.pathname === ROUTES.OBJECTS.INDEX) {
    TabTitle('Object - Digital Music Shopping Market Place');
  }

  if (history.location.pathname === ROUTES.SHOP.INDEX) {
    metaTagByTitle(t('Common.Shop - Digital Music Shopping Market Place'));
  } else if (history.location.pathname === ROUTES.EVENTS.INDEX) {
    metaTagByTitle(t('Common.Events - Digital Music Shopping Market Place'));
  } else if (history.location.pathname === ROUTES.SONGS.INDEX) {
    metaTagByTitle(t('Common.Songs - Digital Music Shopping Market Place'));
  } else if (history.location.pathname === ROUTES.ARTIST.LIST) {
    metaTagByTitle(t('Common.Songs - Digital Music Shopping Market Place'));
  } else if (history.location.pathname === ROUTES.MERCHANDISE.INDEX) {
    metaTagByTitle(t('Common.Merchandise - Digital Music Shopping Market Place'));
  } else if (history.location.pathname === ROUTES.VIDEOS.INDEX) {
    metaTagByTitle(t('Common.Videos - Digital Music Shopping Market Place'));
  } else if (history.location.pathname === ROUTES.IMAGES.INDEX) {
    metaTagByTitle(t('Common.Images - Digital Music Shopping Market Place'));
  } else if (history.location.pathname === ROUTES.OBJECTS.INDEX) {
    metaTagByTitle('Object - Digital Music Shopping Market Place');
  }
  metaTagByDesc(
    t('Common.Music-Store is founded on values we all share and are ready to stand for.') +
      ' ' +
      t('Common.They bring us together well beyond our current products and technologies.') +
      ' ' +
      t(
        'Common.They’ve defined our identity since the beginning, and they’ll continue to do so, no matter how our business evolves.'
      )
  );
  metaTagByKey(t('Common.Music-Store, Nft, Hackers, Explore Through the Most Exciting Music NFT'));
  metaTagByWeb(`https://dev.music-store.io${window.location.pathname}`);
  let type;
  let title;
  if (history.location.pathname === ROUTES.IMAGES.INDEX) {
    title = t('Common.Images');
    type = PRODUCT_TYPE.IMAGES;
  } else if (history.location.pathname === ROUTES.EVENTS.INDEX) {
    title = t('Common.Events');
    type = PRODUCT_TYPE.VIRTUAL_EVENT;
  } else if (history.location.pathname === ROUTES.SONGS.INDEX) {
    title = t('Common.Songs');
    type = PRODUCT_TYPE.SONG;
  } else if (history.location.pathname === ROUTES.MERCHANDISE.INDEX) {
    title = t('Common.Merchandise');
    type = PRODUCT_TYPE.MERCHANDISE;
  } else if (history.location.pathname === ROUTES.OBJECTS.INDEX) {
    title = t('Common.Objects');
    type = PRODUCT_TYPE.OBJECT;
  } else if (history.location.pathname === ROUTES.VIDEOS.INDEX) {
    title = t('Common.Videos');
    type = PRODUCT_TYPE.VIDEOS;
  } else if (history.location.pathname === ROUTES.SHOP.INDEX) {
    title = PRODUCT_TYPE.ALL;
  } else {
    title = t('Common.Images');
    type = PRODUCT_TYPE.IMAGES;
  }
  return (
    <div className="song-container">
      <div className="overview-section">
        <DiscoverSection type={type} title={title} isHome={true} />
      </div>
    </div>
  );
};
