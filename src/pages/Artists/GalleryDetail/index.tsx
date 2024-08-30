import moment from 'moment';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { useParams } from 'react-router-dom';

import { ArtistApi, AuthApi, GalleryApi, ProductApi, UserApi } from '../../../apis';
import { Alert, AnimationOnScroll, Pagination, ProductCard } from '../../../components';
import { IArtist, IProduct, ISortOrder } from '../../../shared/interfaces';
import { IGallery } from '../../../shared/interfaces/gallery.interface';
import { ProductModel, UserModel } from '../../../shared/models';
import './styles.scss';
import { PRODUCT_TYPE } from '../../../shared/enums';
import { CommunityEventImageCard, PrimaryCard } from '../../../components/Card/BannerProductCard';
import { CommonProductCard } from '../../../components/Card/ProductCard';
import { SimpleGrid, Stack, useToast } from '@chakra-ui/core';
import { getProductRowNumber } from '../../../constants/breakpoint';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../../store/selectors';
import { setUser } from '../../../store/actions';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '../../../components/Button/PrimaryButton';
import { BiLogoFacebook, BiLogoInstagram, BiLogoSpotify } from 'react-icons/bi';
import { SiGooglechat } from 'react-icons/si';
import { LiaShareAltSolid } from 'react-icons/lia';

const CntPerPage = 15;

export const GalleryDetailPage: FC = () => {
  const [gallery, setGallery] = useState<IGallery>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageCnt, setPageCnt] = useState(0);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [totalCnt, setTotalCnt] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<ISortOrder>(ISortOrder.ASC);
  const [windowWidth, setWindowWidth] = useState<number>()
  const [productsToShow, setProductsToShow] = useState(3);
  const [artist, setArtist] = useState<IArtist>();
  const { galleryId, id } = useParams<{ galleryId: string, id: string }>();
  const user = useSelector(getUser);
  const [isSubscribed, setIsSubscribed] = useState<any>(false)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  useEffect(() => {
    const subscribed = user?.subscribedArtist?.includes(artist?._id as string)
    setIsSubscribed(subscribed)
  }, [user, artist])

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      setWindowWidth(windowWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setProductsToShow(getProductRowNumber(windowWidth))
  }, [windowWidth])
  const toast = useToast();
  const fetchUser = () => {
    AuthApi.me().then(res => {
      const user = new UserModel(res.user);
      if (user) {
        dispatch(setUser(user));
      }
    }).catch(e => console.log("e>", e))
  }


  const handleSubscribe = () => {
    if (user) {
      UserApi.toggleSubscribe({
        userId: user.id,
        artistId: artist?._id as string
      }).then(res => {
        fetchUser()
        setIsSubscribed(!isSubscribed)
        console.log("res>>", res)
      }
      ).catch(e => console.log("e>>>", e))
    } else {
      toast({
        position: 'top-right',
        render: ({ onClose }) => (
          <Alert message={t('Please login first')} onClose={onClose} />
        )
      });
    }
  }

  useEffect(() => {
    const subscribed = user?.subscribedArtist?.includes(id as string)
    setIsSubscribed(subscribed)
  }, [user])
  const fetchProducts = useCallback(() => {
    if (gallery) {
      ProductApi.readAll({
        query: {
          galleryId: gallery?.id,
        },
      })
        .then((res) => {
          const { products, pagination } = res;
          setProducts(products.map((product: IProduct) => new ProductModel(product)));
          setTotalCnt(pagination.total);
        })
        .catch((err) => {
          console.log('🚀 ~ file: index.tsx:91 ~ fetchProducts ~ err:', err);
        });
    }

  }, [pageNumber, sortOrder, gallery]);

  useEffect(() => {
    if (galleryId) fetchProducts();
  }, [galleryId, fetchProducts]);

  useEffect(() => {
    GalleryApi.getGalleriesByName(galleryId, {}).then(res => {
      GalleryApi.readById(res.gallery.id).then((res) => {
        setGallery(res.gallery);
      });
    })
    ArtistApi.read(id)
      .then((res) => {
        setArtist(res.artist);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [galleryId, id]);
  const filteredProduct = isSubscribed ? products : products.slice(0, productsToShow)
  return (
    <Stack w={'100%'} mt={'10%'} alignItems={'center'}>
      <Stack w={'90%'} height={400} borderRadius={20} background={'pink'} position={'relative'}>
        <img src={gallery?.thumbnail} style={{ width: '100%', height: '100%', borderRadius: 20 }} />
        <Stack position={'absolute'} background={'pink'} height={'50%'} w={'15%'} top={'70%'} left={'43%'} borderRadius={'100%'}>
          <img src={artist?.thumbnail} style={{ height: '100%', width: '100%', objectFit: 'cover', borderRadius: '50%' }} />
        </Stack>
      </Stack>
      <Stack mt={'7%'} w={'100%'} alignItems={'center'}>
        <Stack>
          <p className='text-heading3'>{gallery?.name}</p>
        </Stack>
        <Stack mt={10} mb={15} alignItems={'center'} alignSelf={'center'} width={'15%'} display={'flex'} justifyContent={'space-between'} flexDirection={'row'}>
          <BiLogoSpotify size={30} color={'rgba(84, 255, 201, 1)'} />
          <BiLogoFacebook size={30} color={'rgba(84, 255, 201, 1)'} />
          <BiLogoInstagram size={30} color={'rgba(84, 255, 201, 1)'} />
          <SiGooglechat size={30} color={'rgba(84, 255, 201, 1)'} />
          <LiaShareAltSolid size={30} color={'rgba(84, 255, 201, 1)'} />
        </Stack>
        <Stack mt={5}>
          <p className='text-heading3'>{gallery?.description}</p>
        </Stack>
      </Stack>
      <Stack width={'100%'} justifyContent={'center'} alignItems={'center'}>
      <SimpleGrid minChildWidth={[250, 300, 400]} mt={20} w={'90%'} justifyContent={'center'} spacing='40px'>
        {filteredProduct.map((product) => (
          <Stack h={[450, 450, 500, 550, 600]} alignItems={'center'}>
            {(product.type === PRODUCT_TYPE.VIDEOS || product.type === PRODUCT_TYPE.MERCHANDISE) ?
              <PrimaryCard details={product} />
              : product.type === PRODUCT_TYPE.VIRTUAL_EVENT ?
                <CommunityEventImageCard details={product} /> :
                <CommonProductCard product={product} />
            }
          </Stack>
        ))}
      </SimpleGrid>
      </Stack>
    </Stack>
  );
};
