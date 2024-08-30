// Dependencies
import React, { FC, useEffect, useState } from 'react';
import { Box, Button, Checkbox, CheckboxGroup, Flex, Input, Spinner, Stack, useToast } from '@chakra-ui/core';
import { useLocation } from 'react-router-dom';
import classnames from 'classnames';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

// Hooks
import { useDebounce } from '../../shared/hooks';

// Components
import { Slider, IconButton, ProductCard, Icon, AnimationOnScroll } from '../../components';

// Interfaces
import { IArtist, IProduct } from '../../shared/interfaces';
import { ProductModel } from '../../shared/models';
import { PRODUCT_TYPE } from '../../shared/enums';

import { getCategories, getUser } from '../../store/selectors';

// Apis
import { ArtistApi, GalleryApi, ProductApi } from '../../apis';

// Constants
import { ROUTES } from '../../constants';

// Styles
import './styles.scss';
import { CommunityEventImageCard, PrimaryCard } from '../../components/Card/BannerProductCard';
import { CommonProductCard } from '../../components/Card/ProductCard';
import { PrimaryButton } from '../../components/Button/PrimaryButton';
import { IGallery } from '../../shared/interfaces/gallery.interface';
import { useTranslation } from 'react-i18next';

// Export search-result page
export const SearchResultPage: FC = () => {
  // States
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [priceRange, setPriceRange] = React.useState([1, 100]);
  const [searchKey, setSearchKey] = useState<string>('');
  const [totalResult, setTotalResult] = useState(0);
  const [filterOptionsByTopic, setFilterOptionsByTopic] = useState([
    { selected: true, label: 'Most Related' },
    { selected: false, label: 'Hottest' },
    { selected: false, label: 'Newest' }
  ]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [showMore, setShowMore] = useState(false);
  const [deselectedCategories, setDeselectedCategories] = useState<string[]>([]);
  const [musicOption, setMusicOption] = useState(false);
  const [ticketOption, setTicketOption] = useState(false);
  const [galleries, setGalleries] = useState([]);
  const [artist, setArtist] = useState<IArtist[]>([])
  const [isSubscribedToAllArtist, setIsSubscribedToAllArtist] = useState()
  const user = useSelector(getUser)

  // Get params form hook
  let { search } = useLocation();
  search = search.slice(1);

  const categories = useSelector(getCategories);

  // Get toast from hook
  const toast = useToast();

  // Get history from hook
  const history = useHistory();
  const { t } = useTranslation();

  //Topic filter change handler
  const handleTopicFilter = (clickedValue: string) => {
    const filtered = filterOptionsByTopic.map((option) => {
      if (option.label === clickedValue) {
        option.selected = !option.selected;
        return option;
      } else return option;
    });
    setFilterOptionsByTopic(filtered);
  };

  // Price range handler
  const handlePriceRange = (values: number[]) => {
    setPriceRange(values);
  };

  // Fetch products
  const fetchProducts = () => {
    setLoading(true);
    const types: string[] = [];

    if (musicOption) {
      types.push(PRODUCT_TYPE.SONG);
    }
    if (ticketOption) {
      types.push(PRODUCT_TYPE.VIRTUAL_EVENT);
    }
    const query: any = {
      productURLId: searchKey,
      name: searchKey,
      price: {
        $gte: priceRange[0],
        $lte: priceRange[1]
      },
    }
    if (deselectedCategories.length > 0) {
      query.category = {
        $in: deselectedCategories
      };
    }
    if (types.length > 0) {
      query.type = {
        $in: types
      };
    }
    ProductApi.readAll({ query })
      .then((res) => {
        setLoading(false);
        setProducts(res.products.map((product: IProduct) => new ProductModel(product)));
        setTotalResult(res.pagination.total);
      })
      .catch((err) => {
        setLoading(false);
        toast({
          position: 'top-left',
          status: 'error',
          duration: 2000,
          title: err.msg
        });
      });
  };

  // Search handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.currentTarget.value);
  };

  // Cart handler
  const handleCart = () => {
    history.push(ROUTES.CART);
  };


  useEffect(() => {
    setSearchKey(search);
    GalleryApi.readAllGalleries({ query: { isPublic: true } }).then(res => setGalleries(res.galleries));
    ArtistApi.readAll().then(res => {
      if (res.artists) {
        setArtist(res.artists)
        if (user) {
          const isExist = res.artists.every((art: IArtist) => user?.subscribedArtist?.includes(art.id))
          setIsSubscribedToAllArtist(isExist)
        }
      }
    }).catch(e => console.log(e))
  }, [user])
  // Debounce filter keys
  const debounceSearchKey = useDebounce(searchKey);
  const debouncePriceRange = useDebounce(priceRange);

  // On search key and price range changed
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [debounceSearchKey, debouncePriceRange, deselectedCategories, musicOption, ticketOption]);

  const handleFilterOptionChange = (id: string | undefined = '', value: boolean) => {
    if (!value) {
      deselectedCategories.push(id);
    } else {
      const index = deselectedCategories.indexOf(id);
      deselectedCategories.splice(index, 1);
    }
    setDeselectedCategories([...deselectedCategories]);
  };
  const galleryAddress: any = []
  galleries.map((gallery: IGallery) => {
    if (gallery.isPublic) {
      galleryAddress.push(gallery.id)
    }
  })
  const filteredArtist = user ? artist.filter(art => user.subscribedArtist?.includes(art._id)) : [];
  const filteredProduct = !user ?
    products.filter(p => galleryAddress.includes(p?.galleryId as string)).slice(0, 3) :
    user?.subscribedArtist?.length === 0 ?
      products.filter(p => galleryAddress.includes(p?.galleryId as string)).slice(0, 3)
      : products;

  const handleSubscribe = () => {
    history.push(ROUTES.ARTIST.LIST)
  }
  // Return search-result page
  return (
    <div className="search-result-page">
      <AnimationOnScroll animation="animate__bounce" delay={2}>
        <div className="page-title">
          <h2 className="text-heading2">Search.</h2>
        </div>
      </AnimationOnScroll>
      <AnimationOnScroll animation="animate__slideInLeft" className="search-panel" delay={1}>
        <div className="search-bar">
          <div className="search-input">
            <Input placeholder="Search" value={searchKey} onChange={handleSearch} />
            <Icon name="search" />
          </div>
          <span className="text-heading4 result-count">{totalResult} Results</span>
        </div>
        <hr />
        <div className="filters">
          <div className="filter-by-topic">
            {filterOptionsByTopic.map((option) => (
              <span
                key={option.label}
                className={classnames('topic-item text-heading4', option.selected && 'active')}
                onClick={() => handleTopicFilter(option.label)}
              >
                {option.label}
              </span>
            ))}
          </div>
          <CheckboxGroup className="categories">
            <Box display="flex" flexDirection="column">
              {categories.slice(0, showMore ? categories.length : 5).map((category, index) => (
                <Checkbox
                  key={index}
                  value={category.id}
                  className="d-checkbox"
                  defaultIsChecked
                  isChecked={deselectedCategories.indexOf(category.id as string) < 0}
                  onChange={(e) => handleFilterOptionChange(category.id, e.target.checked)}
                >
                  {category.name}
                </Checkbox>
              ))}
            </Box>
            <Box display="flex" flexDirection="column">
              <Checkbox
                value={'music'}
                className="d-checkbox"
                defaultIsChecked
                isChecked={musicOption}
                onChange={(e) => setMusicOption(e.target.checked)}
              >
                Music
              </Checkbox>
              <Checkbox
                value={'ticket'}
                className="d-checkbox d-checkbox--cyan"
                defaultIsChecked
                isChecked={ticketOption}
                onChange={(e) => setTicketOption(e.target.checked)}
              >
                Ticket
              </Checkbox>
            </Box>
          </CheckboxGroup>
          <Box display="flex" justifyContent="end" pr={20}>
            {!showMore && (
              <Button className="more-button" onClick={() => setShowMore(true)}>
                More Filters
              </Button>
            )}
          </Box>
        </div>
      </AnimationOnScroll>
      <div className="content">
        <div className="actions">
          <Slider range={[10, 100]} onChange={handlePriceRange} min={0} max={200} />
          <IconButton icon="shopping-bag" onClick={handleCart} />
        </div>
        <hr />
        {isLoading ? (
          <Flex justifyContent="center" alignItems="center" height={200}>
            <Spinner color="#00Ff00" size="xl" />
          </Flex>
        ) : (
          <Stack>
            {(!isSubscribedToAllArtist || !user) &&
              <Stack w='100%' mt={'5%'} alignItems={'center'} bg={'grey.400'}>
                <h1 className='text-heading3'>
                  {t('Common.Subscribe to Artists to see their Collections')}
                </h1>
                <PrimaryButton scheme="primary" mt={5} onClick={(handleSubscribe)}>
                  {t('Subscribe')}
                </PrimaryButton>
              </Stack>}
            <div className="products">
              {filteredProduct?.map(item => {
                return (
                  <Stack
                    h={[450, 450, 500, 550, 600]}
                    alignItems={'center'}>
                    {(item.type === PRODUCT_TYPE.VIDEOS || item.type === PRODUCT_TYPE.MERCHANDISE) ?
                      <PrimaryCard details={item} isHome={true} />
                      : item.type === PRODUCT_TYPE.VIRTUAL_EVENT ?
                        <CommunityEventImageCard details={item} isHome={true} /> :
                        <CommonProductCard product={item} isHome={true} />
                    }
                  </Stack>
                )
              })}
            </div>
          </Stack>

        )}

      </div>
    </div>
  );
};
