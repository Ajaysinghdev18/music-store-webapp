import moment from 'moment';
import React, { FC } from 'react';

import { IconButton } from '../../../../../components';
import { IFaqQuestion } from '../../../../../shared/models';
import { plainToHtml } from '../../../../../utils';
import './styles.scss';
import { getTranslation } from '../../Dashboard';
import i18n from '../../../../../i18n';
import { displayTranslation } from '../../../../../utils/multi-lang';

interface FAQDetailLeftProps {
  question?: IFaqQuestion;
}
export const FAQDetailLeftPage: FC<FAQDetailLeftProps> = ({ question }) => {
  
  return (
    <div className="detail">
      <div className="detail-header">
        <h2 className="text-heading2 text--regular text--cyan">
          {question?.title && getTranslation(question?.title)}
        </h2>
        <IconButton icon="pdf" marginLeft="auto" />
        <IconButton icon="print" marginLeft="32px" />
      </div>
      <div
        className="text-body1 page-content"
        dangerouslySetInnerHTML={{
          __html: plainToHtml((question?.answer && getTranslation(question?.answer)) || '')
        }}
      >
        </div>
      <h2 className="text-body2">
        Updated{' '}
        {question?.updatedAt
          ? moment().diff(question?.updatedAt, 'days') === 0
            ? 'today'
            : moment().diff(question?.updatedAt, 'days') + ' days ago'
          : ''}
      </h2>
      <div className="detail-page-footer">
        <div className="detail-page-footer-subcontent">
          <h2 className="text-body1 text-bold">Helpful?</h2>
          <IconButton icon="hand-up" marginLeft="24px" />
          <IconButton icon="hand-down" marginLeft="24px" />
        </div>
        <div className="detail-page-footer-subcontent">
          <IconButton icon="twitter" marginLeft="24px" />
          <IconButton icon="facebook" marginLeft="24px" />
          <IconButton icon="instagram" marginLeft="24px" />
        </div>
      </div>
    </div>
  );
};
