import React from "react";
import { VenueBannerCard } from "../../components/Card/VenueCard";
import { Stack } from "@chakra-ui/core";
import { venueData } from "../../utils/mockData";

export const Venues = () => {
    return (
        <Stack mt={'5%'}>
            {venueData.map(item => {
                return (
                    <Stack w={'100%'} height={[400, 600, 700, 800]}>
                        <VenueBannerCard image={item.featuredImage} id={item.id} title={item.name} description={item.description}/>
                    </Stack>
                )
            })}
        </Stack>
    )
}