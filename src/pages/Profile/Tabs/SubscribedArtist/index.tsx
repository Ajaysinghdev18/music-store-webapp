import { Flex, Spinner, Stack, useToast } from '@chakra-ui/core';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { BiHeart, BiSolidShareAlt } from 'react-icons/bi';
import { useSelector } from 'react-redux';

import { UserApi } from '../../../../apis';
import { Alert } from '../../../../components';
import { CommonCardOutlet } from '../../../../components/Card/CommonCardOutlet';
import { IArtist } from '../../../../shared/interfaces';
import { getUser } from '../../../../store/selectors';
import {
  TabTitle,
  metaTagByDesc,
  metaTagByKey,
  metaTagByTitle,
  metaTagByWeb
} from '../../../../utils/generaltittlefunction';
import './styles.scss';

export const SubscribedArtistTab: FC = () => {
  const [subscribedArtist, setSubscribedArtist] = useState<IArtist[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const user = useSelector(getUser);

  const toast = useToast();

  const fetchSubscribedArtist = useCallback(() => {
    setLoading(true);
    UserApi.getSubscribed(user?.id as string)
      .then((res) => {
        setSubscribedArtist(res.subscribedArtist);
        setLoading(false);
      })
      .catch((err) => {
        toast({
          position: 'top-right',
          render: ({ onClose }) => <Alert message={err.msg} color="red" onClose={onClose} />
        });
      })
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => {
    if (user) {
      fetchSubscribedArtist();
    }
  }, [user]);

  TabTitle('Subscribed Artist- Digital Music Shopping Market Place');
  metaTagByTitle('Subscribed Artist - Digital Music Shopping Market Place');
  metaTagByDesc(
    'Music-Store is founded on values we all share and are ready to stand for. They bring us together well beyond our current products and technologies. They’ve defined our identity since the beginning, and they’ll continue to do so, no matter how our business evolves.'
  );
  metaTagByKey('Music-Store, Nft, Hackers, Explore Through the Most Exciting Music NFT');
  metaTagByWeb(`https://dev.music-store.io${window.location.pathname}`);

  return (
    <>
      {isLoading ? (
        <Flex justifyContent="center" alignItems="center" height={200}>
          <Spinner color="#00Ff00" size="xl" />
        </Flex>
      ) : (
        <div className="liked-products-tab">
          {subscribedArtist.map(({ id, artistURLId, name, thumbnail }, index) => (
            <Stack h={[250, 250, 300, 400, 500]}>
              <CommonCardOutlet image={thumbnail} id={artistURLId as string} productType={'artist'} type="collection">
                <Stack h={'100%'} w="100%">
                  <Stack w="100%" display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                    <Stack w="50%">
                      {' '}
                      <p>{name}</p>{' '}
                    </Stack>
                    <Stack w="20%" display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                      <BiHeart color="white" /> <BiSolidShareAlt color="white" />
                    </Stack>
                  </Stack>
                </Stack>
              </CommonCardOutlet>
            </Stack>
          ))}
        </div>
      )}
    </>
  );
};
