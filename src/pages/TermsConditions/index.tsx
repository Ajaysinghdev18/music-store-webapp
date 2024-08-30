// Dependencies
// Moment
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';

import { TermApi } from '../../apis';
// Components
import { AnimationOnScroll } from '../../components';
import { ITerm } from '../../shared/models';
import { TabTitle, metaTagByDesc, metaTagByKey, metaTagByTitle, metaTagByWeb } from '../../utils/generaltittlefunction';
// Styles
import './styles.scss';

const plainToHtml = (plain: string) => {
  return plain.replace(/\r?\n/g, '<br />');
};

// Export terms & conditions page
export const TermsConditionsPage: FC = () => {
  const [termData, setTermData] = useState<ITerm>();

  // Fetch data
  const fetchData = () => {
    TermApi.read()
      .then((res) => {
        setTermData(res.body);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // On mounted
  useEffect(() => {
    fetchData();
  }, []);

  // Return terms & conditions page
  TabTitle(`Terms & Conditions- Digital Music Shopping Market Place`);
  metaTagByTitle(`Terms & Conditions - Digital Music Shopping Market Place`);
  metaTagByDesc(` Terms for Syriac Christians are endonymic (native) and exonymic (foreign) terms, that are used as designations for
  Syriac Christians, as adherents of Syriac Christianity. In its widest scope, Syriac Christianity encompass all
  Christian denominations that follow East Syriac Rite or West Syriac Rite, and thus use Classical Syriac as their
  main liturgical language.`);
  metaTagByKey('Music-Store, Nft, Hackers, Explore Through the Most Exciting Music NFT');
  metaTagByWeb(`https://dev.music-store.io${window.location.pathname}`);

  return (
    <div className="terms-conditions-page">
      <AnimationOnScroll animation="animate__bounce" delay={0.5}>
        <div className="page-title">
          <h2 className="text-heading2">{termData?.title}</h2>
        </div>
      </AnimationOnScroll>
      <div className="content">
        <AnimationOnScroll animation="animate__fadeIn">
          <div
            className="text-body1 page-content"
            dangerouslySetInnerHTML={{ __html: plainToHtml(termData?.content || '') }}
          />
          {/*<p className="text-body1">{termData?.content}</p>*/}
        </AnimationOnScroll>
        <div className="divider" />
        <p className="text-body2">Updated: {moment(termData?.updatedAt).format('MMMM DD,  YYYY')}</p>
      </div>
    </div>
  );
};
