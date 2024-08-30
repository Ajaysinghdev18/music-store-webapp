import { Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/core";
import React, { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export const GalleryView = ({ isOpen, onClose, selectedIndex, data }: any) => {
    const [currentIndex, setCurrentIndex] = useState<any>(selectedIndex);
    useEffect(() => {
        setCurrentIndex(selectedIndex)
    }, [selectedIndex])
    function handleChange(index: any) {
        setCurrentIndex(index);
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay className="modal-overlay" />
            <ModalContent height={'fit-content'} maxW={'75%'} width={'75%'} background={'black'} >
                <ModalHeader display={'flex'} width={'100%'} justifyContent={'flex-end'} alignItems={'center'}>
                    <IoIosCloseCircleOutline color="white" size={25} onClick={onClose} />
                </ModalHeader>
                <ModalBody>
                    <Carousel
                        showArrows={true}
                        autoPlay={true}
                        infiniteLoop={true}
                        className="carousel-container"
                        selectedItem={currentIndex}
                        onChange={handleChange}
                    >
                        {data[0].images.map((image: any) => (
                            <div key={image.alt}>
                                <img src={image} alt={image} />
                                <p className="text-heading3">Steve Lacy {data[0].name}</p>
                            </div>
                        ))}
                    </Carousel>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}