import { Flex, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Stack } from '@chakra-ui/core';
import React, { useEffect, useState } from 'react';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { IoIosArrowDropright } from 'react-icons/io';
import { IoIosArrowDropdown } from 'react-icons/io';
import { useSelector } from 'react-redux';

import { CartApi, CouponApi } from '../../../apis';
import { getUser } from '../../../store/selectors';
import { PrimaryButton } from '../../Button/PrimaryButton';
import './styles.scss';

interface IBuyModal {
  isOpen: boolean;
  onClose: () => any;
  cartDetail?: any;
  tax: any;
  setUserCart?: (id: string) => void;
}
export const BuyModal = ({ isOpen, onClose, cartDetail, tax, setUserCart }: IBuyModal) => {
  const [showCode, setShowCode] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [total, setTotal] = useState<number>();
  const [error, setError] = useState('');
  const user = useSelector(getUser);

  useEffect(() => {
    setTotal(((cartDetail ? cartDetail.total : 0) + (tax ? tax.tax_amount : 0)).toFixed(2));
  }, [cartDetail]);

  const ValidateCoupon = () => {
    CouponApi.validateCoupon({ code })
      .then((res) => {
        const { isValid, coupon } = res;
        setDiscount(coupon.discountPercentage);
        const subTotal = ((cartDetail ? cartDetail.total : 0) + (tax ? tax.tax_amount : 0)).toFixed(2);
        const discountedPrice = subTotal * (1 - coupon.discountPercentage / 100);
        if (isValid && user) {
          setTotal(discountedPrice);
          CartApi.addDiscount({ fingerprint: user.id, discount: coupon.discountPercentage, couponId: coupon._id })
            .then((res) => setUserCart && setUserCart(user?.id as string))
            .catch((err) => setError('Invalid Coupon Code'));
          onClose();
        }
      })
      .catch((err) => setError('Invalid Coupon Code'));
  };

  const handleApplyDiscount = () => {
    if (user) {
      CartApi.addDiscount({ fingerprint: user.id, discount })
        .then((res) => setUserCart && setUserCart(user?.id as string))
        .catch((err) => console.log(err));
    }
  };
  const handleChange = (value: string) => {
    setCode(value);
    setTotal(((cartDetail ? cartDetail.total : 0) + (tax ? tax.tax_amount : 0)).toFixed(2));
  };
  return (
    <Modal isOpen={isOpen}>
      <ModalOverlay className="modal-overlay" />
      <ModalContent
        height={'fit-content'}
        width={{ xs: '100%', lg: '40%' }}
        top={'10%'}
        background={{ xs: 'black', lg: 'black' }}
      >
        <ModalHeader display={'flex'} width={'100%'} justifyContent={'space-between'} alignItems={'center'}>
          <p className="text-body1">BUY</p>
          <IoIosCloseCircleOutline cursor={'pointer'} color="white" onClick={onClose} />
        </ModalHeader>
        <ModalBody className="modal-container">
          <div className="image-container">
            {/* <img src="https://music-store-staging.s3.eu-central-1.amazonaws.com/thumbnail/thumbnail-64eccccce4f7949b5d2f0684?timestamp=1701704167407" /> */}
          </div>
          <div className="description-container">
            <Flex w={'100%'} justifyContent={'space-between'}>
              <p className="text-body1">Price</p>
              <p className="text-body1">
                {((cartDetail ? cartDetail.total : 0) + (tax ? tax.tax_amount : 0)).toFixed(2)}
              </p>
            </Flex>
            <Stack
              cursor={'pointer'}
              display={'flex'}
              flexDirection={'row'}
              alignItems={'center'}
              mb={6}
              mt={6}
              onClick={() => setShowCode(!showCode)}
            >
              {showCode ? <IoIosArrowDropdown color="#06DBAC" /> : <IoIosArrowDropright color="#06DBAC" />}
              <p className="text-body2" style={{ color: '#06DBAC', marginLeft: 5 }}>
                Apply promo code
              </p>
            </Stack>
            {showCode && (
              <Stack mb={6}>
                <Flex alignItems={'center'} justifyContent={'space-between'} mb={6}>
                  <Stack width={'60%'}>
                    <input className="bid-input d-form-input" onChange={(e) => handleChange(e.target.value)} />
                  </Stack>
                  <PrimaryButton width={'40%'} scheme="primary" onClick={ValidateCoupon}>
                    Apply
                  </PrimaryButton>
                </Flex>
              </Stack>
            )}
            <p>{error}</p>
            <Flex w={'100%'} justifyContent={'space-between'}>
              <p className="text-body1">Total</p>
              <p className="text-body1">{total}</p>
            </Flex>
          </div>
          {/* <Stack w={'100%'} alignItems={'center'}>
                        <PrimaryButton scheme="primary" mt={6} onClick={handleApplyDiscount}>APPLY</PrimaryButton>
                    </Stack> */}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
