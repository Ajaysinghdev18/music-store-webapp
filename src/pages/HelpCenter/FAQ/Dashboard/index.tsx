import React, { FC, useEffect, useState } from 'react';

import { FaqApi } from '../../../../apis';
import { Li, Ul } from '../../../../components';
import { REACT_APP_LANG_KEY, ROUTES } from '../../../../constants';
import { StorageHelper } from '../../../../helpers';
import i18n from '../../../../i18n';
import { IFaqCategory } from '../../../../shared/models';
import { convertToKebabCase } from '../../../../utils';
import { TabTitle, metaTagByDesc, metaTagByKey, metaTagByTitle } from '../../../../utils/generaltittlefunction';
import { displayTranslation } from '../../../../utils/multi-lang';
import './styles.scss';

export const getTranslation = (text: any) => {
  const lang = StorageHelper.getItem(REACT_APP_LANG_KEY);
  return typeof text === 'object' ? displayTranslation(text, lang) : text;
};
export const FAQPage: FC = () => {
  const [categories, setCategories] = useState<IFaqCategory[]>([]);

  const fetchCategories = () => {
    FaqApi.readCategories()
      .then((res) => {
        setCategories(res.faqCategories);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //
  useEffect(() => {
    fetchCategories();
  }, []);

  TabTitle(` FAQ - Digital Music Shopping Market Place`);
  metaTagByTitle(`FAQ - Digital Music Shopping Market Place`);
  metaTagByDesc(
    `Music-Store is founded on values we all share and are ready to stand for. They bring us together well beyond our current products and technologies. They’ve defined our identity since the beginning, and they’ll continue to do so, no matter how our business evolves.`
  );
  metaTagByKey('Music-Store, Nft, Hackers, Explore Through the Most Exciting Music NFT');

  return (
    <div className="faq-page">
      {categories.map(({ title, questions }, fIndex) => (
        <div key={fIndex}>
          <Ul to={ROUTES.HELP_CENTER.FAQ.GROUP.replace(':group', convertToKebabCase(title[i18n.language]))}>
            {title[i18n.language]}
          </Ul>
          {questions.map((question, qIndex) => (
            <Li
              key={qIndex}
              to={ROUTES.HELP_CENTER.FAQ.DETAIL.replace(':group', convertToKebabCase(title[i18n.language])).replace(
                ':question',
                convertToKebabCase(question.title[i18n.language])
              )}
            >
              {question.title[i18n.language]}
            </Li>
          ))}
        </div>
      ))}
    </div>
  );
};
