import { Stack } from '@chakra-ui/core';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoCaretBackOutline, IoCaretForwardOutline } from 'react-icons/io5';

import AssetImage from '../../assets/images/assest.png';
import Globle from '../../assets/images/globe.png';
import { PrimaryButton } from '../Button/PrimaryButton';
import './styles.scss';

export const HeroLeftBanner = () => {
  return (
    <div className="hero-left-container">
      <div className="button-container">
        <PrimaryButton width={'48%'} scheme="primary">
          Home
        </PrimaryButton>
        <PrimaryButton width={'48%'} scheme="primary">
          Home
        </PrimaryButton>
      </div>
      <span className="text-heading3">Heart & Soul</span>
      <span className="text-body1">Track 21</span>
      <span className="text-body2">
        Music Digital Asset will continue to revolutionize the way that artists and fans create community together as we
        enter the upcoming year — undoubtedly changing the trajectory of countless budding music careers.{' '}
      </span>
      <div className="divider" />
      <div className="details-container">
        <div className="details">
          <p className="text-body1">432K+</p>
          <p className="text-body3">Collection</p>
        </div>
        <div className="details">
          <p className="text-body1">432K+</p>
          <p className="text-body3">Collection</p>
        </div>
        <div className="details">
          <p className="text-body1">432K+</p>
          <p className="text-body3">Collection</p>
        </div>
      </div>
    </div>
  );
};

interface IHeroHomeBanner {
  heading?: string | any;
  subHeading?: string | any;
  basicButtonText?: any;
  secondaryrButtonText?: any;
  basicRightIcon?: any;
  secondaryRightIcon?: any;
  onBasicClick?: () => any;
  onSecondaryClick?: () => any;
  hero?: boolean;
}
export const HeroHomeBanner: FC<IHeroHomeBanner> = ({
  heading,
  subHeading,
  basicButtonText,
  secondaryRightIcon = null,
  secondaryrButtonText,
  basicRightIcon = null,
  onSecondaryClick,
  onBasicClick,
  hero = false
}) => {
  return (
    <div className="hero-banner-container">
      <p className="text-heading1">{heading}</p>
      <p className={`text-body2 ${hero ? 'hero-description' : 'description'} `}>{subHeading}</p>
      <div className="hero-button-container">
        {secondaryrButtonText ? (
          <PrimaryButton scheme="secondary" rightIcon={secondaryRightIcon} onClick={onSecondaryClick}>
            <p className="text-body1 text--black">{secondaryrButtonText}</p>
          </PrimaryButton>
        ) : null}
        {basicButtonText ? (
          <PrimaryButton scheme="basic" rightIcon={basicRightIcon} onClick={onBasicClick}>
            <p className="text-body1">{basicButtonText}</p>
          </PrimaryButton>
        ) : null}
      </div>
    </div>
  );
};
interface IIconLinkSection {
  icon: any;
  title: string;
  description: string;
}
export const IconLinkSection: FC<IIconLinkSection> = ({ icon, title, description }) => {
  return (
    <div className="icon-link-section-container">
      <div className="icon-link-image-container">{icon}</div>
      <Stack display={'flex'} alignItems={'center'}>
        <p className="icon-link-title text-body1">{title}</p>
        <p className="text--center text-body2 icon-link-description">{description}</p>
      </Stack>
    </div>
  );
};

export const AutoScrollTag = () => {
  return (
    <div className="headline-strip">
      {[1, 2, 4, 5, 6, 7, 8].map((item) => {
        return (
          <Stack w={500} display={'flex'} flexDirection={'row'} ml={60} alignItems={'center'} className="moving-text">
            <img src={Globle} height={30} width={30} style={{ marginRight: 20 }} />
            <p className=" text-body1 text--white">NEW WAY TO REACH THE NEW FAN</p>
          </Stack>
        );
      })}
    </div>
  );
};

export const Web3Asset = () => {
  const { t } = useTranslation();
  return (
    <div className="Web3Asset-container">
      <div className="left-section">
        <h1 className="text-heading1">{t('Home.Sell Web3 Assets on Music Store')}</h1>
        <Stack mb={25} mt={50}>
          <h3 className="text-heading2">{t('Home.Manage and nurture people with wallets')}</h3>
        </Stack>
        <p className="text-body2">
          {t(
            'Artists themselves become a platform. Digital Asset allow artistes, especially upcoming ones, to create an ecosystem that allows genuine fans to buy into their market'
          )}
        </p>
        <Stack display={'flex'} mt={10} width={'10%'} justifyContent={'space-between'} flexDirection={'row'}>
          <IoCaretBackOutline color="white" size={20} />
          <IoCaretForwardOutline color="white" size={20} />
        </Stack>
      </div>
      <div className="left-section">
        <div className="left-section-gradiant"></div>
        <img src={AssetImage} />
      </div>
    </div>
  );
};
