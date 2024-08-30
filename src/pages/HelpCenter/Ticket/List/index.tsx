// Dependencies
import moment from 'moment';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { TicketApi } from '../../../../apis';
// Components
import { IHeadCell, IconButton, Table } from '../../../../components';
import { ROUTES } from '../../../../constants';
import Footer from '../../../../layout/HelpCenter/Footer';
import { TICKET_STATUS } from '../../../../shared/enums';
import { ITicket } from '../../../../shared/models';
import { getUser } from '../../../../store/selectors';
import {
  TabTitle,
  metaTagByDesc,
  metaTagByKey,
  metaTagByTitle,
  metaTagByWeb
} from '../../../../utils/generaltittlefunction';
// Styles
import './styles.scss';

// Export ticket list page
export const TicketListPage: FC = () => {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>();

  // Get user
  const user = useSelector(getUser);

  // Get history from hook
  const history = useHistory();
  // Fetch data
  const fetchData = useCallback(() => {
    return TicketApi.readAll({
      query: {
        email: user?.email
      },
      options: {
        limit: 5,
        skip: (pageNumber - 1) * 5,
        sort: {
          updatedAt: 'desc'
        }
      }
    })
      .then((res) => {
        setTickets(res.tickets);
        setTotalPage(Math.ceil(res.pagination.total / 5));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pageNumber, user]);

  // Page change handler
  const handlePageChange = (pageN: number) => {
    setPageNumber(pageN);
  };

  const handlePreviewClick = (row: ITicket) => {
    if (row.id) {
      history.push(ROUTES.HELP_CENTER.TICKETS.EDIT.replace(':id', row.id));
    }
  };

  // On mounted
  useEffect(() => {
    if (user?.email) {
      fetchData();
    }
  }, [pageNumber, user]);
  // On ticket status changed

  const handleStatusClick = (row: ITicket, status: TICKET_STATUS) => {
    const newTicket = new FormData();
    Object.entries(row).forEach(([key, value]) => {
      if (key === 'status') {
        newTicket.append(key, status);
      } else {
        newTicket.append(key, value);
      }
    });
    if (row.id) {
      TicketApi.update(row?.id, newTicket)
        .then((res) => {
          fetchData();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // Define head cells
  const headCells: IHeadCell[] = [
    {
      key: 'time',
      label: 'Time',
      render: (row) => moment(row.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      key: 'subject',
      label: 'Subject'
    },
    {
      key: 'category',
      label: 'Category'
    },
    {
      key: 'description',
      label: 'Description'
    },
    {
      key: 'action',
      label: 'Action',
      render: (row) => (
        <div className="ticket-actions">
          <IconButton icon="eye-circle" onClick={() => handlePreviewClick(row)} />
          <IconButton
            icon="remove"
            onClick={() => handleStatusClick(row, TICKET_STATUS.CANCELLED)}
            isDisabled={row.status === 'Cancelled' || row.status === 'Solved'}
          />
          <IconButton
            icon="check-circle"
            onClick={() => handleStatusClick(row, TICKET_STATUS.SOLVED)}
            isDisabled={row.status === 'Cancelled' || row.status === 'Solved'}
          />
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span
          className={
            row.status === 'Processing' ? 'text--magenta' : row.status === 'Solved' ? 'text--lime' : 'text--yellow'
          }
        >
          {row.status}
        </span>
      )
    },
    {
      key: 'id',
      label: 'Order ID',
      align: 'right',
      render: (row) => <p>{row.id}</p>
    }
  ];

  if (!user) {
    return <div className="text-heading1 text--cyan text-center">Please Log in!</div>;
  }

  TabTitle(` Tickets - Digital Music Shopping Market Place`);
  metaTagByTitle(`Tickets - Digital Music Shopping Market Place`);
  metaTagByDesc(
    'Music-Store is founded on values we all share and are ready to stand for. They bring us together well beyond our current products and technologies. They’ve defined our identity since the beginning, and they’ll continue to do so, no matter how our business evolves.'
  );
  metaTagByKey('Music-Store, Nft, Hackers, Explore Through the Most Exciting Music NFT');
  metaTagByWeb(`https://dev.music-store.io${window.location.pathname}`);
  // Return ticket list page
  return (
    <div className="ticket-list-page">
      <div className="title">
        <h2 className="text-heading2 text--regular text--cyan">Tickets</h2>
        <IconButton icon="refresh" />
      </div>
      {user && (
        <Table
          data={tickets}
          headCells={headCells}
          onPageChange={handlePageChange}
          totalPage={totalPage}
          currentPage={pageNumber}
        />
      )}
      <Footer />
    </div>
  );
};
