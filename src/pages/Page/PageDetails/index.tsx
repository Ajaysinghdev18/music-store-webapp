import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

import { CMSApi } from '../../../apis';
import { ROUTES } from '../../../constants';
import {
  TabTitle,
  metaTagByDesc,
  metaTagByKey,
  metaTagByTitle,
  metaTagByWeb
} from '../../../utils/generaltittlefunction';

export const PageDetailScreen = () => {
  const [htmlContent, setHtmlContent] = useState('');
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    CMSApi.readbyId(id).then((res) => {
      setHtmlContent(res?.templates?.contentHtml);
      const styleElement = document.createElement('style');
      styleElement.innerHTML = res?.templates?.cssContent;
      document.head.appendChild(styleElement);
    });
  }, []);
  if (history.location.pathname === ROUTES.PAGES.DETAIL.replace(':id', id)) {
    TabTitle(`${id.replaceAll('-', ' ')} ${t('Common.Pages - Digital Music Shopping Market Place')}`);
  }

  if (history.location.pathname === ROUTES.PAGES.DETAIL.replace(':id', id)) {
    metaTagByTitle(`${id.replaceAll('-', ' ')} ${t('Common.Pages - Digital Music Shopping Market Place')}`);
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
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};
