import React, { FC, useEffect, useState } from "react";
import { PrimaryButton } from "../../Button/PrimaryButton";
import './styles.scss'
import { CommonCardOutlet } from "../CommonCardOutlet";
import { Stack } from "@chakra-ui/core";
import { useHistory } from "react-router-dom";
import { ROUTES } from "../../../constants";
import { useSelector } from "react-redux";
import { getProducts } from "../../../store/selectors";

export const CollectionPlacebidCard = () => {
    return (
        <div className="card-container">
            <div className="image-container">
                <img src="https://picsum.photos/2111" />
            </div>
            <div className="detail-container">
                <div className="product-name">
                    <span>The Future ABstr</span>
                </div>
                <div className="artist-info">
                    <div className="artist-image">
                        <img src="https://picsum.photos/2111" height={60} width={60} />

                    </div>
                    <div className="price">
                        <span> 6756</span>
                    </div>
                    <span>1 of 8</span>
                </div>
                <div className="button-container">
                    <div className="button-left">
                        <PrimaryButton scheme='secondary'>Place a bid</PrimaryButton>
                    </div>
                    <div className="button-left">
                        <PrimaryButton scheme='primary'>Collect</PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    )
}


export const CollectionBanner = () => {
    return (
        <div className="collection-banner-container">
            <div className="banner-image">
                <img src="https://picsum.photos/2114" height={'100%'} width={'100%'} />
            </div>
            <div className="details-container">
                <div className="container-left">
                    <div className="image-container">
                        <img src="https://picsum.photos/2111" height={'100%'} width={'100%'} />
                    </div>
                    <div className="colletion-details">
                        <span>The Futru SUB</span>
                        <span>10 in the stock</span>
                    </div>
                </div>
                <div className="container-right">
                    <span>Highest Bid</span>
                    <span>25 ETH</span>
                </div>
            </div>
        </div>
    )
}
interface ICollectionCardHome {
    collectionName?: string;
    price?: string
    image?: string;
    id: string;
    currency?: any
}
export const CollectionCardHome: FC<ICollectionCardHome> = ({ collectionName, price, image, id, currency }) => {
    const history = useHistory()
    return (
        <Stack h={'100%'} w={'100%'} onClick={()=> history.push(ROUTES.SONGS.DETAIL.replace(':id', id))}>
            <CommonCardOutlet type="collection-home" image={image} id={id} productType="Collection">
                <p className="text-body2" style={{paddingLeft:10}}> {collectionName}</p>
                <Stack display={'flex'} flexDirection={'row'} style={{paddingLeft:10}}> <p className="text-body2">{currency}{price}</p></Stack>
            </CommonCardOutlet>
        </Stack>
    )
}
export const CollectionImageLayout = ({ data }: any) => {
    const products = useSelector(getProducts)
    const filteredProducts = products.filter(product => product.artistId === data.artistId.id);

    // const [products, setProducts] = useState<ProductModel[]>([])

    // useEffect(() => {
    //     if (data.artistId.id) {
    //         ProductApi.readAll({
    //             query: {
    //                 artistId: data.artistId.id
    //             }
    //         }).then(res => setProducts(res.products))
    //     }
    // }, [])
    return (
        <div className="collection-layout-container">
            <div className="image-container">
                <div className="left-image-container">
                    <img src={data?.thumbnail} height={'100%'} width={'100%'} />
                </div>
                <div className="right-image-container">
                    {filteredProducts.slice(0,3).map(product => {
                        return(
                            <div className="image">
                        <img src={`${product?.thumbnail?.url}?timestamp=${Date.now()}`} height={'100%'} width={'100%'} />
                    </div> 
                        )
                    })}
                </div>
            </div>
            <div className="detail-container">
                <div className="details-content">
                    <p className="text-body1">{data?.name}</p>
                    <Stack display={'flex'} flexDirection={'row'} alignItems={'center'}>
                        <img src={data?.artistId?.thumbnail} height={40} width={40} style={{ borderRadius: '50%', marginRight: 15 }} />
                        <p className="text-body1">{data?.artistId?.name}</p>
                    </Stack>
                </div>
                <Stack w={'40%'} mt={[3,3,0,0,0]}>
                    <PrimaryButton scheme="basic">
                       <p className="text-body2"> Total {filteredProducts?.length} Item
                       </p>
                    </PrimaryButton>
                </Stack>
            </div>
        </div>
    )
}