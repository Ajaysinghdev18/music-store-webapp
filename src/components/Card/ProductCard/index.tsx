import React from "react";
import { CommonCardOutlet } from "../CommonCardOutlet";
import { DetailsSection } from "../BannerProductCard";
import './styles.scss'
import { ProductModel } from "../../../shared/models";
import { REACT_APP_API_ASSET_SERVER } from "../../../constants";
import { Flex, Spinner } from "@chakra-ui/core";

interface ICommonProductCard {
    product: ProductModel;
    isHome?: boolean
}
export const CommonProductCard = ({ product, isHome= false }: ICommonProductCard) => {
    const image = product?.thumbnail?.url ? product?.thumbnail?.url : `${REACT_APP_API_ASSET_SERVER}/${product?.thumbnail?.fieldname}/${product?.thumbnail?.filename}`
    return (
        <>
            {product ?
                product.object ?
                    <CommonCardOutlet image={product.getThumbnailUrl} object={product.object} id={product.productURLId as string} type="product" productType={product.type}>
                        <DetailsSection details={product} isHome={isHome} />
                    </CommonCardOutlet>
                    :
                    product.type === 'video' ? <CommonCardOutlet video={product.video?.url} id={product.productURLId as string} type="product" productType={product.type}>
                        <DetailsSection details={product} isHome={isHome}/>
                    </CommonCardOutlet> :
                        <CommonCardOutlet image={image} id={product.productURLId as string} type="product" productType={product.type}>
                            <DetailsSection details={product} isHome={isHome}/>
                        </CommonCardOutlet> :
                <Flex justifyContent="center" width={'100%'} alignItems="center" height={200}>
                    <Spinner color="#00Ff00" size="xl" />
                </Flex>}
        </>

    )
}