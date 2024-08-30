import { Flex, Spinner, Stack, useToast } from '@chakra-ui/core';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { UserApi } from '../../../../apis';
import { Alert, AnimationOnScroll, ProductCard } from '../../../../components';
import { CommunityEventImageCard, PrimaryCard } from '../../../../components/Card/BannerProductCard';
import { CommonProductCard } from '../../../../components/Card/ProductCard';
import { PRODUCT_TYPE } from '../../../../shared/enums';
import { IProduct } from '../../../../shared/interfaces';
import { ProductModel } from '../../../../shared/models';
import { likedProducts } from '../../../../store/actions';
import { getLikedProducts } from '../../../../store/selectors';
import {
  TabTitle,
  metaTagByDesc,
  metaTagByKey,
  metaTagByTitle,
  metaTagByWeb
} from '../../../../utils/generaltittlefunction';
import './styles.scss';

export const LikedProductsTab: FC = () => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const toast = useToast();
  const favorites = useSelector(getLikedProducts);
  // Get dispatch from hook
  const dispatch = useDispatch();
  const fetchFavorites = useCallback(() => {
    setLoading(true);
    UserApi.getFavorites()
      .then((res) => {
        dispatch(likedProducts(res.favoriteProducts.map((product: IProduct) => new ProductModel(product))));
        setLoading(false);
      })
      .catch((err) => {
        toast({
          position: 'top-right',
          render: ({ onClose }) => <Alert message={err.msg} color="red" onClose={onClose} />
        });
      })
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  TabTitle('Liked Products - Digital Music Shopping Market Place');
  metaTagByTitle('Liked Products - Digital Music Shopping Market Place');
  metaTagByDesc(
    'Music-Store is founded on values we all share and are ready to stand for. They bring us together well beyond our current products and technologies. They’ve defined our identity since the beginning, and they’ll continue to do so, no matter how our business evolves.'
  );
  metaTagByKey('Music-Store, Nft, Hackers, Explore Through the Most Exciting Music NFT');
  metaTagByWeb(`https://dev.music-store.io${window.location.pathname}`);

  return (
    <>
      {isLoading ? (
        <Flex justifyContent="center" alignItems="center" height={200}>
          <Spinner color="#00Ff00" size="xl" />
        </Flex>
      ) : (
        <div className="liked-products-tab">
          {favorites?.map((item: ProductModel) => {
            return (
              <Stack h={[450, 450, 500, 550, 600]} alignItems={'center'}>
                {item.type === PRODUCT_TYPE.VIDEOS || item.type === PRODUCT_TYPE.MERCHANDISE ? (
                  <PrimaryCard details={item} />
                ) : item.type === PRODUCT_TYPE.VIRTUAL_EVENT ? (
                  <CommunityEventImageCard details={item} />
                ) : (
                  <CommonProductCard product={item} />
                )}
              </Stack>
            );
          })}
        </div>
      )}
    </>
  );
};
