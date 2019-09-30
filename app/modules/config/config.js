import nconf from 'nconf';
import path from 'path';

nconf.argv();
nconf.env();
nconf.defaults({
  NODE_ENV: 'development',
  NODE_PORT: 8888,
  WOKER_COUNT: 3,
  VERSION: 'V0.1.0',

  HOST_URL: 'http://127.0.0.1:8888',
  SEARCH_SERVER: 'http://47.105.67.223:7000/v1',
  // SEARCH_SERVER: 'http://127.0.0.1:7003/v1',
  PAY_SERVER: 'http://127.0.0.1:9000/v1',

  SMTP_HOST: 'smtp.exmail.qq.com',
  SMTP_PORT: 465,
  SMTP_USER: 'no-reply@keyayun.com',
  SMTP_PASSWORD: 'IPhCagtogCitNe1',
  SMTP_REQUIRE_TLS: true,

  NOTE_KEY: 'LTAIatLnNrtSkFrT',
  NOTE_SECRET: 'eLHLv9JFgP5V4yoC48GJhnsV0Kmzo1',

  PUBLIC_KEY: 'Xingchao2018',

  LOG_DIR: path.join(process.cwd(), '..', 'logs'),
  UPLOAD: path.join(process.cwd(), 'public'),
  LOG_MAXSIZE: 1024 * 1024 * 10,

  // SERVER_REDIS_DB_URL: 'redis://47.105.67.223:6379/0',
  SERVER_REDIS_DB_URL: 'redis://127.0.0.1:6379/0',

  // 管理员手机号
  Cellphones: '17611421661,17612345678',
  PassWord: '1111',

  // 硬件设备list
  HardWarelist: {
    1: { name: '中心主机', field: 'devid' },
    2: { name: '跑步机', field: 'id' },
  },
});

export default {
  get: key => nconf.get(key),
  getBoolean: (key) => {
    let val = nconf.get(key);
    if (typeof val === 'string') {
      val = val.toLowerCase();
      return val === 'true' || val === 'yes';
    }
    return Boolean(val);
  },
  getNumber: key => Number(nconf.get(key)),
};
