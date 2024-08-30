import { Stack } from '@chakra-ui/core';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronForwardOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useHistory } from 'react-router-dom';

import { ArticleApi, GalleryApi } from '../../apis';
import { Heart, Use, UserAdd, WebDesign } from '../../assets/icons';
import Exodus from '../../assets/images/Exudos.png';
import MetaMask from '../../assets/images/MetaMask.png';
import Safepal from '../../assets/images/SafePal.png';
import TrustWallet from '../../assets/images/TrustWallet.png';
import WalletConnect from '../../assets/images/WalletConnect.png';
import { VenueStage, Video } from '../../assets/video';
import { AutoScrollTag, HeroHomeBanner, IconLinkSection } from '../../components/Banner';
import { ArticleCard } from '../../components/Card/ArticleCard';
import {
  CardSocialDescription,
  CommunityEventDescriptionCard,
  CommunityEventImageCard,
  PrimaryCard
} from '../../components/Card/BannerProductCard';
import { VenueVideoBannerCard } from '../../components/Card/VenueCard';
import { DiscoverSection } from '../../components/DiscoverSection';
import { REACT_APP_API_ASSET_SERVER, ROUTES } from '../../constants';
import { PRODUCT_TYPE } from '../../shared/enums';
import { IArticle } from '../../shared/interfaces';
import { ProductModel } from '../../shared/models';
import { getProducts } from '../../store/selectors';
import { TabTitle, metaTagByDesc, metaTagByKey, metaTagByTitle, metaTagByWeb } from '../../utils/generaltittlefunction';
import './styles.scss';

const ChainList = [TrustWallet, WalletConnect, Safepal, MetaMask, Exodus];
const LinkList = [
  {
    icon: <UserAdd />,
    title: 'Sign Up',
    description: 'Digital Asset are unique assets stored and tradable on a blockchain. '
  },
  {
    icon: <WebDesign />,
    title: 'Collect',
    description: 'Digital Asset are unique assets stored and tradable on a blockchain. '
  },
  {
    icon: <Use />,
    title: 'Events',
    description: 'Digital Asset are unique assets stored and tradable on a blockchain. '
  },
  {
    icon: <Heart color="white" />,
    title: 'Subsribe',
    description: 'Digital Asset are unique assets stored and tradable on a blockchain. '
  }
];

