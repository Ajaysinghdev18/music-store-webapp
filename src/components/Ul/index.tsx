import React, { FC } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import './styles.scss';

interface IUlProps {
  underline?: boolean;
  to?: string;
}

export const Ul: FC<IUlProps> = ({ underline = true, to = '#', children }) => {
  return (
    <Link className={classnames('d-ul', { underline })} to={to}>
      <img src="/images/vinyl.png" alt="vinyl" />
      <span className="text-heading4">{children}</span>
    </Link>
  );
};
