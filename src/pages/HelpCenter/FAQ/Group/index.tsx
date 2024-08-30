import React, { FC, useEffect, useMemo, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';

import { FaqApi } from '../../../../apis';
import { Li, Ul } from '../../../../components';
import { ROUTES } from '../../../../constants';
import { IFaqCategory } from '../../../../shared/models';
import { convertToKebabCase } from '../../../../utils';
import { displayTranslation } from '../../../../utils/multi-lang';
import './styles.scss';
import { IMultiLanguage } from '../../../../shared/interfaces';
import { getTranslation } from '../Dashboard';

export const FAQGroupPage: FC = () => {
  const [categories, setCategories] = useState<IFaqCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams<{ group: string }>();

  const fetchCategories = () => {
    FaqApi.readCategories()
      .then((res) => {
        setCategories(res.faqCategories);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const group = useMemo(() => {
    const ret = categories.find(({ title }) => convertToKebabCase(getTranslation(title)).includes(getTranslation(params.group)));
    return ret;
  }, [params, categories]);

  const logo = (group: IMultiLanguage | undefined) => {
    return null;
  }
  
  if (isLoading) {
    return <>Loading</>
  }
  
  return (
    <div className="faq-group-page">
      <div className="questions">
        {group?.questions.map((question, index) => (
          <Li
            key={index}
            to={ROUTES.HELP_CENTER.FAQ.DETAIL.replace(
              ':group',
              convertToKebabCase(getTranslation(group.title))
            ).replace(':question', convertToKebabCase(getTranslation(question.title)))}
          >
            {getTranslation(question.title)}
          </Li>
        ))}
      </div>
      <div className="group">
        <Ul>{ group?.title ? getTranslation(group.title) : 'FAQ'}</Ul>
        <div className="nav-links">
          {categories.map(({ title }, index) => (
            <NavLink
              key={index}
              to={ROUTES.HELP_CENTER.FAQ.GROUP.replace(':group', convertToKebabCase(getTranslation(title)))}
              exact
            >
              { getTranslation(title) }
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};
