import React, { useEffect, useState } from "react";
import { ArtistApi, AuthApi, GalleryApi, ProductApi, UserApi } from "../../apis";
import { CommonProductCard } from "../Card/ProductCard";
import { Stack, Flex, Spinner, Checkbox } from "@chakra-ui/core";
import './styles.scss'
import { PrimaryButton } from "../Button/PrimaryButton";
import { IoArrowForwardOutline } from "react-icons/io5";
import { useHistory } from "react-router-dom";
import { ROUTES } from "../../constants";
import { BiFilterAlt } from 'react-icons/bi'
import { useSelector } from "react-redux";
import { getCategories, getUser } from "../../store/selectors";
import { PRODUCT_TYPE } from "../../shared/enums";
import { CommunityEventImageCard, PrimaryCard } from "../Card/BannerProductCard";
import { Slider } from "../Slider";
import { IArtist } from "../../shared/interfaces";
import { getProductRowNumber } from "../../constants/breakpoint";
import { IGallery } from "../../shared/interfaces/gallery.interface";
import { useTranslation } from "react-i18next";

interface IDiscoverSection {
    title?: string | any
    type?: string 
    isHome?: boolean
}
export const DiscoverSection = ({ title = "Discover", type = PRODUCT_TYPE.SONG, isHome=false }: IDiscoverSection) => {
    const [product, setProduct] = useState<any[]>([])
    const [artist, setArtist] = useState<IArtist[]>([])
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedArtist, setSelectedArtist] = useState<string[]>([]);
    const [showFilter, setShowFilter] = useState<boolean>(false)
    const [isLoading, setLoading] = useState<boolean>(false);
    const [priceRange, setPriceRange] = useState<any>([0, 100]);
    const categories = useSelector(getCategories);
    const [galleries, setGalleries] = useState([]);

    const [windowWidth, setWindowWidth] = useState<number>()
    const [productsToShow, setProductsToShow] = useState(3); // Default number of products to show
    const [isSubscribedToAllArtist, setIsSubscribedToAllArtist] = useState()
    const user = useSelector(getUser)
    const { t } = useTranslation();

    useEffect(() => {
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
    }, [windowWidth, user])

    const handleSubscribe = () => {
        history.push(ROUTES.ARTIST.LIST)
    }

    useEffect(() => {
        fetchData();
    }, [type, user])

    const fetchData = () => {
        setLoading(true);
        const query: any = {
            price: {
                $gte: priceRange[0],
                $lte: priceRange[1]
            },
        }
        if (type !== PRODUCT_TYPE.ALL) {
            query.type = type
        }

        if (selectedCategories.length !== 0) {
            query.category = {
                $in: selectedCategories
            }
        }
        if (user && user?.subscribedArtist?.length !== 0) {
            query.artistId = {
                $in: user?.subscribedArtist
            };
        }
        
        if (selectedArtist.length !== 0) {
            query.artistId = {
                $in: selectedArtist
            }
        }

        ProductApi.readAll({ query })
            .then((res) => {
                setLoading(false);
                setProduct(res.products)
            })
    }

    const history = useHistory();

    const handleFilterOptionChange = (id: string | undefined = '', value: boolean) => {
        const isOptionExit = selectedCategories.some(cat => cat === id)
        if (!isOptionExit) {
            selectedCategories.push(id);
        } else {
            const index = selectedCategories.indexOf(id);
            selectedCategories.splice(index, 1);
        }
        setSelectedCategories([...selectedCategories]);
    };
    const handleFilterArtistChange = (id: string | undefined = '', value: boolean) => {
        const isOptionExit = selectedArtist.some(art => art === id)
        if (!isOptionExit) {
            selectedArtist.push(id);
        } else {
            const index = selectedArtist.indexOf(id);
            selectedArtist.splice(index, 1);
        }
        setSelectedArtist([...selectedArtist]);
    };
    const handleApply = () => {
        fetchData()
        setShowFilter(false)
    }
    const handlePriceRange = (values: number[]) => {
        setPriceRange(values);
    };
    const galleryAddress: any = []
    galleries.map((gallery: IGallery) => {
        if (gallery.isPublic) {
            galleryAddress.push(gallery.id)
        }
    })
    const filteredArtist = user ? artist.filter(art => user.subscribedArtist?.includes(art._id)) : [];
    const filteredProduct = !user ?
        product.filter(p => galleryAddress.includes(p?.galleryId as string)).slice(0, productsToShow) :
        user?.subscribedArtist?.length === 0 ?
            product.filter(p => galleryAddress.includes(p?.galleryId as string)).slice(0, productsToShow)
            : product;
    return (
        <>
            {isLoading ? (
                <Flex justifyContent="center" width={'100%'} alignItems="center" height={200}>
                    <Spinner color="#00Ff00" size="xl" />
                </Flex>
            ) :
                <div className="discover-section-container">
                    <div className="dicover-section-header-container">
                        <h2 className="text-heading1" style={{ textTransform: 'capitalize',  }}>{title}</h2>
                        {showFilter && <div className="filter-tab">
                            <p className="text-body1">
                                Genre
                            </p>
                            <Stack display={'flex'} mt={5} w={'80%'} flexWrap={'wrap'} flexDirection={'row'} gridGap={1}>
                                {categories.map((category) => {
                                    return (
                                        <PrimaryButton scheme={selectedCategories.some(cat => cat === category.id as string) ? "primary" : "secondary"}
                                            width={'fit-content'}
                                            onClick={() => handleFilterOptionChange(category.id, selectedCategories.some(cat => cat === category.id as string))}
                                        >
                                            {category.name}
                                        </PrimaryButton>
                                    )
                                })}
                            </Stack>
                            {user &&
                                (filteredArtist.length !== 0 && <Stack mt={5}>
                                    <p className="text-body1">
                                        Artist
                                    </p>
                                    {filteredArtist.map((art, index) => {
                                        return (
                                            <Checkbox
                                                marginLeft={5}
                                                key={index}
                                                value={art.id}
                                                className="d-checkbox"
                                                defaultIsChecked={false}
                                                isChecked={selectedArtist.some(cat => cat === art.id as string)}
                                                onChange={(e) => handleFilterArtistChange(art.id, e.target.checked)}
                                            >
                                                {art.name}
                                            </Checkbox>
                                        )
                                    })}
                                </Stack>)
                            }
                            <Stack mt={10}>
                                <p className="text-body1">Price</p>
                            </Stack>
                            <Stack h={60} justifyContent={'end'} alignItems={'center'}>
                                <Slider range={priceRange} setPriceRange={setPriceRange} onChange={handlePriceRange} min={0} max={1000} />
                            </Stack>
                            <Stack mt={5} display={'flex'} w={'100%'} flexDirection={'row'} justifyContent={'space-between'}>
                                <p className="text-body1">{priceRange[0]}</p>
                                <p className="text-body1">{priceRange[1]}</p>
                            </Stack>

                            <Stack flexDirection={'row'} mt={35} display={'flex'} w={'100%'} justifyContent={'space-between'}>
                                <PrimaryButton scheme="basic" onClick={() => setShowFilter(false)}>Cancel</PrimaryButton>
                                <PrimaryButton scheme="secondary" onClick={handleApply}>Apply</PrimaryButton>
                            </Stack>
                        </div>}
                        <div className="filter-section-container">
                            <PrimaryButton scheme="secondary"
                                width={'fit-content'}
                                onClick={() => setShowFilter(!showFilter)}
                                leftIcon={<BiFilterAlt />} >
                                {t('Common.Filter')}
                            </PrimaryButton>
                        </div>
                    </div>
                    <div className="dicover-section-main">
                        {filteredProduct?.map(item => {
                            return (
                                <Stack
                                 h={[450, 450, 500, 550, 600]} 
                                 alignItems={'center'}>
                                    {(item.type === PRODUCT_TYPE.VIDEOS || item.type === PRODUCT_TYPE.MERCHANDISE) ?
                                        <PrimaryCard details={item} isHome={isHome}/>
                                        : item.type === PRODUCT_TYPE.VIRTUAL_EVENT ?
                                            <CommunityEventImageCard details={item}  isHome={isHome}/> :
                                            <CommonProductCard product={item}  isHome={isHome}/>
                                    }
                                </Stack>
                            )
                        })}
                    </div>
                    {title === "Discover" ? null : (!isSubscribedToAllArtist || !user) &&
                        <Stack w='100%' mt={'5%'} alignItems={'center'} bg={'grey.400'}>
                            <h1 className='text-heading3'>
                               {t('Common.Subscribe to Artists to see their Collections')}
                            </h1>
                            <PrimaryButton scheme="primary" mt={5} onClick={handleSubscribe}>
                                {t('Subscribe')}
                            </PrimaryButton>
                        </Stack>}
                    {title === "Discover" && <div>
                        <PrimaryButton mt={'5%'} scheme="basic" onClick={() => history.push(ROUTES.ARTIST.LIST)} rightIcon={<IoArrowForwardOutline />}>{t("Common.Discover More Music Digital Asset")}</PrimaryButton>
                    </div>}
                </div>
            }
        </>

    )
}