export const HomePage: FC = () => {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [collection, setCollection] = useState<any>([]);
  const history = useHistory();
  const { t } = useTranslation();
  const products: ProductModel[] = useSelector(getProducts);
  useEffect(() => {
    GalleryApi.readAllGalleries({}).then((r) => setCollection(r.galleries));
  }, []);

  useEffect(() => {
    ArticleApi.readAll({
      query: {
        $and: [{ status: 'Published' }, { isFeatured: true }]
      },
      options: {
        sort: {
          updatedAt: 'desc'
        }
      }
    })
      .then((res) => {
        setArticles(res.articles);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  if (history.location.pathname === ROUTES.HOME) {
    TabTitle(t('Common.Home - Digital Music Shopping Market Place'));
  }
  if (history.location.pathname === ROUTES.HOME) {
    metaTagByTitle(t('Common.Home - Digital Music Shopping Market Place'));
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
  return (
    <div className="home-container">
      <div className="home-gradiant-1" />
      <div className="home-gradiant-2" />
      <div className="home-gradiant-3" />
      <div className="hero-container">
        <video
          src={Video}
          style={{ height: 'fit-content', width: '100%' }}
          controls={false}
          autoPlay={true}
          loop={true}
          muted={true}
        />
        <div className="left-container">
          <HeroHomeBanner
            hero
            heading={t('Home.Engage with your Favorite Artist in Web3')}
            subHeading={t(
              'Home.Music Digital Asset will continue to revolutionize the way that artists and fans create community together as we enter the upcoming year — undoubtedly changing the trajectory of countless budding music careers'
            )}
            basicButtonText={t('Common.Discover More')}
            basicRightIcon={<IoChevronForwardOutline />}
            onBasicClick={() => history.push(ROUTES.SHOP.INDEX)}
          />
        </div>
      </div>
      <div className="scroll-container">
        <AutoScrollTag />
      </div>
      <div className="supported-chain">
        {ChainList.map((item) => {
          return (
            <div className="image-container">
              <img src={item} />
            </div>
          );
        })}
      </div>
      <div className="club-house-section">
        <div className="left-container">
          <HeroHomeBanner
            heading={t('Home.Explore our Event Venues')}
            subHeading={t('Home.Meet Music Clubhouse details')}
            basicButtonText={t('Common.Clubhouse')}
            secondaryrButtonText={t('Common.Event List')}
            onSecondaryClick={() => history.push(ROUTES.EVENTS.INDEX)}
            onBasicClick={() => history.push(ROUTES.VENUES.INDEX)}
            secondaryRightIcon={<IoChevronForwardOutline />}
            basicRightIcon={<IoChevronForwardOutline />}
          />
        </div>
        <div className="right-container">
          <VenueVideoBannerCard video={VenueStage} isContent={false} />

          {/* <div className='card'> */}
          {/* <RoundCrousal images={images} /> */}
          {/* </div> */}
        </div>
      </div>
      <div className="link-section">
        <div className="gradiant-link" />
        <div className="gradiant-link-circle" />
        {LinkList.map((item) => {
          return <IconLinkSection icon={item.icon} title={item.title} description={item.description} />;
        })}
      </div>
      <div className="nft-section">
        <div className="left-section">
          <Carousel
            showArrows={false}
            autoPlay={true}
            infiniteLoop={true}
            className="carousel-container"
            showIndicators={false}
            showStatus={false}
          >
            {products.slice(0, 4).map((product) => (
              <Stack h={[450, 450, 500, 550, 600]}>
                <PrimaryCard details={product} isHome={true} />
              </Stack>
            ))}
          </Carousel>
          {/* <div className="nft-card-left-section">
                        <div className="nft-card-section">
                            <CollectionCardHome image={`${REACT_APP_API_ASSET_SERVER}/${products[0]?.thumbnail?.fieldname}/${products[0]?.thumbnail?.filename}`} collectionName={products[0]?.name} price={products[0]?.price as any} id={products[0]?.productURLId as string} currency={products[0]?.currency} />
                        </div>
                        <div className="nft-card-section" style={{ marginLeft: "15%" }}>
                            <CollectionCardHome image={`${REACT_APP_API_ASSET_SERVER}/${products[1]?.thumbnail?.fieldname}/${products[1]?.thumbnail?.filename}`} collectionName={products[1]?.name} price={products[1]?.price as any} id={products[1]?.productURLId as string} currency={products[0]?.currency} />
                        </div>
                    </div>
                    <div className="nft-card-right-section">
                        <div className="nft-card-section">
                            <CollectionCardHome image={`${REACT_APP_API_ASSET_SERVER}/${products[2]?.thumbnail?.fieldname}/${products[2]?.thumbnail?.filename}`} collectionName={products[2]?.name} price={products[2]?.price as any} id={products[2]?.productURLId as string} currency={products[0]?.currency} />
                        </div>
                        <div className="nft-card-section" style={{ marginLeft: "15%" }}>
                            <CollectionCardHome image={`${REACT_APP_API_ASSET_SERVER}/${products[3]?.thumbnail?.fieldname}/${products[3]?.thumbnail?.filename}`} collectionName={products[3]?.name} price={products[3]?.price as any} id={products[3]?.productURLId as string} currency={products[0]?.currency} />
                        </div>
                    </div> */}
        </div>
        <div className="right-section">
          <HeroHomeBanner
            heading={t('Home.Buy your favorite Artists Merchandise')}
            subHeading={t('Home.Collect Digital Asset your favourite Music detail')}
            basicButtonText={t('Home.Join for Free')}
            secondaryrButtonText={t('Home.Explore')}
            onSecondaryClick={() => history.push(ROUTES.SHOP.INDEX)}
            onBasicClick={() => history.push(ROUTES.AUTH.SIGN_IN)}
            secondaryRightIcon={<IoChevronForwardOutline />}
            basicRightIcon={<IoChevronForwardOutline />}
          />
        </div>
      </div>
      {/* <div className="web-asset-container">
                    <Web3Asset />
                </div> */}
      <Stack w={'90%'} alignItems={'start'}>
        <h1 className="text-heading1">{t('Common.News & Articles')}</h1>
      </Stack>
      <div className="article-section">
        {articles.slice(0, 3).map((item: IArticle) => {
          return (
            <div className="card" onClick={() => history.push(ROUTES.ARTICLE.DETAIL.replace(':id', item.id))}>
              <ArticleCard
                image={`${REACT_APP_API_ASSET_SERVER}/${item.thumbnail?.fieldname}/${item.thumbnail?.filename}`}
                date="56/23/23"
                title={item.title}
                description={item.description}
                id={item.id}
              />
            </div>
          );
        })}
      </div>

      {/* <div className="crypto-art-container crypto-art-container-video">
                <div className="left-container">
                    <div className='card'>
                        <PrimaryCard details={products.filter(product => product.type === PRODUCT_TYPE.IMAGES)[0]} isHome={true} />
                    </div>
                </div>
                <div className="right-container">
                    <CardSocialDescription
                        tags={products.filter(product => product.type === PRODUCT_TYPE.IMAGES)[0]?.category.map((cat) => cat.name)}
                        sign={products.filter(product => product.type === PRODUCT_TYPE.IMAGES)[0]?.sign?.url}
                        // title={t("Common.Discover our Artists")}
                        artistDetails={products.filter(product => product.type === PRODUCT_TYPE.IMAGES)[0]?.artistDetails}
                        subTitle={products.filter(product => product.type === PRODUCT_TYPE.IMAGES)[0]?.name}
                        description={products.filter(product => product.type === PRODUCT_TYPE.IMAGES)[0]?.description} />
                </div>
            </div> */}
      <div className="crypto-art-container">
        <div className="right-container">
          <CommunityEventDescriptionCard
            tags={['Digital Asset']}
            onViewClick={() => {
              history.push(
                `${ROUTES.EVENTS.INDEX}/${
                  products.filter((product) => product.type === PRODUCT_TYPE.VIRTUAL_EVENT)[0]?.productURLId
                }`
              );
            }}
            artistDetails={products.filter((product) => product.type === PRODUCT_TYPE.VIRTUAL_EVENT)[0]?.artistDetails}
            title={t('Common.Community Event')}
            subTitle={products.filter((product) => product.type === PRODUCT_TYPE.VIRTUAL_EVENT)[0]?.description}
            description={products.filter((product) => product.type === PRODUCT_TYPE.VIRTUAL_EVENT)[0]?.description}
          />
        </div>
        <div className="left-container">
          <div className="card">
            <CommunityEventImageCard
              details={products.filter((product) => product.type === PRODUCT_TYPE.VIRTUAL_EVENT)[0]}
              isHome={true}
            />
          </div>
        </div>
      </div>
      {/* <div className="crypto-art-container crypto-art-container-video">
                <div className="left-container">
                    <div className='card'>
                        <PrimaryCard details={products.filter(product => product.type === PRODUCT_TYPE.MERCHANDISE)[0]} isHome={true} />
                    </div>
                </div>
                <div className="right-container">
                    <CardSocialDescription
                        tags={products?.filter(product => product.type === PRODUCT_TYPE.MERCHANDISE)[0]?.category.map((cat) => cat.name)}
                        sign={products.filter(product => product.type === PRODUCT_TYPE.MERCHANDISE)[0]?.sign?.url}
                        // title={t("Common.Discover our Artists")}
                        artistDetails={products.filter(product => product.type === PRODUCT_TYPE.MERCHANDISE)[0]?.artistDetails}
                        subTitle={products.filter(product => product.type === PRODUCT_TYPE.MERCHANDISE)[0]?.name}
                        description={products.filter(product => product.type === PRODUCT_TYPE.MERCHANDISE)[0]?.description} />
                </div>
            </div> */}

      <div className="crypto-art-container">
        <div className="right-container">
          <CardSocialDescription
            tags={products.filter((product) => product.type === PRODUCT_TYPE.SONG)[0]?.category.map((cat) => cat.name)}
            sign={products.filter((product) => product.type === PRODUCT_TYPE.SONG)[0]?.sign?.url}
            title={products.filter((product) => product.type === PRODUCT_TYPE.SONG)[0]?.name}
            artistDetails={products.filter((product) => product.type === PRODUCT_TYPE.SONG)[0]?.artistDetails}
            subTitle={products.filter((product) => product.type === PRODUCT_TYPE.SONG)[0]?.artistDetails?.name}
            description={products.filter((product) => product.type === PRODUCT_TYPE.SONG)[0]?.description}
          />
        </div>
        <div className="left-container" style={{ justifyContent: 'end' }}>
          <div className="card">
            <PrimaryCard details={products.filter((product) => product.type === PRODUCT_TYPE.SONG)[0]} isHome={true} />
          </div>
        </div>
      </div>
      {/* <div className="collection-section">
                <div className="collection-gradiant" />
                <Stack w={'80%'} mt={'5%'} mb={'5%'} alignItems={'start'}>
                    <h1 className="text-heading1">{t("Common.Collection Featured Digital Asset")}</h1>
                </Stack>
                <div className="collection-scrollbar">
                    {collection.slice(0, 3).map((item: any) => {
                        return (
                            <div className="card">
                                <CollectionImageLayout data={item} />
                            </div>
                        )
                    })}
                </div>
            </div> */}

      <div className="discover-section">
        <DiscoverSection title={t('Common.Discover')} isHome={true} />
      </div>
    </div>
  );
};
