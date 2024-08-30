import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FaqApi } from '../../../../apis';
import { IFaqCategory, IFaqQuestion } from '../../../../shared/models';
import { convertToKebabCase } from '../../../../utils';
import {
  TabTitle,
  metaTagByDesc,
  metaTagByKey,
  metaTagByTitle,
  metaTagByWeb
} from '../../../../utils/generaltittlefunction';
import { displayTranslation } from '../../../../utils/multi-lang';
import { getTranslation } from '../Dashboard';
import { FAQDetailHeaderPage } from './Header';
import { FAQDetailLeftPage } from './LeftContent';
import { FAQDetailRightPage } from './RightContent';
import './styles.scss';

export const FAQDetailPage: FC = () => {
  const [categories, setCategories] = useState<IFaqCategory[]>([]);
  const [question, setQuestion] = useState<IFaqQuestion>();

  const params = useParams<{ group: string; question: string }>();

  const fetchCategories = () => {
    FaqApi.readCategories()
      .then((res) => {
        setCategories(res.faqCategories);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const group = useMemo(() => {
    return categories.find(({ title }) =>
      convertToKebabCase(getTranslation(title)).includes(getTranslation(params.group))
    );
  }, [categories, params]);

  const fetchQuestion = useCallback(() => {
    FaqApi.readQuestions()
      .then((res) => {
        if (res.faqQuestions) {
          res.faqQuestions.map((item: any) => {
            if (convertToKebabCase(getTranslation(item.title)) === params.question) {
              setQuestion(item);
            }
            return item;
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [params]);

  useEffect(() => {
    fetchQuestion();
  }, [params, fetchQuestion]);
  TabTitle(` ${getTranslation(group?.title)} - Digital Music Shopping Market Place`);
  metaTagByTitle(`${getTranslation(group?.title)}  - Digital Music Shopping Market Place`);
  metaTagByDesc(` ${group?.questions}`);
  metaTagByKey(` ${group?.questions} Music-Store, Nft, Hackers, Explore Through the Most Exciting Music NFT`);
  metaTagByWeb(`https://dev.music-store.io${window.location.pathname}`);
  return (
    <div className="faq-detail-page">
      <FAQDetailHeaderPage
        params={`${group?.title && getTranslation(group?.title)} / ${getTranslation(params.question)}`}
      />
      <div className="faq-detail-page-content">
        <FAQDetailLeftPage question={question} />
        <FAQDetailRightPage group={group} question={question} params={params} />
      </div>
    </div>
  );
};
