import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ArticleApi } from '../../../apis';
import { ArticleView } from '../../../components';
import { REACT_APP_API_ASSET_SERVER } from '../../../constants';
import { IArticle } from '../../../shared/interfaces';
import i18n from '../../../i18n';
import './styles.scss';

export const ArticleDetailPage: FC = () => {
  const [article, setArticle] = useState<IArticle>();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    ArticleApi.read(id)
      .then((res) => {
        setArticle(res.article);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  return (
    <div className="article-detail-page">
      <div className="section detail-section">
        <img
          src={`${REACT_APP_API_ASSET_SERVER}/${article?.thumbnail?.fieldname}/${article?.thumbnail?.filename}`}
          alt="thumbnail"
        />
        <h2 className="text-heading2 mt-20">{article?.title && article?.title[i18n.language]}</h2>
        <span className="text-body2 text--cyan mt-5">{moment(article?.createdAt).format('DD MMMM YYYY')}</span>
        <span className="text-body2 mt-5">
          By <span className="text--cyan">{article?.author}</span>
        </span>
        <div className="article-list-page-content mt-20">
          <p className="text-body2 mt-15 ">{article?.description && article?.description[i18n.language]}</p>
        </div>
        <hr className="divider mt-15" />
        <p className="text-body2 mt-5">
          By <span className="text--cyan">{article?.author}</span>
        </p>
      </div>
      <div className="section article-slider">
        <h2 className="text-heading2 text--magenta text--center">More like this</h2>
        <ArticleView />
      </div>
    </div>
  );
};
