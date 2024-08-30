import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import { ICategory } from '../../../../shared/interfaces';
import './styles.scss';

interface ICategoryProps {
  category: ICategory;
}

export const Category: FC<ICategoryProps> = ({ category }) => {
  const history = useHistory();
  const browseByCategory = () => {
    history.push(`/products?category=${category.id}`);
  };

  return (
    <div className="category" onClick={browseByCategory}>
      <div className="disc-wrapper">
        <img className="disc" src={`/images/discs/disc-${Math.ceil(Math.random() * 12)}.png`} alt="disc" />
        <div className="disc-cover" />
      </div>
      <h3 className="text-heading3 category-name">{category.name}</h3>
    </div>
  );
};
