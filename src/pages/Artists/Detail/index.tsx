import { Flex, SimpleGrid, Stack, useToast } from '@chakra-ui/core';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { ArtistApi, AuthApi, GalleryApi, ProductApi, SocialApi, UserApi } from '../../../apis';
import { Alert } from '../../../components';
import { IArtist, ISocial } from '../../../shared/interfaces';
import './styles.scss';
import { CardSocialDescription, CommunityEventImageCard, PrimaryCard } from '../../../components/Card/BannerProductCard';
import { ArtistAnnouncementCard, ArtistBannerCard, ArtistThreadCard, ArtistVideoCard } from '../../../components/Card/ArtistCard';
import { PrimaryButton } from '../../../components/Button/PrimaryButton';
import { CommonCardOutlet } from '../../../components/Card/CommonCardOutlet';
import { ProductModel, UserModel } from '../../../shared/models';
import { PRODUCT_TYPE } from '../../../shared/enums';
import { useDispatch, useSelector } from 'react-redux';
import { getFavorites, getLikedProducts, getUser } from '../../../store/selectors';
import { setUser } from '../../../store/actions';
import twitter from '../../../assets/icons/X.png'
import { getProductRowNumber } from '../../../constants/breakpoint';
import { IGallery } from '../../../shared/interfaces/gallery.interface';
import { venueData } from '../../../utils/mockData';
import { VenueVideoBannerCard } from '../../../components/Card/VenueCard';
import { IoChevronForwardSharp } from 'react-icons/io5';
import { CommonProductCard } from '../../../components/Card/ProductCard';
import moment from 'moment';
export const SocialType = {
  Video : 'video',
  Announcement: 'announcement',
}
const tabData = [
  {
    value: 0,
    label: 'Overview',
    status: 'Overview'
  },
  {
    value: 1,
    label: 'Galleries',
    status: 'Galleries'
  },
  {
    value: 2,
    label: 'Event Tickets',
    status: 'Event Tickets'
  },
  {
    value: 3,
    label: 'Favourited',
    status: 'Favourited'
  },
  {
    value: 4,
    label: 'Social',
    status: 'Social'
  },
  {
    value: 5,
    label: 'Content',
    status: 'Content'
  },

];

