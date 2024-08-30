import Http from './http';

export const create = (ticket: any) => {
  return Http.post('/tickets', ticket);
};

export const readAll = (params?: { query?: any; projection?: any; options?: any; aggregate?: any }) => {
  return Http.get('/tickets', params);
};

export const read = (id: string) => {
  return Http.get(`/tickets/${id}`);
};

export const update = (id: string, ticket: any) => {
  return Http.patch(`/tickets/${id}`, ticket);
};

export const favoriteTickets = (ticketsIdArray: any) => {
  return Http.post('/tickets/favorite', ticketsIdArray);
};
export const archieveTickets = (ticketsIdArray: any) => {
  return Http.post('/tickets/archieve', ticketsIdArray);
};
export const deleteTickets = (ticketsIdArray: any) => {
  return Http.delete('/tickets/delete', ticketsIdArray);
};

export const remove = (id: string): Promise<any> => {
  return Http.delete(`/tickets/${id}`);
};
