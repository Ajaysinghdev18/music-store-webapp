import React, { useRef, useState } from "react";
import Play from '../../../assets/images/play btn.png'
import Pause from '../../../assets/images/pause btn.png';
import './style.scss';
import { Stack } from "@chakra-ui/core";
import { PrimaryButton } from "../../Button/PrimaryButton";
import { IoChevronForwardSharp } from "react-icons/io5";
import { useHistory } from "react-router-dom";
import { ROUTES } from "../../../constants";
import { GalleryView } from "../../GalleryView";

interface IVenueImageCard {
    image?: any;
    title?: string;
    description?: string;
    index?:number;
    data?: any
}
interface CustomVideoProps {
    videoUrl: string | any;
}

export const VenueVideoPlayer = ({ videoUrl }: CustomVideoProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                videoRef.current.pause();
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };
    return (
        <div className="venue-video-container">
            <video ref={videoRef} src={videoUrl} style={{ width: '100%', height: 'auto' }} onClick={togglePlay} />
            {isPlaying ?
                <img src={Pause} className=" play-pause" onClick={togglePlay} /> : <img src={Play} className=" play-pause" onClick={togglePlay} />
            }
        </div>
    )
}
export const VenueImageCard = ({ image, title,index, description, data }: IVenueImageCard) => {
    const [currentIndex, setCurrentIndex] = useState<any>(index);
    const [showModal, setShowModal] = useState<boolean>(false)
    const handleShowModal = () => {
        setCurrentIndex(index);
        setShowModal(true)
    }
    return (
        <div className="venue-image-card-container">
            <img src={image} style={{height:280, width:300}} onClick={handleShowModal}/>
            <Stack mt={2}>
                <p className="text-heading3">Steve Lacy {title}</p>
            </Stack>
            <Stack mt={4}>
                <p>25k views</p>
            </Stack>
            <GalleryView isOpen={showModal} selectedIndex={currentIndex} data={data} onClose={()=>setShowModal(false)}/>
        </div>
    )
}
interface IVenueVideoCard {
    video?: any;
    title?: string;
    description?: string
}
export const VenueVideoCard = ({ video, title, description }: IVenueVideoCard) => {
    return (
        <div>
            <VenueVideoPlayer videoUrl={video} />
            <Stack mt={2}>
                <p className="text-heading3">Steve Lacy {title}</p>
            </Stack>
            <Stack mt={4}>
                <p>25k views</p>
            </Stack>
        </div>
    )
}

export const VenueBannerCard = ({ image, title, description, id }: any) => {
    const history = useHistory()
    return (
        <div className="venue-banner-card-conatiner" onClick={() => history.push(ROUTES.VENUES.DETAIL.replace(':id',id))}>
            <img src={image} style={{ width: '100%', height: '100%' }} />
            <div className="venue-banner-card-content">
                <p className="text-heading1">{title}</p>
                <Stack mt={8} mb={10}>
                    <p className="text-body1">{description}</p>
                </Stack>
                <PrimaryButton onClick={() => history.push(ROUTES.VENUES.DETAIL.replace(':id',id))} scheme="basic" rightIcon={<IoChevronForwardSharp />}>Choose Venue</PrimaryButton>
            </div>

        </div>
    )
}

export const VenueVideoBannerCard = ({video, title, isContent= true, description }:any) => {
    return (
        <div className="venue-video-banner-card-conatiner">
            <div className="gradiant" />

            <VenueVideoPlayer videoUrl={video} />
            {isContent && <div className="venue-video-banner-card-content">
                <p className="text-body1">12.12.2023.</p>
                <Stack mt={8} mb={10}>
                    <p className="text-heading2">Live at {title}!</p>
                </Stack>
                <p className="text-body1">{description}</p>
            </div>}

        </div>

    )
}
