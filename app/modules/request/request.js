import requestPromise from 'request-promise';
import { $checkResponse } from 'modules/utils';

export const requestApi = async (url, method, params) => $checkResponse(await requestPromise({
  uri: url,
  method,
  ...params,
  json: true,
}));
