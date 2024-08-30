import { Avatar, Stack, useToast } from '@chakra-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { CartApi } from '../../../apis';
import { Alert, IconButton } from '../../../components';
import { ROUTES } from '../../../constants';
import { ProductModel } from '../../../shared/models';
import { addToCart } from '../../../store/actions';
import { getUser } from '../../../store/selectors';
import './styles.scss';
import { PRODUCT_TYPE } from '../../../shared/enums';

interface IProductProps {
  product: ProductModel;
}

const Product: React.FC<IProductProps> = ({ product }) => {
  const dispatch = useDispatch();

  const toast = useToast();
  const { t } = useTranslation();

  const user = useSelector(getUser);

  const handleRemove = (product: ProductModel) => {
    if (user) {
      CartApi.removeFromCart({
        productId: product.id as string,
        fingerprint: user.id,
        userId: user.id
      }).then((res) => {
        dispatch(addToCart(res.cart));
        toast({
          position: 'top-right',
          render: ({ onClose }) => (
            <Alert
              message={t('Message.Product was removed from your cart!', { Product: product.name })}
              onClose={onClose}
            />
          )
        });
      });
    }
  };
  let route
  if (product.type === PRODUCT_TYPE.IMAGES) {
    route = ROUTES.IMAGES.INDEX
  } else if (product.type === PRODUCT_TYPE.VIRTUAL_EVENT) {
    route = ROUTES.EVENTS.INDEX
  } else if (product.type === PRODUCT_TYPE.SONG) {
    route = ROUTES.SONGS.INDEX
  } else if (product.type === PRODUCT_TYPE.MERCHANDISE) {
    route = ROUTES.MERCHANDISE.INDEX
  } else if (product.type === PRODUCT_TYPE.OBJECT) {
    route = ROUTES.OBJECTS.INDEX
  } else if (product.type === PRODUCT_TYPE.VIDEOS) {
    route = PRODUCT_TYPE.VIDEOS
  } else if (product.type === PRODUCT_TYPE.ALL) {
    route = ROUTES.SHOP.INDEX
  } else {
    route = PRODUCT_TYPE.IMAGES
  }
  return (
    <div className="cart-product">
      <div className="content-1">
        <Link to={`${route}/${product.artistDetails?.artistURLId}`}>
          <Avatar className="product-image" src={product.thumbnail.url} />
        </Link>
        <Link to={`${route}/${product.productURLId}`}>
          <Stack>
          <span className="text-heading4 product-name">{product.name}</span>
          {product.selectedFeatures?.length > 0 && (
            <div>
              {product.selectedFeatures.map((item: any, index: number) => (
                <div key={index}>
                  {Object.entries(item).map(([key, value]) => (
                    <p key={key} style={{ color: 'white' }}>
                      {key}: {value}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          )}
          </Stack>
        </Link>
      </div>
      <div className="content-2">
        <span className="text-heading4 product-price">{product.currency}{product.price}</span>
        <IconButton icon="remove" className="remove-button" onClick={() => handleRemove(product)} />
      </div>
    </div>
  );
};

export default Product;
