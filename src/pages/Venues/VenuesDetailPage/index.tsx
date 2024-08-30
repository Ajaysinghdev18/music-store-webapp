import React from "react";
import { VenueBannerCard, VenueImageCard, VenueVideoBannerCard, VenueVideoCard } from "../../../components/Card/VenueCard";
import { SimpleGrid, Stack } from "@chakra-ui/core";
import { PrimaryButton } from "../../../components/Button/PrimaryButton";
import { IoChevronForwardSharp } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { venueData } from "../../../utils/mockData";

export const VenuesDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const filterData =  venueData.filter(item =>  item.id === id)
    return (
        <Stack mt={'5%'} alignItems={'center'}>
            <Stack w={'100%'}  height={[400, 600, 700, 800]}>
                <VenueBannerCard image={filterData[0].featuredImage} title={filterData[0].name} description={filterData[0].description} id={filterData[0].id} />
            </Stack>
           { filterData[0].featuredVideo !== null && <Stack w={'90%'} my={20} >
                <VenueVideoBannerCard video={filterData[0].featuredVideo} title={filterData[0].name}/>
            </Stack>}
           {filterData[0].videos.length > 0 && <Stack alignItems={'center'} my={20} >
                <p className="text-heading3">Videos</p>
            </Stack>}
            {filterData[0].videos.length > 0 && 
            <Stack w={'90%'} my={20} >
                <SimpleGrid columns={[1, null, 2]} w={'100%'} spacing='40px'>
                    {filterData[0].videos.map(video => <VenueVideoCard video={video} title={filterData[0].name}/>)}
                </SimpleGrid>
            </Stack>}
            <Stack alignItems={'center'} my={20} >
                <p className="text-heading3">Image Gallery</p>
            </Stack>
            <Stack w={'90%'} my={20} alignItems={'center'}>
                <SimpleGrid minChildWidth={[200, 250, 300]} w={'100%'} spacing='40px'>
                  {filterData[0].images.map((image, index) => <VenueImageCard image={image} index={index} title={filterData[0].name} data={filterData}/> )}
                </SimpleGrid>
                <PrimaryButton mt={20} scheme="secondary" rightIcon={<IoChevronForwardSharp />} >Learn More</PrimaryButton>
            </Stack>
        </Stack>
    )
}