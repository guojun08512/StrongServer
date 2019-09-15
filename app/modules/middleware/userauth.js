
import logger from 'modules/logger';
import * as User from 'modules/users';

const getClientIp = req => (req.headers['x-forwarded-for'] ||
  req.connection.remoteAddress ||
  req.socket.remoteAddress ||
  req.connection.socket.remoteAddress);

export default async (ctx, next) => {
  const token = ctx.request.header.authorization;
  if (token) {
    try {
      ctx.userInfo = User.getAuthInfo(token);
      logger.info(`login User: ${JSON.stringify(ctx.userInfo)}  login IP: ${getClientIp(ctx.req)}`);
    } catch (error) {
      throw error;
    }
  }
  await next();
};
