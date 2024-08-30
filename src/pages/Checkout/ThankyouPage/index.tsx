import { Stack } from "@chakra-ui/core"
import React from "react"
import { DoneStep } from "../Steps"
import './styles.scss'

export const ThankyouPage =()=> {
    return(
        <Stack w={'100%'} h={'100%'} justifyContent={'center'} alignItems={'center'}>
            <Stack w={'80%'}>
                <DoneStep/>
            </Stack>
        </Stack>
    )
}