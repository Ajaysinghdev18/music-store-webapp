import { Flex, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Stack, useToast } from "@chakra-ui/core";
import React from "react";
import { IoIosCloseCircleOutline, IoIosCopy } from "react-icons/io";
import { PrimaryButton } from "../../Button/PrimaryButton";
import { Alert } from "../../Alert";

interface ICouponModal {
    isOpen?: boolean;
    onClose?: () => any;
    code: string
}

export const CouponModal = ({ isOpen, onClose, code='djfhjdh' }: ICouponModal) => {
    const toast = useToast();

    const onCopy = () => {
        navigator.clipboard.writeText(code)
        toast({
            position: 'top-right',
            render: ({ onClose }) => (
                <Alert message={'Copied to Clipboard'} onClose={onClose} />
            )
        });
    }
    return (
        <Modal isOpen={isOpen}>
            <ModalOverlay className="modal-overlay" />
            <ModalContent height={'fit-content'} width={{ xs: '100%', lg: '40%' }} top={'10%'} background={{ xs: 'black', lg: 'black' }} >
                <ModalHeader display={'flex'} width={'100%'} justifyContent={'space-between'} alignItems={'center'}>
                    <p className="text-body1">Avail Coupon Code</p>
                    <IoIosCloseCircleOutline cursor={'pointer'} color="white" onClick={onClose} />
                </ModalHeader>
                <ModalBody className="modal-container">
                    <div className="description-container">
                        <p className="text-body1">Copy this code to avail the benefit</p>
                        <Flex w={'100%'} mt={6} justifyContent={'space-between'} alignItems={'center'}>
                            <Stack><p className="text-body1">{code}</p></Stack>
                            <IoIosCopy size={20} color="white" cursor={'pointer'} onClick={onCopy}/>
                        </Flex>
                    </div>
                    <Stack w={'100%'} alignItems={'center'}>
                    <PrimaryButton scheme="primary" mt={6} onClick={onClose}>Done</PrimaryButton>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}