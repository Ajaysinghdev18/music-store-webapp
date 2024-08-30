import React, { useCallback, useEffect, useMemo, useState } from 'react';
import WheelComponent from 'react-wheel-of-prizes';

import { CouponApi } from '../../../../apis';
import { CouponModal } from '../../../../components/Modal/CouponModal';
import {
  TabTitle,
  metaTagByDesc,
  metaTagByKey,
  metaTagByTitle,
  metaTagByWeb
} from '../../../../utils/generaltittlefunction';
import './styles.scss';

export const WheelTab = () => {
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [code, setCode] = useState('');
  const segments = ['Better luck ', '10% off', '5% off', 'Better luck ', '20% off', '15% off'];
  const segColors = ['black', '#ff00ff', 'black', '#ff00ff', 'black', '#ff00ff'];

  const getPercentage = (type: string) => {
    switch (type) {
      case 'Better luck ':
        return null;
      case '10% off':
        return '10';
      case '5% off':
        return '5';
      case '20% off':
        return '20';
      case '15% off':
        return '15';
      default:
        return null;
    }
  };
  const onFinished = (winner: string) => {
    const discount = getPercentage(winner);
    if (discount !== null) {
      CouponApi.createCouponCode({ discountPercentage: discount }).then((res) => {
        setCode(res.coupon.code);
        setShowCouponModal(true);
      });
    }
  };

  TabTitle('Dashboard - Digital Music Shopping Market Place');
  metaTagByTitle('Dashboard - Digital Music Shopping Market Place');
  metaTagByDesc(
    'Music-Store is founded on values we all share and are ready to stand for. They bring us together well beyond our current products and technologies. They’ve defined our identity since the beginning, and they’ll continue to do so, no matter how our business evolves.'
  );
  metaTagByKey('Music-Store, Nft, Hackers, Explore Through the Most Exciting Music NFT');
  metaTagByWeb(`https://dev.music-store.io${window.location.pathname}`);

  return (
    <>
      <div className="profile-dashboard-tab">
        <div className="spin-wheel">
          <WheelComponent
            segments={segments}
            segColors={segColors}
            winningSegment="MM"
            onFinished={(winner: string) => onFinished(winner)}
            primaryColor="black"
            contrastColor="white"
            buttonText="Start"
            isOnlyOnce={false}
            size={190}
            upDuration={500}
            downDuration={600}
            fontFamily="Helvetica"
          />
        </div>
        <CouponModal isOpen={showCouponModal} code={code} onClose={() => setShowCouponModal(false)} />
      </div>
    </>
  );
};
