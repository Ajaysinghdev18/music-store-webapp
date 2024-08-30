// Dependencies
import React, { FC, useCallback, useEffect, useState } from 'react';

import { ArticleApi } from '../../../../../apis';
import { Li, Ul } from '../../../../../components';
import { ROUTES } from '../../../../../constants';
import { IArticle } from '../../../../../shared/interfaces';
import { IFaqCategory, IFaqQuestion } from '../../../../../shared/models';
import { convertToKebabCase } from '../../../../../utils';
import { displayTranslation } from '../../../../../utils/multi-lang';
// Styles
import './styles.scss';
import { getTranslation } from '../../Dashboard';

// Interfaces
interface FAQDetailRightProps {
  group?: IFaqCategory;
  question?: IFaqQuestion;
  params?: any;
}

// Export FAQ page
export const FAQDetailRightPage: FC<FAQDetailRightProps> = ({ group }) => {
  // State
  const [articles, setArticles] = useState<IArticle[]>([]);

  const fetchArticleData = useCallback(() => {
    return ArticleApi.readAll({
      query:{
        $and: [
          { status: 'Published' },
      ]
      },
      options: {
        limit: 4,
        sort: {
          updatedAt: 'desc'
        }
      }
    })
      .then((res) => {
        setArticles(res.articles);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  // On mounted
  useEffect(() => {
    fetchArticleData();
  }, [fetchArticleData]);

  return (
    <div className="group">
      <Ul
        to={ROUTES.HELP_CENTER.FAQ.GROUP.replace(
          ':group',
          convertToKebabCase((group?.title && getTranslation(group?.title)) || '')
        )}
      >
        {group?.title && getTranslation(group?.title)}
      </Ul>
      <div className="nav-links">
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
      <div className="tags underline">
        <img src="/images/tag.png" alt="vinyl" />
        <span className="text-heading4">Tags</span>
      </div>
      <div>
        <button>marketpalce</button>
        <button>widthdrawal</button>
        <button>credit</button>
      </div>
      <div className="tags underline">
        <img src="/images/vinyl.png" alt="vinyl" />
        <span className="text-heading4">Related Articles</span>
      </div>
      <div className="nav-links">
        {articles.map((article, index) => (
          <Li key={index} to={ROUTES.ARTICLE.DETAIL.replace(':id', article.id)}>
            {getTranslation(article.title)}
          </Li>
        ))}
      </div>
    </div>
  );
};
