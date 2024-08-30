import React from "react";
import './styles.scss'
import Quotes from "../../../assets/images/“.png"
import signature from "../../../assets/images/signature.png"
import { Box, Flex, Stack } from "@chakra-ui/core";
import { BiLogoFacebook, BiLogoInstagram, BiLogoSpotify } from "react-icons/bi";
import { SiGooglechat } from 'react-icons/si'
import { LiaShareAltSolid } from 'react-icons/lia'
import { IArtist } from "../../../shared/interfaces";
import Image from '../../../assets/images/anouncment.png'
import { VenueVideoPlayer } from "../VenueCard";
interface IArtistCard {
    statement?: string;
    sign?: any;
    artistDetails?: IArtist
}
export const ArtistCard = ({ statement, sign, artistDetails }: IArtistCard) => {
    return (
        <div className="artist-statement-container">
            <img src={Quotes} />
            <Stack my={15}>
                <h3 className="text-heading3">Artist Statement</h3>
            </Stack>
            <Stack my={15} mb={'3%'} w={'50%'} textAlign={'center'}>
                <p className="text-body2">{statement}</p>
            </Stack>
            <Stack display={'flex'} flexDirection={'row'} alignItems={'center'}>
                <img src={sign ? sign : signature} height={50} width={100} />
            </Stack>
        </div>
    )
}

export const ArtistBannerCard = ({ image, sign }: any) => {
    return (
        <div className="artist-banner-card-container">
            <div className="gradiant" />
            <div className="artist-banner-image-container">
                <img src={`${image}?timestamp=${Date.now()}`} />
            </div>
            <Stack w={'15%'} zIndex={100} alignItems={'center'} alignSelf={'center'} width={'50%'} display={'flex'} justifyContent={'space-between'} flexDirection={'row'}>
                <BiLogoSpotify size={30} color={'rgba(84, 255, 201, 1)'} />
                <BiLogoFacebook size={30} color={'rgba(84, 255, 201, 1)'} />
                <BiLogoInstagram size={30} color={'rgba(84, 255, 201, 1)'} />
                <SiGooglechat size={30} color={'rgba(84, 255, 201, 1)'} />
                <LiaShareAltSolid size={30} color={'rgba(84, 255, 201, 1)'} />
            </Stack>
        </div>
    )
}
interface IArtistAnnouncementCard {
    image?: any;
    date?: string;
    title?: string;
    description?: string
}
export const ArtistAnnouncementCard = ({ image, date, title, description }: IArtistAnnouncementCard) => {
    return (
        <Stack width={306} h={'fit-content'}>
            <Stack h={306} w={306}>
                <img src={image} style={{ height: '100%', width: '100%', objectFit: 'contain' }} />
            </Stack>
            <Stack mt={2}>
                <p className="text-body1">{date}</p>
            </Stack>
            <Stack mt={2}>
                <p className="text-heading3">{title}</p>
            </Stack>
            <Stack mt={2}>
                <p className="text-body1">{description}</p>
            </Stack>
        </Stack>
    )
}
interface IArtistVideoCard {
    video?: any;
    date?: string;
    title?: string;
    description?: string
}
export const ArtistVideoCard = ({ video, date, title, description }: IArtistVideoCard) => {
    return (
        <Stack width={306} h={'fit-content'}>
            <VenueVideoPlayer videoUrl={video} />
            <Stack mt={6}>
                <p className="text-body1">{date}</p>
            </Stack>
            <Stack mt={2}>
                <p className="text-heading3">{title}</p>
            </Stack>
            <Stack mt={2}>
                <p className="text-body1">{description}</p>
            </Stack>
        </Stack>
    )
}

export const ArtistThreadCard = () => {
    return(
        <Flex h={'fit-content'}>
            <Stack height={20} w={20} borderRadius={'50%'}>
                <img src={Image} style={{height:'100%', width:'100%', objectFit:'cover', borderRadius:'100%'}}/>
            </Stack>

            <Stack marginLeft={5} w={'100%'} justifyContent={'space-between'}>
                <Flex w={'100%'} justifyContent={'space-between'}>
                    <p>@heartandsoul</p>
                    <p>12.12.2024</p>
                </Flex>
                <Flex>
                    <Box w={'20%'} h={1} background={'white'}/>
                </Flex>
                <Flex w={'100%'}>
                    <p>
                    It is a long established fact that a reader will be distracted by the readable content of.
                    </p>
                </Flex>
            </Stack>
        </Flex>
    )
}
