import { Divider, Flex, Input, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Stack } from "@chakra-ui/core";
import React from "react";
import './styles.scss'
import { IoIosCloseCircleOutline } from "react-icons/io";
import { PrimaryButton } from "../../Button/PrimaryButton";
import { ProductModel } from "../../../shared/models";

interface IBidModal {
    isOpen: boolean;
    onClose: () => any;
    details: ProductModel;
    bidAmount: string;
    setBidAmount: any;
    handleClick: () => any
}
export const BidModal = ({ isOpen, onClose, details, setBidAmount, bidAmount, handleClick }: IBidModal) => {
    console.log("🚀 ~ file: index.tsx:17 ~ BidModal ~ bidAmount:", bidAmount)
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay className="modal-overlay" />
            <ModalContent height={'fit-content'} width={'40%'} top={'10%'} background={'black'} >
                <ModalHeader display={'flex'} width={'100%'} justifyContent={'space-between'} alignItems={'center'}>
                    <p className="text-body1">BID</p>
                    <IoIosCloseCircleOutline color="white" size={25} onClick={onClose} />
                </ModalHeader>
                <ModalBody className="modal-container">
                    <div className="image-container">
                        <img src={details?.thumbnail?.url} />
                    </div>
                    <div className="description-container">
                        <p className="text-body1">Price</p>
                        <Stack mt={6} mb={6}>
                            <input value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} className="bid-input d-form-input" />
                        </Stack>
                        <p className="text-body1">An offer to buy needs the owner to accept. Your payment will be withheld by the marketplace.</p>
                    </div>
                    <Stack width={'100%'} justifyContent={'center'}>
                    <PrimaryButton alignSelf={'center'} mt={6} scheme="primary" onClick={handleClick}>Offer</PrimaryButton>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

interface  ITransactionModal {
    isOpen: boolean;
    onClose: () => any;
    details?: any
}
export const TransactionModal = ({ isOpen, onClose, details }: ITransactionModal) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay className="modal-overlay" />
            <ModalContent height={'fit-content'} width={'40%'} top={'50%'} background={'black'} >
                <ModalHeader display={'flex'} width={'100%'} justifyContent={'space-between'} alignItems={'center'}>
                    <p className="text-body1">Transaction Success</p>
                    <IoIosCloseCircleOutline color="white" size={25} onClick={onClose} />
                </ModalHeader>
                <ModalBody className="modal-container">
                    <div className="transaction-body">
                        <Flex justifyContent={'space-between'}>
                            <Stack>
                                <p className="text-body1 text--bold">Status</p>
                                <p className="text-body1 text--bold">Completed</p>
                            </Stack>
                            <Stack>
                                <p className="text-body1 text--bold">Transaction ID</p>
                                <p className="text-body1 text--bold">4985793459</p>
                            </Stack>
                        </Flex>
                        <Divider  color={'white'} height={1}/>

                        <Flex justifyContent={'space-between'}>
                            <Stack>
                                <p className="text-body1 text--bold">NFT Contract</p>
                                <p className="text-body1 text--bold">Neon</p>
                            </Stack>
                            <Stack>
                                <p className="text-body1 text--bold">Token ID</p>
                                <p className="text-body1 text--bold">4985793459</p>
                            </Stack>
                        </Flex>
                    </div>
                    <Stack width={'100%'} justifyContent={'center'}>
                    <PrimaryButton alignSelf={'center'} mt={6} scheme="primary" onClick={onClose}>DONE</PrimaryButton>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}