import { Flex, Spinner, Stack } from '@chakra-ui/core';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';

import { CMSApi } from '../../apis';
import { ROUTES } from '../../constants';
import { TabTitle, metaTagByDesc, metaTagByKey, metaTagByTitle, metaTagByWeb } from '../../utils/generaltittlefunction';
import './style.scss';

export const PageListScreen = () => {
  const [pages, setPages] = useState([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const history = useHistory();
  const { t } = useTranslation();
  useEffect(() => {
    setLoading(true);
    CMSApi.readAll({
      query: {
        template_type: 'published'
      }
    })
      .then((res) => {
        setLoading(false);
        setPages(res.templates);
        res.templates.map((temp: any) => {
          const styleElement = document.createElement('style');
          styleElement.innerHTML = temp?.cssContent;
          document.head.appendChild(styleElement);
        });
      })
      .catch((e) => {
        setLoading(false);
      });
  }, []);
  if (history.location.pathname === ROUTES.PAGES.LIST) {
    TabTitle(t('Common.Pages - Digital Music Shopping Market Place'));
  }

  if (history.location.pathname === ROUTES.PAGES.LIST) {
    metaTagByTitle(t('Common.Pages - Digital Music Shopping Market Place'));
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
    <div className="page-list">
      {isLoading ? (
        <Flex justifyContent="center" width={'100%'} alignItems="center" height={200}>
          <Spinner color="#00Ff00" size="xl" />
        </Flex>
      ) : pages.length === 0 ? (
        <Stack>
          <p className="text-body2">Not Data Found</p>
        </Stack>
      ) : (
        <div className="page-section-main">
          {pages?.map((item: any) => {
            return (
              <Stack h={[400, 400, 400, 450, 550]} alignItems={'center'} overflow={'hidden'}>
                <Link to={`/pages/${item._id}`}>
                  <div dangerouslySetInnerHTML={{ __html: item.contentHtml }} />
                </Link>
              </Stack>
            );
          })}
        </div>
      )}
    </div>
  );
};
