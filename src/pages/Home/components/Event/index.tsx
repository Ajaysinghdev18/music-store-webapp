import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { CartButton } from '../../../../components';
import { ROUTES } from '../../../../constants';
import { CURRENCY } from '../../../../shared/enums';
import { ProductModel } from '../../../../shared/models';
import {
  TabTitle,
  metaTagByDesc,
  metaTagByKey,
  metaTagByTitle,
  metaTagByWeb
} from '../../../../utils/generaltittlefunction';
import './styles.scss';

interface IEventProps {
  event: ProductModel;
}

export const Event: FC<IEventProps> = ({ event }) => {
  const { t } = useTranslation();

  TabTitle(t('Common.Home - Digital Music Shopping Market Place'));
  metaTagByTitle(t('Common.Home - Digital Music Shopping Market Place'));
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

  return (
    <div className="featured-event">
      <div className="featured-event-header">
        <Link to={`${ROUTES.PRODUCTS.PREFIX}/${event.id}`}>
          <h2 className="text-heading2 text--cyan">{event.name}</h2>
        </Link>
      </div>
      <hr />
      <div className="featured-event-body">
        <span className="text-body1">{event.categoryNames}</span>
        {/* <CartButton
          color="cyan"
          productId={event}
          productPrice={event.price as number}
          productCurrency={event.currency as CURRENCY}
        /> */}
      </div>
      <div className="featured-event-image">
        <div className={'image-content'}>
          <div className={'image-title'}>
            <h2 className="text-heading2 text--white">{event.name}</h2>
            <span className={'text-body1 text--white'}>{event.location}</span>
          </div>
          <span className={'image-location'}>{t("Home.Music-Store's Clubhouse- Metaverse")}</span>
        </div>
        <img src={event.getThumbnailUrl} alt="event" width={'100%'} height={'100%'} />
      </div>
    </div>
  );
};
