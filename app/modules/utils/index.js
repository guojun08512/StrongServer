
import logger from 'modules/logger';
import * as ERROR from './error';

export const $required = (key, value) => {
  if (value === '' || value === null || value === undefined) {
    return ERROR.paramsExpect(key);
  }
  return true;
};

export const $checkResponse = (response) => {
  if (response.code !== 200) {
    throw new Error(`${response.message}(${response.errMsg})`);
  }
  return response.data;
};


/*
desc: 转换为当地时间
param: utcTime。  Date类型
return: 当前时间的字符串。
*/
export const utcTolocaleTime = (utcTime) => {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  let localeTime = utcTime.getTime();
  if (Math.abs(offset) > 0) {
    localeTime = new Date(localeTime);
    return localeTime.toLocaleString();
  }
  localeTime += 28800000;
  localeTime = new Date(localeTime);
  return localeTime.toLocaleString();
};

export const converSqlToJson = (sql) => {
  try {
    return JSON.parse(JSON.stringify(sql)); // eslint-disbale-line
  } catch (err) {
    logger.error('converSqlToJson error: ', err);
  }
  return sql;
};

const getOrderTime = () => {
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const tmpTimeStramp = String(date.getTime());
  const strTimeStramp = tmpTimeStramp.substr(tmpTimeStramp.length - 8, 8);
  return `${month}${day}${strTimeStramp}`;
};

const createRandomNumber = () => Math.floor(Math.random(0) * 10000);

export const createOrderNum = (from) => {
  const timeNumber = getOrderTime();
  const randNUmber = createRandomNumber();
  return `${from}${timeNumber}${randNUmber}`;
};

export default ERROR;
