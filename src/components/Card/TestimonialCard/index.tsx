import React, { FC } from "react";
import './styles.scss'
import { Stack } from "@chakra-ui/core";

interface ITestimonialCard{
    comment?: string;
    name?: string
}
export const TestimonialCard:FC<ITestimonialCard> = ({comment, name}) => {
    return (
        <div className="testimonial-container">
            <div className="gradiant"/>
            <div className="img-container">
                <img src="https://picsum.photos/2111" />
            </div>
            <Stack mb={15} mt={10} w={'80%'} alignSelf={'center'}>
                <p className="text-heading3 text--center">{comment}</p>
            </Stack>
            <p className="text-body1">{name}</p>
        </div>
    )
}