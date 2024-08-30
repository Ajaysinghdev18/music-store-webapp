// Dependencies
import { Button } from '@chakra-ui/core';
import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';

// Components
import { Icon, Li, Ul } from '../../../components';
// Global constants
import { FAQ, ROUTES } from '../../../constants';
import { convertToKebabCase } from '../../../utils';
import {
  TabTitle,
  metaTagByDesc,
  metaTagByKey,
  metaTagByTitle,
  metaTagByWeb
} from '../../../utils/generaltittlefunction';
import { getTranslation } from '../FAQ';
// Styles
import './styles.scss';

// Constants
const links = [
  {
    path: ROUTES.HELP_CENTER.FAQ.INDEX,
    image: '/images/faq.png',
    hoverImage: '/images/faq-hover.png',
    title: 'FAQ',
    description: 'Browse through our collection of articles, user guides and FAQs.'
  },
  {
    path: ROUTES.HELP_CENTER.TICKETS.INDEX,
    image: '/images/tickets.png',
    hoverImage: '/images/tickets-hover.png',
    title: 'Tickets',
    description: 'View your previous tickets; know their statuses and solutions.'
  }
];

const articles = [
  "I'm a musician or recording artist. How do I work with Music-Store?",
  'What is an NFT?',
  'Fungible? Non-Fungible? What does it all mean?',
  'What do I need to sign up to Music-Store?',
  'Are NFTs bad for the environment?',
  'How can I gift a Music NFT to someone?'
];

// Export help center page
export const HelpCenterPage: FC = () => {
  // States
  const [hoverId, setHoverId] = useState<number>();

  // Hover handler
  const handleHover = (id: number) => () => {
    setHoverId(id);
  };

  // Blur handler
  const handleBlur = () => {
    setHoverId(undefined);
  };

  // Get path from question
  const getPath = (question: string) => {
    const group = FAQ.find(({ questions }) => questions.includes(question));
    if (group) {
      return ROUTES.HELP_CENTER.FAQ.DETAIL.replace(':group', convertToKebabCase(getTranslation(group.title))).replace(
        ':question',
        convertToKebabCase(getTranslation(question))
      );
    }
    return 'no-question';
  };

  TabTitle(` Help Center - Digital Music Shopping Market Place`);
  metaTagByTitle(`Help Center - Digital Music Shopping Market Place`);
  metaTagByDesc(`${articles}`);
  metaTagByKey('Music-Store, Nft, Hackers, Explore Through the Most Exciting Music NFT');
  metaTagByWeb(`https://dev.music-store.io${window.location.pathname}`);

  // Return help center page
  return (
    <div className="help-center-page">
      <div className="lead">
        <div className="title">
          <img src="/images/logo-cyan.png" alt="logo" />
          <span className="text-heading2">Help</span>
        </div>
        <div className="search-input-wrapper">
          <div className="search-input">
            <Icon name="search" />
            <input placeholder="Discover your issue..." />
          </div>
          <Button className="d-button d-button--cyan search-button">Search</Button>
        </div>
      </div>
      <div className="divider" />
      <div className="content">
        <div className="links">
          {links.map(({ path, image, hoverImage, title, description }, index) => (
            <Link key={index} to={path} className="link" onMouseEnter={handleHover(index)} onMouseLeave={handleBlur}>
              <img src={hoverId === index ? hoverImage : image} alt={title} />
              <span className="text-heading4">{title}</span>
              <span className="text-body1">{description}</span>
            </Link>
          ))}
        </div>
        <div className="articles">
          <Ul underline={false}>Popular Articles</Ul>
          {articles.map((question, index) => (
            <Li key={index} to={getPath(question)}>
              {question}
            </Li>
          ))}
        </div>
      </div>
    </div>
  );
};