export const ArtistDetailPage: FC = () => {
  const [artist, setArtist] = useState<IArtist>();
  const [socialContent, setSocialContent] = useState<ISocial[]>([])
  const [galleries, setGalleries] = useState([]);
  const [products, setProducts] = useState<ProductModel[]>([])
  const [tabId, setTabId] = useState<number>(0);
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [windowWidth, setWindowWidth] = useState<number>()
  const [productsToShow, setProductsToShow] = useState(3); // Default number of products to show
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const user = useSelector(getUser)
  const likedProduct = useSelector(getLikedProducts)
  const dispatch = useDispatch()

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

  const fetchProduct = useCallback((id) => {
    GalleryApi.getGalleriesByArtist(id, {})
      .then((res) => {
        setGalleries(res.galleries);
      })
      .catch((err) => {
        console.log(err);
      });
    ProductApi.readAll({ query: { artistId: id } }).then(res => setProducts(res.products))
  }, []);

  useEffect(() => {
    if (artist) {
      fetchProduct(artist?._id);
      if (user) {
        const isExists = user?.subscribedArtist?.includes(artist?._id as string)
        setIsSubscribed(isExists ? isExists : false)
      }
      SocialApi.readAllByArtist(artist?._id).then(res =>setSocialContent(res.SocialContent))
    }
  }, [user, artist]);

  useEffect(() => {
    ArtistApi.read(id)
      .then((res) => {
        setArtist(res.artist);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

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
        artistId: artist?.id as string
      }).then(res => {
        if (res) {
          fetchUser()
          setIsSubscribed(!isSubscribed)
        }
      }).catch(e => console.log("e>>>", e))
    } else {
      toast({
        position: 'top-right',
        render: ({ onClose }) => (
          <Alert message={t('Please login first')} onClose={onClose} />
        )
      });
    }
  }
  const galleryAddress: any = []
  galleries.map((gallery: IGallery) => {
    if (gallery.isPublic) {
      galleryAddress.push(gallery.id)
    }
  })
  const filteredGalleries = isSubscribed ? galleries : galleries.filter((gallery: IGallery) => gallery.isPublic)
  const filteredProduct: ProductModel[] = isSubscribed ? products : products.filter((p: any) => galleryAddress.includes(p?.galleryId as string)).slice(0, productsToShow)
  const filteredEventProduct = isSubscribed ? products.filter(item => item.type === PRODUCT_TYPE.VIRTUAL_EVENT) : products.filter(p => galleryAddress.includes(p?.galleryId as string)).filter(item => item.type === PRODUCT_TYPE.VIRTUAL_EVENT).slice(0, productsToShow)
  return (
    <div className="artist-detail-page">
      <div className="artist-hero-container">
        <div className="left-container">
          <CardSocialDescription
            title={artist?.name}
            description={artist?.bio}
            isArtistPage={true} />
          <PrimaryButton mt={5} fontSize={18} scheme={'primary'} onClick={handleSubscribe}>{isSubscribed ? 'Unsubscribe' : 'Subscribe'}</PrimaryButton>
        </div>
        <div className="right-container">
          <Stack w={'100%'} h={[300, 350, 350, 450, 550, 700]}>
            <ArtistBannerCard image={artist?.thumbnail} />
          </Stack>
        </div>
      </div>
      <div className='tab-button-container'>
        {tabData.map(item => {
          return (
            <PrimaryButton mx={'3%'} fontSize={18} scheme={item.value === tabId ? 'primary' : 'basic'} onClick={() => setTabId(item.value)}><p className='text-body1' style={{ textTransform: 'uppercase' }}>{item.label}</p></PrimaryButton>
          )
        })}
      </div>
      <div className='tab-content-container'>
        {tabId === 0 && <OverviewProductTab products={filteredProduct} isSubscribed={isSubscribed} handleSubscribe={handleSubscribe} />}
        {tabId === 1 && artist && <GalleryTab artist ={artist} galleries={filteredGalleries} isSubscribed={isSubscribed} handleSubscribe={handleSubscribe} />}
        {tabId === 2 && <EventTab eventProduct={filteredEventProduct} isSubscribed={isSubscribed} handleSubscribe={handleSubscribe} />}
        {tabId === 3 && <LikedProductTab products={likedProduct} isSubscribed={isSubscribed} handleSubscribe={handleSubscribe} />}
        {tabId === 4 && <SocialSection data={socialContent}/>}
        {tabId === 5 && <ContentSection data={socialContent}/>}
      </div>
    </div>
  );
};

