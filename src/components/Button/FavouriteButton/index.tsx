import React, { useMemo } from "react";
import { IProduct } from "../../../shared/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@chakra-ui/core";
import { getFavorites, getUser } from "../../../store/selectors";
import { ProductApi, UserApi } from "../../../apis";
import { Alert } from "../../Alert";
import { AiOutlineHeart } from "react-icons/ai";
import { likedProducts, toggleFavorite } from "../../../store/actions";
import { ProductModel } from "../../../shared/models";

interface IProductCardProps {
    product: IProduct;
    color?: string
}
export const FavouriteButton = ({ product, color = 'white' }: IProductCardProps) => {
    const user = useSelector(getUser);
    // Get toast from hook
    const toast = useToast();

    // Get favorites from store
    const favorites = useSelector(getFavorites);

    // Get dispatch from hook
    const dispatch = useDispatch();

    // Check favorite
    const isFavorite = useMemo(
        () => favorites?.includes(product?.id as string),
        [favorites, product?.id],
    );
    // Toggle favorite handler
    const handleToggleFavorite = () => {
        if (user) {
            ProductApi.toggleFavorite({
                fingerprint: user.id,
                productId: product.id as string,
            })
                .then(() => {
                    if (isFavorite) {
                        toast({
                            position: "top-right",
                            render: ({ onClose }) => (
                                <Alert message="Removed from your cart!" color="yellow" />
                            ),
                        });
                    } else {
                        toast({
                            position: "top-right",
                            render: ({ onClose }) => (
                                <Alert message={'Successfully added to favorite products!'} onClose={onClose} />

                            ),
                        });
                    }
                    UserApi.getFavorites()
                        .then((res) => {
                            dispatch(likedProducts(res.favoriteProducts.map((product: IProduct) => new ProductModel(product))));
                        }).catch((err) => {
                            toast({
                                position: 'top-right',
                                render: ({ onClose }) => <Alert message={err.msg} color="red" onClose={onClose} />
                            });
                        })
                    dispatch(toggleFavorite(product.id as string));
                })
                .catch((err) => {
                    toast({
                        position: "top-right",
                        render: ({ onClose }) => <Alert message={err.msg} color="red" />
                    });
                });
        } else {
            toast({
                position: "top-right",
                render: ({ onClose }) => (
                    <Alert message="Login to the platform first! " color="red"></Alert>
                ),
            });
        }
    };
    return <AiOutlineHeart size={28} color={isFavorite ? 'purple' : 'white'} onClick={handleToggleFavorite} style={{ cursor: 'pointer' }} />

}