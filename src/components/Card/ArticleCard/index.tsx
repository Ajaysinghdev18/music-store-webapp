import React, { FC } from "react";
import './styles.scss'
import { CommonCardOutlet } from "../CommonCardOutlet";
import { Stack } from "@chakra-ui/core";
import { IMultiLanguage } from "../../../shared/interfaces";
import i18n from '../../../i18n';
import './styles.scss'

interface IArticleCard {
    date?: string;
    image?: string;
    title: IMultiLanguage | any;
    description: IMultiLanguage | any;
    id: string;
}
export const ArticleCard: FC<IArticleCard> = ({ date, title, id, description , image}) => {
    return (
        <CommonCardOutlet type="article" image={image} id={id} productType="Article">
            <Stack><p className="text-body2">{date}</p></Stack>
            <Stack mb={5} mt={13}><p className="text-body1 text--regular">{title[i18n.language]}</p></Stack>
            <Stack mb={2} className="article-description"><p className="text-body2">{description[i18n.language]}</p></Stack>
        </CommonCardOutlet>
    )
}