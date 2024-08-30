import { Stack } from "@chakra-ui/core"
import React from "react"
import { useLocation } from "react-router-dom";
import { DoneStep } from "../Steps"
import './styles.scss';


export const ThankyouPage = () => {

    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const orderId = searchParams.get("orderId");
    return (
        <Stack w={'100%'} h={'100%'} justifyContent={'center'} alignItems={'center'}>
            <Stack w={'80%'}>
                {orderId && <DoneStep orderId={orderId} />}

            </Stack>
        </Stack>
    )
}
