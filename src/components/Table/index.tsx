// Dependencies
import React, { FC, ReactNode } from 'react';
import classnames from 'classnames';
import { Button } from '@chakra-ui/core';

// Components
import { IconButton, Pagination } from '..';

// Styles
import './styles.scss';

// Interfaces
export interface IHeadCell {
  key: string;
  label: string;
  align?: 'right' | 'left';
  render?: (row: any) => ReactNode;
}

interface ITableProps {
  headCells: IHeadCell[];
  data: any;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onShowAll?: () => void;
  totalPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  className?:any
}

// Export table
export const Table: FC<ITableProps> = ({
  data,
  headCells,
  totalPage,
  currentPage,
  isRefreshing,
  onRefresh,
  onShowAll,
  onPageChange,
  className
}) => {
  // Return table
  return (
    <div className={`d-table-container ${className}`}>
      {(onRefresh || onShowAll) && (
        <>
          <div className={`d-table-toolbar ${className}`}>
            <div className="d-table-refresh">
              <span className="text-heading4">Last 5 Deposit / Withdraw Records</span>
              <IconButton
                icon="refresh"
                color="lime"
                className={classnames({ refreshing: isRefreshing })}
                onClick={onRefresh}
              />
            </div>
            <Button className="d-outlined-button" onClick={onShowAll}>
              All Records
            </Button>
          </div>
          <div className="d-table-divider" />
        </>
      )}
      <div className="table-container">
        <table className="d-table">
          <thead className="d-table-head">
            <tr className="d-table-row">
              {headCells.map(({ label, align, key }) => (
                <th
                  key={key}
                  className={classnames('d-table-cell', {
                    'd-table-cell--right': align === 'right'
                  })}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="d-table-body">
            {data.length === 0 ?
              <tr className="d-table-row">
                <h2 className="text-heading2 text--regular tex--tcenter text--cyan">No data available</h2>
              </tr>
              : data.map((d: any, index: number) => (
                <tr key={index} className="d-table-row">
                  {headCells.map(({ align, render, key }) => (
                    <td
                      key={key}
                      className={classnames('d-table-cell', {
                        'd-table-cell--right': align === 'right'
                      })}
                    >
                      {render ? render(d) : d[key]}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {totalPage && currentPage && onPageChange && (
        <Pagination pageCnt={totalPage} activePage={currentPage} onChange={onPageChange} />
      )}
    </div>
  );
};
