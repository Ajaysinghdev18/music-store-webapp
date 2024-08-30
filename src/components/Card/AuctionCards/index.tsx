import React, { FC, useEffect, useState } from "react";
import { PrimaryButton } from "../../Button/PrimaryButton";
import { IArtist } from "../../../shared/interfaces";
import { Box, Flex, Input, InputGroup, InputRightAddon, Stack, useToast } from "@chakra-ui/core";
import { ProductModel } from "../../../shared/models";
import './styles.scss'
import { AuctionApi } from "../../../apis";
import CountdownTimer from "../../CountDownTimer";
import { Alert } from "../../Alert";
import { MdHourglassEmpty } from "react-icons/md";
import { IHeadCell, Table } from "../../Table";
import moment from "moment";

interface ICardAuctionDescription {
    tags: string[] | any;
    details: ProductModel;
    title?: string | any;
    subTitle?: string;
    description?: string;
    artistDetails?: IArtist;
    setCurrentBidAmount: any;
    currentBidAmount?: number;
}
interface IDetailsSection {
    details: ProductModel
    isPrimaryCard?: boolean
}

export const CardAuctionDescription: FC<ICardAuctionDescription> = ({ tags, details, setCurrentBidAmount, currentBidAmount = 0, description }) => {
    const [bidAmount, setBidAmount] = useState<string>('')
    const [isConfirmed, setIsConfirmed] = useState<boolean>(false)
    const toast = useToast();

    const handleBidCreation = () => {
        AuctionApi.createBid({ amount: bidAmount, coin: details.chain }, details?.auction?.id as string)
            .then(res => {
                setCurrentBidAmount && setCurrentBidAmount(+bidAmount);
                toast({
                    position: 'top-right',
                    render: ({ onClose }) => (
                        <Alert message={'Bid Send Successfully'} onClose={onClose} />
                    )
                });
            })
            .catch((err) => {
                toast({
                    position: 'top-right',
                    render: ({ onClose }) => (
                        <Alert color="yellow" message={'Error while creating bid, Please try again'} onClose={onClose} />
                    )
                });
                console.log(err)
            })
    }
    const confirmBidCreation =()=>{
        setIsConfirmed(true)
    }
    const handleChange = (event: any) => {
        setIsConfirmed(false)
        setBidAmount(event.target.value)
    }
    const isValidValue = details?.auction?.currentHighestBid !== undefined && parseInt(bidAmount) >= details.auction.currentHighestBid;
    return (
        <Stack className="card-auction-description-container">
            <div className="tag-container">
                {tags?.map((tag: any) => {
                    return (
                        <PrimaryButton fontSize={18} scheme='primary'><p className="text-body1">{tag}</p></PrimaryButton>
                    )
                })}
            </div>
            <Stack mt={10} mb={8}>
                <Box>
                    <p className="text-heading1">{details.name}</p>
                </Box>
                <Box>
                    <p className="text-heading3">{details.description}</p>
                </Box>
            </Stack>
            <div className="place-bid-container">
                <Stack w={'30%'}>
                    <Box mb={6}><p className="text-heading3">Place a bid</p></Box>
                    <p className="text-body1">{details.auction?.currentHighestBid === 0 ? 'You must bid more than ' : 'You must bid atleast '}{details.auction?.currentHighestBid} {details.chain}</p>
                </Stack>
                <Stack w={'60%'} justifyContent={'space-between'}>
                    <InputGroup background={'transparent'} border={'1px solid'} borderColor={'#FFF'} borderRadius={10} color={'#FFF'} >
                        <Input background={'transparent'} value={bidAmount} type="number" onChange={handleChange} border={0} color={'#FFF'} placeholder="Enter a Bid" focusBorderColor="none" />
                        <InputRightAddon background={'transparent'} border={0} color={'#FFF'}>
                            {details.chain}
                        </InputRightAddon>
                    </InputGroup>
                    <PrimaryButton w={'100%'} isDisabled={!isValidValue} scheme={isConfirmed ? 'secondary':"basic"} color={'white'} background={'linear-gradient(114deg, #0038F5 0%, #9F03FF 100%)'} onClick={isConfirmed ? handleBidCreation : confirmBidCreation}>{isConfirmed ? 'Confirm Bid' : 'Place Bid'}</PrimaryButton>
                </Stack>
            </div>
        </Stack>
    )
}

export const AuctionCard = ({ details }: IDetailsSection) => {
    return (
        <Stack w={'100%'}>
            <Flex w={'100%'} justifyContent={'space-between'} alignItems={'flex-end'}>
                {/* <MdHourglassEmpty color='white' size={54} />
                <CountdownTimer /> */}
                <Stack>
                    <p className="text-heading3">{details.auction?.currentHighestBid} {details.chain}</p>
                    <p className="text-body3">Highest Bid</p>
                </Stack>
                <div className="bid-now-parallelogram">
                    <p className="text-heading3">BID NOW!</p>
                    <p className="text-body3">Latest Collection</p>
                </div>
            </Flex>
            <Flex w={'100%'}>
                <img src={details.thumbnail.url} style={{ width: '100%' }} />
            </Flex>
        </Stack>
    )
}

interface IAuctionTable {
    details: ProductModel
}
const headCells: IHeadCell[] = [
    {
        label: 'UserName',
        key: 'name',
        render: (row) => <Flex>
            <Box h={47} w={47}>
                <img src={row?.bidder?.avatar?.url} style={{ height: '100%', width: '100%', borderRadius: 6 }} />
            </Box>
            <Stack ml={6} alignItems={'center'}>
                <p className="text-body1" style={{ opacity: 0.5 }}>{row?.bidder?.username}</p>
                <p className="text-body1" style={{ fontWeight: 600 }}>{row?.bidder?.name}</p>
            </Stack>
        </Flex>
    },
    {
        label: 'Bidding',
        key: 'amount',
        render: (row) => row?.amount
    },
    {
        label: 'Date',
        key: 'updatedAt',
        render: (row) => moment(row?.updatedAt).fromNow()
    },

];

export const AuctionTable = ({ details }: IAuctionTable) => {
    return (
        <Stack w={'100%'} alignItems={'center'}>
            <Stack mb={15}>
                <p className="text-heading2">Auction</p>
            </Stack>
            <Table className={'bid-table'} data={details?.auction?.bids} headCells={headCells} />
        </Stack>
    )
}
