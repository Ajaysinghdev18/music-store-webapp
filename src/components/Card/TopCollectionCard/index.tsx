import React from "react";
import { Stack } from "@chakra-ui/core";
import './styles.scss'
import { PrimaryButton } from "../../Button/PrimaryButton";
import { ProductModel } from "../../../shared/models";
import moment from "moment";
import { PRODUCT_TYPE } from "../../../shared/enums";

export const TopCollectionCard = ({ data }: any) => {
    return (
        <div className="top-collection-card-container">
            <div className="top-collection-image-container">
                <img src={`${data?.thumbnail?.url }?timestamp=${Date.now()}`} style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
            </div>
            <div className="top-collection-content-container">
                <Stack w={10} h={10} borderRadius={'50%'}>
                    <img src={`${data?.thumbnail?.url }?timestamp=${Date.now()}`} style={{ height: '100%', width: '100%', objectFit: 'cover', borderRadius: '100%' }} />
                </Stack>
                <Stack w='70%' pl={8}>
                    <p className="text-body1">{data?.name}</p>
                    <p className="text-body2"> {moment(data?.startTime).format("DD.MM.YYYY")} </p>
                </Stack>
                <Stack w='20%' alignItems={'end'}>
                    <p className="text-body2">{data?.currency} {data?.price}</p>
                </Stack>
            </div>
        </div>
    )
}
export const TopCollectionSmallCard = ({ data }: any) => {
    return (
        <div className="top-collection-small-container">
            <div className="top-small-image-container">
                <img src={`${data?.thumbnail?.url }?timestamp=${Date.now()}`} />
            </div>
            <div className="top-collection-small-content-container">
                <Stack w='100%'>
                    <p className="text-body1">{data.name}</p>
                </Stack>
                <Stack w={'100%'} display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <Stack h={[10, 10, 15, 30, 50]} w={[10, 10, 15, 30, 50]}>
                        <img src={`${data?.artistDetails?.thumbnail}?timestamp=${Date.now()}`} style={{ height: '100%', width: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    </Stack>
                    <p className="text-body2">{data.currency}{data.price} </p>
                </Stack>
                <Stack w='100%' alignItems={'start'}>
                    <PrimaryButton w={['100%', '100%', '100%', 'fit-content', 'fit-content']} scheme="primary">{data.type === PRODUCT_TYPE.VIRTUAL_EVENT ? 'Attent' : 'Collect'}</PrimaryButton>
                </Stack>
            </div>
        </div>
    )
}

export const TopCollectionListCard = ({ data, index }: any) => {
    return (
        <Stack width={'100%'} height={'fit-content'} alignItems={'center'} justifyContent={'space-between'} flex={1} flexDirection={'row'}>
            <Stack >
                <p>{index}</p>
            </Stack>
            <Stack h={[10, 10, 35, 50, 50]} w={[10, 10, 35, 50, 50]}>
                <img src={`${data?.thumbnail?.url}?timestamp=${Date.now()}`} style={{ height: '100%', width: '100%', borderRadius: '50%' }} />
            </Stack>
            <Stack w={'60%'} justifyContent={'space-evenly'}>
                <p className="text-body2">{data.name}</p>
                <p className="text-body2" style={{ fontWeight: 700 , marginTop:5}}>{data?.currency} {data?.price}</p>
            </Stack>
        </Stack>
    )
}

interface ISuggestionSection {
    titleName?: string
    historyTitleName?: string
    pastData: ProductModel[];
    futureData: ProductModel[];
}
export const SuggestionSection = ({ titleName, pastData, futureData, historyTitleName }: ISuggestionSection) => {
    return (
        <Stack w={'100%'} my={['15%', '5%', '5%']}>
            <h1 className="text-heading1">{titleName}</h1>
            <Stack mt={12} display={'flex'} w={'100%'} flexDirection={['column', 'row', 'row', 'row', 'row',]} justifyContent={'space-between'}>
                {futureData?.length === 0 ?
                    <Stack width={['100%', '100%','65%', '65%', '65%','65%']} display={'flex'} flexDirection={'row'} >
                        <h3 className="text-heading3">No Data Found</h3>
                    </Stack> :
                    <Stack  width={['100%', '100%','65%', '65%', '65%','65%']} display={'flex'} flexDirection={'row'} >
                        <Stack w={'50%'} >
                            <Stack height={'100%'} w={'100%'}>
                                <TopCollectionCard data={futureData.filter(data => data.isFeatured)[0]} />
                            </Stack>
                        </Stack>
                        <Stack height={'100%'} justifyContent={'space-around'} width={'45%'}>
                            {futureData?.slice(0, 3).map(item => <Stack height={'fit-content'} w={'100%'}>
                                <TopCollectionSmallCard data={item} />
                            </Stack>)}
                        </Stack>
                    </Stack>}
                <Stack  width={['100%', '100%','30%', '30%', '25%','25%']} mt={['10%', '10%','0%', '0%', '0%','0%' ]}>
                    <h3 className="text-heading3">{historyTitleName}</h3>
                    <p className="text-body1" > Last 7 days</p>
                    {pastData?.length === 0 ?
                        <Stack width={'100%'} mt={12} justifyContent={'center'} >
                            <h3 className="text-heading3">No Data Found</h3>
                        </Stack> :
                        <Stack width={'100%'} mt={12} justifyContent={'center'} >
                            {pastData.slice(0, 3).map((item, index) => <Stack height={100} w={'100%'}>
                                <TopCollectionListCard data={item} index={index + 1} />
                            </Stack>)}
                        </Stack>
                    }
                </Stack>
            </Stack>
        </Stack>
    )
}