interface ILikedProductTab {
  products: ProductModel[];
  isSubscribed: boolean;
  handleSubscribe: any
}
const LikedProductTab = ({ products, isSubscribed, handleSubscribe }: ILikedProductTab) => {
  return (
    isSubscribed ? <div className='galleries'>
      {products.map((product) => (
        <Stack h={[450, 450, 500, 550, 600]} alignItems={'center'}>
          {(product.type === PRODUCT_TYPE.VIDEOS || product.type === PRODUCT_TYPE.MERCHANDISE) ?
            <PrimaryCard details={product} isHome={true} />
            : product.type === PRODUCT_TYPE.VIRTUAL_EVENT ?
              <CommunityEventImageCard details={product} isHome={true} /> :
              <CommonProductCard product={product} isHome={true} />
          }
        </Stack>
      ))}
    </div> :
      <Stack w='100%' mt={'5%'} alignItems={'center'} bg={'grey.400'}>
        <h1 className='text-heading3'>
          Subscribe the artist to see the product
        </h1>
        <PrimaryButton scheme="primary" mt={5} onClick={handleSubscribe}>
          Subscribe
        </PrimaryButton>
      </Stack>

  )
}
const OverviewProductTab = ({ products, isSubscribed, handleSubscribe }: ILikedProductTab) => {
  return (
    <Stack justifyContent={'center'} width={'100%'} alignItems={'center'}>
      <div className='galleries'>
        {products.map((product) => (
          <Stack h={[450, 450, 500, 550, 600]} alignItems={'center'}>
            {(product.type === PRODUCT_TYPE.VIDEOS || product.type === PRODUCT_TYPE.MERCHANDISE) ?
              <PrimaryCard details={product} isHome={true}/>
              : product.type === PRODUCT_TYPE.VIRTUAL_EVENT ?
                <CommunityEventImageCard details={product} isHome={true} /> :
                <CommonProductCard product={product} isHome={true} />
            }
          </Stack>
        ))}
      </div>
      {!isSubscribed && <Stack w='100%' mt={'5%'} alignItems={'center'} bg={'grey.400'}>
        <h1 className='text-heading3'>
          Do you want to see this artist digital assets
        </h1>
        <PrimaryButton scheme="primary" mt={5} onClick={handleSubscribe}>
          Subscribe
        </PrimaryButton>
      </Stack>}
    </Stack>

  )
}
interface IEventTab {
  eventProduct: ProductModel[];
  isSubscribed: boolean;
  handleSubscribe: any
}
const EventTab = ({ eventProduct, isSubscribed, handleSubscribe }: IEventTab) => {
  const { t } = useTranslation();
  return (
    <Stack w={'100%'}>
      <div className='galleries'>
        {eventProduct.filter(item => item.type === PRODUCT_TYPE.VIRTUAL_EVENT).map((product) => (
          <Stack h={[450, 450, 500, 550, 600]}>
            <CommunityEventImageCard details={product} isHome={true}/>
          </Stack>
        ))}
      </div>
      {!isSubscribed && <Stack w='100%' mt={'5%'} alignItems={'center'} bg={'grey.400'}>
        <h1 className='text-heading3'>
          {t("Do you want to see this artist digital assets")}
        </h1>
        <PrimaryButton scheme="primary" mt={5} onClick={handleSubscribe}>
          Subscribe
        </PrimaryButton>
      </Stack>}
    </Stack>
  )
}
interface IGalleryTav {
  galleries: IGallery[];
  isSubscribed: boolean;
  handleSubscribe: any;
  artist: IArtist
}
const GalleryTab = ({ galleries, isSubscribed, handleSubscribe, artist }: IGalleryTav) => {
  const { t } = useTranslation();
  return (
    <Stack justifyContent={'center'} width={'100%'} alignItems={'center'}>
      <div className='galleries'>
        {galleries.map(({ id, name, galleryURLId, thumbnail }, index) => (
          <Stack h={[250, 250, 300, 400, 500]}>
            <CommonCardOutlet image={thumbnail} id={galleryURLId as string} artistId={artist.artistURLId} productType={'gallery'} type="collection">
              <Stack h={'100%'} w='100%'>
                <Stack w='100%' display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                  <Stack w='50%'> <p className='text-body1'>{name}</p> </Stack>
                </Stack>
              </Stack>
            </CommonCardOutlet>
          </Stack>
        ))}
      </div>
      {!isSubscribed && <Stack w='100%' mt={'5%'} alignItems={'center'} bg={'grey.400'}>
        <h1 className='text-heading3'>
          {t("Do you want to see this artist Collections")}
        </h1>
        <PrimaryButton scheme="primary" mt={5} onClick={handleSubscribe}>
          Subscribe
        </PrimaryButton>
      </Stack>}
    </Stack>
  )
}
const ContentSection = ({data}:ISocialSection) => {
  const instagramContent = data.filter(item=>(item.contentType === SocialType.Announcement && item.publishOnSocialMedia === false))
  const youtubeContent = data.filter(item=>(item.contentType === SocialType.Video && item.publishOnSocialMedia === false))
  return (
    <Stack w={'100%'} height={'100%'} alignItems={'center'}>
      <p className='text-heading3'> Announcements </p>
      { instagramContent.length > 0 &&
      <Stack w={'100%'} alignItems={'center'}>
        <SimpleGrid minChildWidth={[200, 250, 270]} w={'100%'} alignItems={'center'} spacing='40px'>
          {/* {venueData.map(item => <ArtistAnnouncementCard image={item.featuredImage} date={'22-12-2332'} title={item.name} description={item.description} />)} */}
          {instagramContent.map(item => <ArtistAnnouncementCard image={item.thumbnail?.url} date={moment(item.createdAt).format("DD-MM-YYYY")} title={item.title} description={item.statement} />)}
        </SimpleGrid>
        <PrimaryButton mt={60} scheme='secondary' rightIcon={<IoChevronForwardSharp />}>Load More</PrimaryButton>
      </Stack>}
      <Flex w={'100%'} mt={'7rem'}>
       { youtubeContent.length > 0 && <VenueVideoBannerCard video={youtubeContent[0].video.url} title={youtubeContent[0].title} description={youtubeContent[0].statement} />}
      </Flex>
      
      <Stack w={'100%'} marginTop={'7rem'} alignItems={'center'}>
        <p className='text-heading3'> More from Artist </p>
        { youtubeContent.length > 0 &&  <SimpleGrid minChildWidth={[200, 250, 270]} mt={10} alignItems={'center'} w={'100%'} spacing='40px'>
          {/* {venueData.map(item => <ArtistVideoCard video={item.featuredVideo} date={'22-12-2332'} title={item.name} description={item.description} />)} */}
          {youtubeContent.map(item => <ArtistVideoCard video={item.video.url} date={moment(item.createdAt).format("DD-MM-YYYY")} title={item.title} description={item.statement} />)}
        </SimpleGrid>}
        { youtubeContent.length > 0 &&<PrimaryButton mt={60} scheme='secondary' rightIcon={<IoChevronForwardSharp />}>Load More</PrimaryButton>}
      </Stack>
    </Stack>
  )
}
interface ISocialSection {
  data: ISocial[];
}
const SocialSection = ({data}:ISocialSection) => {
  const instagramContent = data.filter(item=>(item.contentType === SocialType.Announcement && item.publishOnSocialMedia === true))
  const youtubeContent = data.filter(item=>(item.contentType === SocialType.Video && item.publishOnSocialMedia === true))

  return (
    <Stack w={'100%'} height={'100%'} alignItems={'center'}>
      <p className='text-heading3'> Instagram </p>
      {instagramContent.length > 0 ? <Stack w={'100%'} alignItems={'center'}>
        <SimpleGrid minChildWidth={[200, 250, 270]} alignItems={'center'} w={'100%'} spacing='40px'>
          {instagramContent.map(item => <ArtistAnnouncementCard image={item.thumbnail?.url} date={moment(item.createdAt).format("DD-MM-YYYY")} title={item.title} description={item.statement} />)}
        </SimpleGrid>
        <PrimaryButton mt={60} scheme='secondary' rightIcon={<IoChevronForwardSharp />}>Load More</PrimaryButton>
      </Stack>:   <p className='text-body1'> Not Data found </p>}
      <Stack w={'100%'} marginTop={'7rem'} alignItems={'center'}>
        <p className='text-heading3'> YouTube </p>
        {instagramContent.length > 0 && <SimpleGrid minChildWidth={[200, 250, 270]} mt={20} w={'100%'} alignItems={'center'} spacing='40px'>
          {youtubeContent.map(item => <ArtistVideoCard video={item.video.url} date={moment(item.createdAt).format("DD-MM-YYYY")} title={item.title} description={item.statement} />)}
        </SimpleGrid>}
        {instagramContent.length > 0 && <PrimaryButton mt={60} scheme='secondary' rightIcon={<IoChevronForwardSharp />}>Load More</PrimaryButton>}
        {instagramContent.length === 0 &&  <p className='text-body1'> Not Data found </p>}

      </Stack>
      <Stack w={'100%'} marginTop={'7rem'} alignItems={'center'}>
        <img src={twitter} />
        <SimpleGrid minChildWidth={[200, 250, 300]} mt={20} w={'100%'} justifyContent={'center'} spacing='40px'>
          {venueData.map(item => <ArtistThreadCard />)}
        </SimpleGrid>
        <PrimaryButton mt={60} scheme='secondary' rightIcon={<IoChevronForwardSharp />}>Load More</PrimaryButton>
      </Stack>
    </Stack>
  )
}