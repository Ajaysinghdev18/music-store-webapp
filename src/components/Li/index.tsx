// Dependencies
import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';

// Global constants
import { ROUTES } from '../../constants';

// Styles
import './styles.scss';

// Interfaces
interface ILiProps {
  to?: string;
}

// Export Li component
export const Li: FC<ILiProps> = ({ to = ROUTES.HELP_CENTER.INDEX, children }) => {
  // Return Li component
  return (
    <NavLink className="d-li" to={to} exact>
      <img src="/images/paper.png" alt="paper" />
      <span className="text-heading4">{children}</span>
    </NavLink>
  );
};
