
import jwt from 'jsonwebtoken';
import config from 'modules/config';

export const createToken = userInfo => jwt.sign(userInfo, config.get('PUBLIC_KEY'), { expiresIn: '7d' });

export const getAuthInfo = token => jwt.verify(token.substr(7), config.get('PUBLIC_KEY'));
