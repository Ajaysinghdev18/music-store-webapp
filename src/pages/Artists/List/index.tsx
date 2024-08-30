import { Stack } from '@chakra-ui/core';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BiHeart, BiSolidShareAlt } from 'react-icons/bi';
import { useHistory } from 'react-router-dom';

import { ArtistApi } from '../../../apis';
import { Currency } from '../../../assets/icons';
import { Pagination } from '../../../components';
import { CommonCardOutlet } from '../../../components/Card/CommonCardOutlet';
import { ROUTES } from '../../../constants';
import { IArtist } from '../../../shared/interfaces';
import {
  TabTitle,
  metaTagByDesc,
  metaTagByKey,
  metaTagByTitle,
  metaTagByWeb
} from '../../../utils/generaltittlefunction';
import './styles.scss';

const pageLimit = 12;

export const ArtistListPage: FC = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [artists, setArtists] = useState<IArtist[]>([]);
  const [pageCnt, setPageCnt] = useState(0);
  const history = useHistory();
  const { t } = useTranslation();
  useEffect(() => {
    ArtistApi.readAll({
      options: {
        limit: pageLimit,
        skip: (pageNumber - 1) * pageLimit,
        isFeatured: true
      }
    })
      .then((res) => {
        setArtists(res.artists);
        setPageCnt(Math.ceil(res.pagination.total / pageLimit));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pageNumber]);
  if (history.location.pathname === ROUTES.ARTIST.LIST) {
    TabTitle(t('Common.Artist - Digital Music Shopping Market Place'));
  }

  if (history.location.pathname === ROUTES.ARTIST.LIST) {
    metaTagByTitle(t('Common.Artist - Digital Music Shopping Market Place'));
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
    <div className="artist-list-page">
      <div className="content">
        <div className="artists">
          {artists.map(({ id, name, artistURLId, thumbnail }, index) => (
            <Stack h={[250, 250, 300, 400, 500]}>
              <CommonCardOutlet image={thumbnail} id={artistURLId as string} productType={'artist'} type="collection">
                <Stack h={'100%'} w="100%">
                  <Stack w="100%" display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                    <Stack w="50%">
                      {' '}
                      <p className="text-body">{name}</p>{' '}
                    </Stack>
                    <Stack w="20%" display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                      <BiHeart color="white" size={30} cursor={'pointer'} />{' '}
                      <BiSolidShareAlt color="white" cursor={'pointer'} size={30} />
                    </Stack>
                  </Stack>
                </Stack>
              </CommonCardOutlet>
            </Stack>
          ))}
        </div>
        <Pagination pageCnt={pageCnt} activePage={pageNumber} onChange={setPageNumber} />
      </div>
    </div>
  );
};
