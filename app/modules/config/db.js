
import config from './config';

const dbConfig = {
  host: config.get('MYSQL_DB_HOST') || '47.105.67.223',
  port: config.get('MYSQL_DB_PORT') || 3366,
  username: config.get('MYSQL_DB_USER') || 'esdata',
  password: config.get('MYSQL_DB_PASSWORD') || 'xingchao123456',
  database: config.get('MYSQL_DB_NAME') || 'node_server',
  // host: config.get('MYSQL_DB_HOST') || '127.0.0.1',
  // port: config.get('MYSQL_DB_PORT') || 3306,
  // username: config.get('MYSQL_DB_USER') || 'root',
  // password: config.get('MYSQL_DB_PASSWORD') || '',
  // database: config.get('MYSQL_DB_NAME') || 'node_server',
  dialect: 'mysql',
};

export default dbConfig;
