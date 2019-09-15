// import config from 'modules/config';
import logger from 'modules/logger';
import ERROR from 'modules/utils';
// import { sendMailToDeveloper } from 'modules/sendmail';

export default () => (ctx, next) => next().catch((err) => {
  if (ERROR.isCCError(err)) {
    logger.error(`Server error: ${err.errMsg}`);
    ctx.error(err.message, err.errMsg, err.data, err.code);
  } else {
    logger.error(`Server error: ${err.status} | ${err.message} | ${err.stack}`);
    // sendMailToDeveloper(`${config.get('HOST_URL')} === Server error: ${err.message}, ${err.stack}`, 'ImageServer Error');
    switch (err.status) {
      case 401:
        ctx.error('Authentication Error', 'Access token is invalid.', null, 1001);
        break;
      default:
        ctx.error('Server error', err.message, err.stack, 500);
    }
  }
});
