import React, { FC } from "react";
import './styles.scss';
import { Link } from "react-router-dom";
import { ROUTES } from "../../../constants";
import { ObjectRender } from "../../ObjectRender";
import { PRODUCT_TYPE } from "../../../shared/enums";

interface ICommonCardOutlet {
    children: any;
    image?: any; 
    type?: 'article' | 'product' | 'collection' | 'collection-home',
    id: string
    object?: any;
    productType: string;
    video?: any;
    artistId?: string
}
export const CommonCardOutlet: FC<ICommonCardOutlet> = ({ children, artistId, image, productType, id, object, video, type = 'collection' }) => {
    let route
    if (productType === PRODUCT_TYPE.IMAGES) {
        route = `${ROUTES.IMAGES.INDEX}/${id}`
    } else if (productType === PRODUCT_TYPE.MERCHANDISE) {
        route = `${ROUTES.MERCHANDISE.INDEX}/${id}`
    } else if (productType === PRODUCT_TYPE.OBJECT) {
        route = `${ROUTES.OBJECTS.INDEX}/${id}`
    } else if (productType === PRODUCT_TYPE.VIDEOS) {
        route = `${ROUTES.VIDEOS.INDEX}/${id}`
    } else if (productType === PRODUCT_TYPE.VIRTUAL_EVENT) {
        route = `${ROUTES.EVENTS.INDEX}/${id}`
    } else if (productType === PRODUCT_TYPE.SONG) {
        route = `${ROUTES.SONGS.INDEX}/${id}`
    } else if (productType === 'artist') {
        route = `${ROUTES.ARTIST.LIST}/${id}`
    } else if (productType === 'gallery') {
        route = `/artists/${artistId}/gallery/${id}/detail`
    } else  if (productType === 'pages') {
        route = `/pages/${id}`
    }
    return (
        <div className="common-card-container">
            <div className="card-container">
                {
                    productType === 'video' ?
                        <div className={'video-image-container'}>
                            <video src={video} controls /> </div> :
                        <Link className={`${type}-image-container`} to={route as string}>
                            {object?.fieldname ? (
                                <ObjectRender id={id} fieldname={object.fieldname} filename={object.filename}  />
                            )
                                : (
                                    <img src={`${image}?timestamp=${Date.now()}`} alt="product-image" />
                                )}
                        </Link>
                }

                <div className={`${productType === 'video' ? 'video' : type}-common-details-container`}>
                    {children}
                </div>
            </div>
        </div>
    )
}