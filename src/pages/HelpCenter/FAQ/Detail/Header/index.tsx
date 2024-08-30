import React, { FC } from 'react';

import { Icon } from '../../../../../components';
import './styles.scss';

interface FAQDetailHeaderProps {
  params: any;
}

export const FAQDetailHeaderPage: FC<FAQDetailHeaderProps> = ({ params }) => {
  return (
    <div className="faq-detail-page-header">
      <div className="faq-title">
        <h2 className="text-body1">Music-Store Help Center / FAQ / {params}</h2>
      </div>
      <div className="search-input-wrapper">
        <div className="search-input">
          <Icon name="search" />
          <input placeholder="Discover your issue..." />
        </div>
      </div>
    </div>
  );
};
