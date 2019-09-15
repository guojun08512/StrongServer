
import Sequelize from 'sequelize';

import { db } from 'modules/config';
import { sequelizeLogger } from 'modules/logger';

const logger = require('modules/logger').default;

const sequelize = new Sequelize(db.database, db.username, db.password, {
  host: db.host,
  port: db.port,
  dialect: db.dialect,
  logging: msg => sequelizeLogger.debug(msg),
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  timezone: '+08:00',
});

function isStringField(fieldType) {
  return fieldType instanceof Sequelize.TEXT
    || fieldType instanceof Sequelize.STRING
    || fieldType instanceof Sequelize.UUIDV1
    || fieldType instanceof Sequelize.UUIDV4;
}

const delay = ms => new Promise(res => setTimeout(res, ms));
async function ensureDBConnection() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({});
    return true;
  } catch (e) {
    if (e instanceof Sequelize.ValidationError) {
      throw e;
    }
    console.log(e);
    logger.debug(`sequelize.authenticate failed: ${e.message}`);
    await delay(1000);
    return ensureDBConnection();
  }
}

function startTransaction(func, isolationLevel = Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE) {
  return sequelize.transaction({
    isolationLevel,
  }, func);
}

export default sequelize;
export {
  isStringField,
  ensureDBConnection,
  startTransaction,
};
