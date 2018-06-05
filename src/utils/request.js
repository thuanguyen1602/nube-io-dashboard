import fetch from 'dva/fetch';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../index';

const codeMessage = {
  200: 'The request has succeeded.',
  201: 'The request has been fulfilled and resulted in a new resource being created.',
  202: 'The request has been accepted for processing, but the processing has not been completed.',
  204: 'The server has fulfilled the request but does not need to return an entity-body.',
  400: 'The request could not be understood by the server due to malformed syntax.',
  401: 'The request requires user authentication.',
  403: 'The server understood the request, but is refusing to fulfill it.',
  404: 'The server has not found anything matching the Request-URI.',
  406: 'The server does not have a current representation that would be acceptable to the user agent',
  410: 'The requested resource is no longer available at the server and no forwarding address is known.',
  422: 'The request was well-formed but was unable to be followed due to semantic errors.',
  500: 'The server encountered an unexpected condition which prevented it from fulfilling the request.',
  502: 'The server was acting as a gateway or proxy and received an invalid response from the upstream server.',
  503: 'The server is currently unable to handle the request due to a temporary overloading or maintenance of the server.',
  504: 'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.',
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `Request error ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .catch(e => {
      if (!newOptions.doNotReroute) {
        const { dispatch } = store;
        const status = e.name;
        if (status === 401) {
          dispatch({
            type: 'login/logout',
          });
          return;
        }
        if (status === 403) {
          dispatch(routerRedux.push('/exception/403'));
          return;
        }
        if (status <= 504 && status >= 500) {
          dispatch(routerRedux.push('/exception/500'));
          return;
        }
        if (status >= 404 && status < 422) {
          dispatch(routerRedux.push('/exception/404'));
        }
      }
    });
}
