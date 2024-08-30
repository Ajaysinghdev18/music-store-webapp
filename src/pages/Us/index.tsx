import { Box, Stack, Tab, TabPanel, Tabs } from '@chakra-ui/core';
import classnames from 'classnames';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { UsApi } from '../../apis';
import { AnimationOnScroll } from '../../components';
import i18n from '../../i18n';
import { SCREEN_RESOLUTION } from '../../shared/enums/screen-resolution.enum';
import { useWindowSize } from '../../shared/hooks/useWindowSize';
import { IMultiLanguage } from '../../shared/interfaces/multilanguage';
import { IUs } from '../../shared/models';
import { TabTitle, metaTagByDesc, metaTagByKey, metaTagByTitle, metaTagByWeb } from '../../utils/generaltittlefunction';
import './styles.scss';

enum SlideDirection {
  Up = 'up',
  Down = 'down'
}

interface IPanelItem {
  position: 'left' | 'center' | 'right';
  width: 'half' | 'third';
  top?: number | string;
  bottom?: number | string;
  title?: IMultiLanguage;
  description: IMultiLanguage;
}

export const UsPage: FC = () => {
  const [tabId, setTabId] = useState<number>(0);
  const [oldTabId, setOldTabId] = useState<number>();
  const [slideDirection, setSlideDirection] = useState<SlideDirection>();
  const [isScrolling, setIsScrolling] = useState(false);
  const [usData, setUsData] = useState<IUs[]>([]);

  const windowSize = useWindowSize();
  const { t } = useTranslation();

  const isMobile = useMemo(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    () => windowSize && windowSize?.resolution < SCREEN_RESOLUTION.LG,
    [windowSize]
  );

  const handleTabChange = (id: number) => {
    if (id > tabId) {
      setSlideDirection(SlideDirection.Up);
    } else {
      setSlideDirection(SlideDirection.Down);
    }
    setOldTabId(tabId);
    setTabId(id);
    if (id === formattedUsData.length - 1) {
      document.getElementsByTagName('footer')[0].style.display = 'flex';
    } else {
      document.getElementsByTagName('footer')[0].style.display = 'none';
    }
    setTimeout(() => {
      setOldTabId(undefined);
    }, 1000);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!isScrolling) {
      setIsScrolling(true);
      if (e.deltaY > 10 && tabId < formattedUsData.length - 1) {
        handleTabChange(tabId + 1);
      }
      if (e.deltaY < -10 && tabId > 0) {
        handleTabChange(tabId - 1);
      }
      setTimeout(() => setIsScrolling(false), 1000);
    }
  };

  useEffect(() => {
    document.getElementsByTagName('footer')[0].style.display = isMobile ? 'flex' : 'none';
  }, [isMobile]);

  const fetchData = () => {
    UsApi.readAll()
      .then((res) => {
        setUsData(res.us);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const formattedUsData = useMemo<IPanelItem[][]>(() => {
    const result: any[] = [];
    let node: any[] = [];

    usData.forEach((item, index) => {
      if (index % 3 === 0) {
        node.push({
          position: 'left',
          width: 'third',
          top: '27%',
          bottom: '',
          title: item.title,
          description: item.content
        });
      } else if (index % 3 === 1) {
        node.push({
          position: 'right',
          width: 'third',
          top: '',
          bottom: '13%',
          title: item.title,
          description: item.content
        });
        result.push(node);
        node = [];
      } else {
        result.push([
          {
            position: 'center',
            width: 'half',
            bottom: 0,
            title: item.title,
            description: item.content
          }
        ]);
      }
    });
    return result;
  }, [usData]);

  useEffect(() => {
    fetchData();
  }, []);

  TabTitle(t('Common.Us - Digital Music Shopping Market Place'));
  metaTagByTitle(t('Common.Us - Digital Music Shopping Market Place'));
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
    <div className="us-page">
      <AnimationOnScroll animation="animate__bounce" delay={1}>
        <div className="page-title us-page-title">
          <h2 className="text-heading2">{t('Common.Us')}.</h2>
        </div>
      </AnimationOnScroll>
      {!isMobile ? (
        <div className="content" onWheel={isScrolling ? undefined : handleWheel}>
          <div className="tabs-wrapper">
            <Tabs className="tabs">
              {new Array(formattedUsData.length).fill(0).map((_, index) => (
                <Tab
                  key={`tab-${index}`}
                  className={classnames('tab', {
                    bottom: index > tabId,
                    top: index < tabId
                  })}
                  onClick={() => handleTabChange(index)}
                />
              ))}
            </Tabs>
          </div>
          <div className="tab-panels">
            {formattedUsData.map((panel, tIndex) => (
              <TabPanel
                key={`tab-panel-${tIndex}`}
                className={classnames('tab-panel', {
                  block: tIndex === tabId || tIndex === oldTabId,
                  [`slide-${slideDirection}`]: tIndex === tabId,
                  [`hidden-${slideDirection}`]: tIndex === oldTabId
                })}
              >
                {panel.map(({ title, description, width, position, bottom, top }, pIndex) => (
                  <div
                    key={`panel-item-${pIndex}`}
                    className={`panel-item ${width} ${position}`}
                    style={{ bottom, top }}
                  >
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/* @ts-ignore */}
                    <h3 className="text-heading3">{title && title[i18n.language]}</h3>
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/* @ts-ignore */}
                    <p className="text-body1">{description && description[i18n.language]}</p>
                  </div>
                ))}
              </TabPanel>
            ))}
          </div>
        </div>
      ) : (
        <Stack className="mobile-view" spacing={20} direction="column">
          {formattedUsData.map((panel, pIndex) =>
            panel.map((item, index) => (
              <Box key={`panel-item-${pIndex}-${index}`} className="panel-item">
                <h3 className="text-heading3">{item.title}</h3>
                <p className="text-body1">{item.description}</p>
              </Box>
            ))
          )}
        </Stack>
      )}
    </div>
  );
};
