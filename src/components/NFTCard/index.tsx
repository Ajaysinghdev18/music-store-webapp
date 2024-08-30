// Dependencies
import React, { FC, useState } from 'react';
import classnames from 'classnames';
import { Button, Flex } from '@chakra-ui/core';
import { Icon } from '../Icon';
// import ipfsClient from "ipfs-http-client";

// Styles
import './styles.scss';

interface INFTCardProps {
  nft: any;
}

// Export nft-card component
export const NFTCard: FC<INFTCardProps> = ({
  nft: { productId: { description, name, thumbnail, music, image, video, type }, isActive = true, isFavorite = false }
}) => {

  // // connect to the default API address http://localhost:5001
  const selectTypeToDownload = (type: string) => {
    switch (type) {
      case "song":
        return music?.url;
      case "image":
        return image?.url;
      case "video":
        return video?.url;
      default:
        return null;
    }
  }
  // Return nft-card component
  return (
    <div
      className={classnames('d-nft-card')}
    >
      <Flex justifyContent="space-between">
        <Icon
          name={isFavorite ? 'heart-fill' : 'heart'}
          className={isFavorite ? 'text--magenta' : 'text--white'}
        />
        <Icon name="bluetooth" />
      </Flex>
      <div className="nft-image-container">
        <img className="nft-image" src={thumbnail.url} alt={name} />
      </div>
      <div className="text--center text-container">
        <h3 className="text-heading3 text--lime">
          {name}
        </h3>
        <p className="text-body1">
          {description}
        </p>
      </div>
      <Flex justifyContent="space-between" className="actions">
        <Button
          leftIcon={() => <Icon name="gift-icon" />}
          className={classnames('d-outlined-button', {
            'd-button--cyan': isActive
          })}
        >
          Gift
        </Button>
        <Button
          leftIcon={() => <Icon name="share" />}
          className={classnames('d-button', {
            'd-button--cyan': isActive
          })}
        >
          Send to your email
        </Button>
        <Button
          leftIcon={() => <Icon name='download-music' />}
          className={classnames('d-button', {
            'd-button--cyan': isActive
          })}
        >
          <a href={selectTypeToDownload(type)} target='_blank' download rel="noopener noreferrer">Download</a>
        </Button>
      </Flex>
    </div>
  );
};
