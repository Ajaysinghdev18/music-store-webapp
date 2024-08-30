import axios, { AxiosRequestConfig, Method } from 'axios';
import { createBrowserHistory } from 'history';

import { ACCESS_TOKEN_KEY, API_SERVER, ROUTES } from '../constants';
import { StorageHelper } from '../helpers';
import i18next from '../i18n';

const history = createBrowserHistory();

const http = axios.create({ baseURL: `${API_SERVER}/api/v1` });
const httpV2 = axios.create({ baseURL: `${API_SERVER}/api/v2` });

const request = (method: Method, url: string, options: AxiosRequestConfig) => {
  const accessToken = StorageHelper.getItem(ACCESS_TOKEN_KEY);
  return http
    .request({
      ...options,
      method,
      url,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      const response = err.response;
      if (response?.status === 401) {
        history.push(ROUTES.HOME);
      }

      const data = response?.data;
      if (!data) {
        history.push(ROUTES.HOME);
      }

      // eslint-disable-next-line no-throw-literal
      throw {
        ...data,
        msg: data?.msg || i18next.t('Common.Network Error!')
      };
    });
};

const Http = {
  get(url: string, params: AxiosRequestConfig['params'] = {}, headers: AxiosRequestConfig['headers'] = {}) {
    return request('GET', url, { params, headers });
  },
  post(url: string, body: AxiosRequestConfig['data'] = {}, headers: AxiosRequestConfig['headers'] = {}) {
    return request('POST', url, { data: body, headers });
  },
  put(url: string, body: AxiosRequestConfig['data'] = {}, headers: AxiosRequestConfig['headers'] = {}) {
    return request('PUT', url, { data: body, headers });
  },
  patch(url: string, body: AxiosRequestConfig['data'] = {}, headers: AxiosRequestConfig['headers'] = {}) {
    return request('PATCH', url, { data: body, headers });
  },
  delete(url: string, body: AxiosRequestConfig['data'] = {}, headers: AxiosRequestConfig['headers'] = {}) {
    return request('DELETE', url, { data: body, headers });
  }
};

const requestV2 = (method: Method, url: string, options: AxiosRequestConfig) => {
  const accessToken = StorageHelper.getItem(ACCESS_TOKEN_KEY);

  return httpV2
    .request({
      ...options,
      method,
      url,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      const response = err.response;
      if (response?.status === 401) {
        history.push(ROUTES.HOME);
      }

      const data = response?.data;
      if (!data) {
        history.push(ROUTES.HOME);
      }

      // eslint-disable-next-line no-throw-literal
      throw {
        ...data,
        msg: data?.msg || 'Network Error!'
      };
    });
};

export const HttpV2 = {
  get(url: string, params: AxiosRequestConfig['params'] = {}, headers: AxiosRequestConfig['headers'] = {}) {
    return requestV2('GET', url, { params, headers });
  },
  post(url: string, body: AxiosRequestConfig['data'] = {}, headers: AxiosRequestConfig['headers'] = {}) {
    return requestV2('POST', url, { data: body, headers });
  },
  put(url: string, body: AxiosRequestConfig['data'] = {}, headers: AxiosRequestConfig['headers'] = {}) {
    return requestV2('PUT', url, { data: body, headers });
  },
  patch(url: string, body: AxiosRequestConfig['data'] = {}, headers: AxiosRequestConfig['headers'] = {}) {
    return requestV2('PATCH', url, { data: body, headers });
  },
  delete(url: string, body: AxiosRequestConfig['data'] = {}, headers: AxiosRequestConfig['headers'] = {}) {
    return requestV2('DELETE', url, { data: body, headers });
  }
};

export default Http;
