
import { IQuery } from '../shared/interfaces';
import Http from './http';

export const readAll = (query?: IQuery) => {
    return Http.get('/cms', query);
};
export const readbyId = (id?: any) => {
    return Http.get(`/cms/${id}`);
};