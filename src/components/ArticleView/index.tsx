// Dependencies
import moment from 'moment';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useHistory } from 'react-router';

// Apis
import { ArticleApi } from '../../apis';
// Constants
import { REACT_APP_API_ASSET_SERVER, ROUTES } from '../../constants';
import i18n from '../../i18n';
import { SCREEN_RESOLUTION } from '../../shared/enums/screen-resolution.enum';
import { useWindowSize } from '../../shared/hooks/useWindowSize';
// Interfaces
import { IArticle } from '../../shared/interfaces';
// Components
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { Pagination } from '../Pagination';
// Styles
import './styles.scss';

// Constant

// Export article view
export const ArticleView: FC = () => {
  // States
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalCnt, setTotalCnt] = useState<number>(0);

  const { isMobile, width } = useWindowSize();
  const history = useHistory();
  const CntPerPage = width ? (width < SCREEN_RESOLUTION.XL ? 2 : 3) : 3;
  // On mounted
  useEffect(() => {
    ArticleApi.readAll({
      query: {
        isFeatured: 'Published'
      },
      options: {
        limit: CntPerPage,
        skip: (pageNumber - 1) * CntPerPage,
        sort: {
          updatedAt: 'desc'
        }
      }
    })
      .then((res) => {
        setArticles(res.articles);
        const { pagination } = res;
        setTotalCnt(pagination.total);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [CntPerPage, pageNumber]);

  // Calc page count
  const pageCnt = useMemo(() => {
    return Math.ceil(totalCnt / CntPerPage);
  }, [totalCnt, CntPerPage]);

  // Return article view
  return (
    <div>
      {isMobile ? (
        <Carousel
          showThumbs={false}
          showStatus={false}
          emulateTouch
          renderArrowPrev={(clickHandler, hasPrev) =>
            hasPrev && (
              <IconButton className="arrow-button" onClick={clickHandler}>
                <Icon name="arrow-left" />
              </IconButton>
            )
          }
          renderArrowNext={(clickHandler, hasNext) =>
            hasNext && (
              <IconButton className="arrow-button" onClick={clickHandler}>
                <Icon name="arrow-right" />
              </IconButton>
            )
          }
          infiniteLoop={true}
          showIndicators={false}
        >
          {articles.map(({ id, thumbnail, title, createdAt }, index) => (
            <div key={index} className="article" onClick={() => history.push(ROUTES.ARTICLE.DETAIL.replace(':id', id))}>
              <div className="article-image">
                <img
                  src={`${REACT_APP_API_ASSET_SERVER}/${thumbnail?.fieldname}/${thumbnail?.filename}`}
                  alt="thumbnail"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <div className="article-text">
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/*@ts-ignore*/}
                <p className="text-body1">{title[i18n.language]}</p>
                <p className="text-body2 text--cyan date">{moment(createdAt).format('DD MMMM YYYY')}</p>
              </div>
            </div>
          ))}
        </Carousel>
      ) : (
        <>
          <div className="article-list">
            {articles.map(({ id, thumbnail, title, createdAt }, index) => (
              <div
                key={index}
                className="article"
                onClick={() => history.push(ROUTES.ARTICLE.DETAIL.replace(':id', id))}
              >
                <div className="article-image">
                  <img
                    src={`${REACT_APP_API_ASSET_SERVER}/${thumbnail?.fieldname}/${thumbnail?.filename}`}
                    alt="thumbnail"
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
                <div className="article-text">
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/*@ts-ignore*/}
                  <p className="text-body1">{title[i18n.language]}</p>
                  <p className="text-body2 text--cyan date">{moment(createdAt).format('DD MMMM YYYY')}</p>
                </div>
              </div>
            ))}
          </div>
          <Pagination placement="center" pageCnt={pageCnt} activePage={pageNumber} onChange={setPageNumber} />
        </>
      )}
    </div>
  );
};
