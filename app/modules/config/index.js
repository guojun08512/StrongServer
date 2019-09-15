
import base from './base';
import db from './db';
import config from './config';
import mail from './mail';

export {
  base,
  db,
  mail,
};

export default {
  ...config,
};
