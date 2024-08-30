// Dependencies
import { Button, Tooltip, useToast } from '@chakra-ui/core';
import classnames from 'classnames';
import React, { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// Components
import { Alert, CartButton, Icon, IconButton, ObjectRender } from '..';
// Apis
import { ProductApi } from '../../apis';
// Constants
import { ROUTES } from '../../constants';
// Interfaces
import { CURRENCY, PRODUCT_TYPE } from '../../shared/enums';
import { ProductModel } from '../../shared/models';
// Store
import { toggleFavorite } from '../../store/actions';
import { getFavorites, getUser } from '../../store/selectors';
// Styles
import './styles.scss';

interface IProductCardProps {
  product: ProductModel;
  productCurrency?: string;
  btnLayout?: string | null;
}

// Export product-card component
export const ProductCard: FC<IProductCardProps> = ({
  productCurrency,
  btnLayout = null,
  product,
  product: { id, name, price, thumbnail, currency, type, getThumbnailUrl, categoryNames, object, isAuction }
}) => {
  // States
  const [openShare, setOpenShare] = useState<boolean>(false);

  // Get toast from hook
  const toast = useToast();
  const { t } = useTranslation();

  // Get dispatch from hook
  const dispatch = useDispatch();

  // Get user from store
  const user = useSelector(getUser);

  // Get favorite from store
  const favorites = useSelector(getFavorites);

  // Check favorite
  const isFavorite = useMemo(() => favorites?.includes(id as string), [favorites, id]);

  // Toggle favorite handler
  const handleToggleFavorite = () => {
    if (user) {
      ProductApi.toggleFavorite({
        fingerprint: user.id,
        productId: id as string
      })
        .then(() => {
          if (isFavorite) {
            toast({
              position: 'top-right',
              render: ({ onClose }) => (
                <Alert message={t('Message.Removed from your favorite products!')} color="yellow" onClose={onClose} />
              )
            });
          } else {
            toast({
              position: 'top-right',
              render: ({ onClose }) => (
                <Alert message={t('Message.Successfully added to favorite products')} onClose={onClose} />
              )
            });
          }
          dispatch(toggleFavorite(id as string));
        })
        .catch((err) => {
          toast({
            position: 'top-right',
            render: ({ onClose }) => <Alert message={err.msg} color="red" onClose={onClose} />
          });
        });
    } else {
      toast({
        position: 'top-right',
        render: ({ onClose }) => (
          <Alert message={t('Message.Login to the platform first!')} color="cyan" onClose={onClose} />
        )
      });
    }
  };

  // Open share option handler
  const handleOpenShare = () => {
    setOpenShare(true);
  };

  // Close share option handler
  const handleCloseShare = () => {
    setOpenShare(false);
  };
  let route;
  if (type === PRODUCT_TYPE.IMAGES) {
    route = ROUTES.IMAGES.INDEX;
  } else if (type === PRODUCT_TYPE.VIRTUAL_EVENT) {
    route = ROUTES.EVENTS.INDEX;
  } else if (type === PRODUCT_TYPE.SONG) {
    route = ROUTES.SONGS.INDEX;
  } else if (type === PRODUCT_TYPE.MERCHANDISE) {
    route = ROUTES.MERCHANDISE.INDEX;
  } else if (type === PRODUCT_TYPE.OBJECT) {
    route = ROUTES.OBJECTS.INDEX;
  } else if (type === PRODUCT_TYPE.VIDEOS) {
    route = PRODUCT_TYPE.VIDEOS;
  } else if (type === PRODUCT_TYPE.ALL) {
    route = ROUTES.SHOP.INDEX;
  } else {
    route = PRODUCT_TYPE.IMAGES;
  }
  // Return product-card component
  return (
    <div
      className={classnames('d-product-card', {
        'd-product-card--event': type === PRODUCT_TYPE.VIRTUAL_EVENT,
        'd-product-card--share': openShare
      })}
    >
      {openShare ? (
        <>
          <IconButton icon="share-active" className="close-share-button" onClick={handleCloseShare} />
          <h3 className="text-heading3 text--lime text--center product-share-title">{t('Common.Share')}</h3>
          <div className="product-share-url">
            <span className="text-body2">{`https:/www.music-store.com${ROUTES.PRODUCTS.PREFIX}/${id}`}</span>
            <Icon name="copy" />
          </div>
          <div className="product-share-actions">
            <Button leftIcon={() => <Icon name="facebook" />} className="d-outlined-button" isFullWidth>
              {t('Common.Facebook')}
            </Button>
            <Button leftIcon={() => <Icon name="twitter" />} className="d-outlined-button" isFullWidth>
              {t('Common.Twitter')}
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="product-card-actions">
            <IconButton
              icon="heart"
              className={classnames('favorite-button', {
                'favorite-button--active': isFavorite
              })}
              onClick={handleToggleFavorite}
            />
            <Tooltip aria-label="Share" label="Share">
              <IconButton icon="share" onClick={handleOpenShare} />
            </Tooltip>
          </div>
          <Link className="product-card-image" to={`${ROUTES.PRODUCTS.PREFIX}/${id}`}>
            {object ? (
              <ObjectRender id={id} fieldname={object.fieldname} filename={object.filename} />
            ) : (
              <img src={getThumbnailUrl ? getThumbnailUrl : thumbnail?.url} alt={thumbnail?.filename} />
            )}
          </Link>
          <div className="product-card-details">
            <Link
              className={classnames('product-name text-heading4 text--lime text--center text--no-underline', {
                'text--cyan': type === 'virtual_event'
              })}
              to={`${ROUTES.PRODUCTS.PREFIX}/${id}`}
            >
              {name}
            </Link>
            <p className={classnames('category-name text-body1')}>{categoryNames}</p>

            {btnLayout === 'NFT' ? (
              <Button className="d-button" type="submit">
                send to your email
              </Button>
            ) : (
              <CartButton
                color={type === 'virtual_event' ? 'cyan' : 'lime'}
                product={product}
                productPrice={price as number}
                productCurrency={currency as CURRENCY}
                currency={productCurrency}
                isAuction={isAuction}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};
