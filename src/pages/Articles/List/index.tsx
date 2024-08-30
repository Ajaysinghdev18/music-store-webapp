import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import { ArticleApi } from '../../../apis';
import { Pagination } from '../../../components';
import { REACT_APP_API_ASSET_SERVER, ROUTES } from '../../../constants';
import i18n from '../../../i18n';
import { IArticle } from '../../../shared/interfaces';
import {
  TabTitle,
  metaTagByDesc,
  metaTagByKey,
  metaTagByTitle,
  metaTagByWeb
} from '../../../utils/generaltittlefunction';
import './styles.scss';

const pageLimit = 4;

export const ArticleListPage: FC = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [pageCnt, setPageCnt] = useState(0);

  const { t } = useTranslation();

  const history = useHistory();

  const handleGoToDetail = (id: string) => () => {
    history.push(ROUTES.ARTICLE.DETAIL.replace(':id', id));
  };

  useEffect(() => {
    ArticleApi.readAll({
      query: {
        $and: [{ status: 'Published' }]
      },
      options: {
        limit: pageLimit,
        skip: (pageNumber - 1) * pageLimit
      }
    })
      .then((res) => {
        setArticles(res.articles);
        setPageCnt(Math.ceil(res.pagination.total / pageLimit));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pageNumber]);
  if (history.location.pathname === ROUTES.ARTICLE.LIST) {
    TabTitle(t('Common.Article - Digital Music Shopping Market Place'));
  }
  if (history.location.pathname === ROUTES.ARTICLE.LIST) {
    metaTagByTitle(t('Common.Article - Digital Music Shopping Market Place'));
  }
  metaTagByDesc(
    t('Common.Music-Store is founded on values we all share and are ready to stand for.') +
      ' ' +
      t('Common.They bring us together well beyond our current products and technologies.') +
      ' ' +
      t(
        'Common.They’ve defined our identity since the beginning, and they’ll continue to do so, no matter how our business evolves.'
      )
  );
  metaTagByKey(t('Common.Music-Store, Nft, Hackers, Explore Through the Most Exciting Music NFT'));
  metaTagByWeb(`https://dev.music-store.io${window.location.pathname}`);

  return (
    <div className="article-list-page">
      <div className="page-title">
        <h2 className="text-heading2">{t('Articles.NEWS & Articles')}</h2>
      </div>
      <div className="content">
        {articles.map(({ id, description, thumbnail, createdAt, author }, index) => (
          <div key={`item-${index}`} className="article-list-page-content">
            <div className="article-list-page-content-image" onClick={handleGoToDetail(id)}>
              <img
                src={`${REACT_APP_API_ASSET_SERVER}/${thumbnail?.fieldname}/${thumbnail?.filename}`}
                alt="thumbnail"
              />
            </div>
            <div className="article-list-page-content-text">
              <span className="text-body1 mt-20">
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/*@ts-ignore*/}
                {description[i18n.language].length > 120
                  ? `${description[i18n.language].slice(0, 120)}...`
                  : description[i18n.language]}
              </span>
              <span className="text-body2 text--cyan mt-20">{moment(createdAt).format('DD MMMM YYYY')}</span>
            </div>
          </div>
        ))}
        <Pagination pageCnt={pageCnt} activePage={pageNumber} onChange={setPageNumber} />
      </div>
    </div>
  );
};
