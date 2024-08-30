// Dependencies
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';

import { PrivacyApi } from '../../apis';
// Components
import { AnimationOnScroll } from '../../components';
import { IPrivacy } from '../../shared/models';
import { TabTitle, metaTagByDesc, metaTagByKey, metaTagByTitle, metaTagByWeb } from '../../utils/generaltittlefunction';
// Styles
import './styles.scss';

// Export privacy statement page
export const PrivacyStatementPage: FC = () => {
  const [privacyData, setPrivacyData] = useState<IPrivacy>();

  const plainToHtml = (plain: string) => {
    return plain.replace(/\r?\n/g, '<br />');
  };

  // Fetch data
  const fetchData = () => {
    PrivacyApi.read()
      .then((res) => {
        setPrivacyData(res.body);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // On mounted
  useEffect(() => {
    fetchData();
  }, []);
  // Return privacy statement page
  TabTitle(` Privacy Statement - Digital Music Shopping Market Place`);
  metaTagByTitle(`Privacy Statement - Digital Music Shopping Market Place`);
  metaTagByDesc(
    'Privacy (UK: , US: ) is the ability of an individual or group to seclude themselves or information about themselves,and thereby express themselves selectively.'
  );
  metaTagByKey('Music-Store, Nft, Hackers, Explore Through the Most Exciting Music NFT');
  metaTagByWeb(`https://dev.music-store.io${window.location.pathname}`);

  return (
    <div className="privacy-statement-page">
      <AnimationOnScroll animation="animate__bounce" delay={0.5}>
        <div className="page-title">
          <h2 className="text-heading2">{privacyData?.title}</h2>
        </div>
      </AnimationOnScroll>
      <div className="content">
        <AnimationOnScroll animation="animate__fadeIn">
          <div
            className="text-body1 page-content"
            dangerouslySetInnerHTML={{ __html: plainToHtml(privacyData?.content || '') }}
          />
          {/*<p className="text-body1">{privacyData?.content}</p>*/}
        </AnimationOnScroll>
        <div className="divider" />
        <p className="text-body2">Updated: {moment(privacyData?.updatedAt).format('MMMM DD,  YYYY')}</p>
      </div>
    </div>
  );
};
