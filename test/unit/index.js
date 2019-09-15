
import fs from 'fs';
import path from 'path';
import { ensureDBConnection } from '../../app/modules/db';
import { userSetup } from '../../app/modules/users';
import models from 'modules/db/models'; // eslint-disable-line

const modules = fs.readdirSync(__dirname).filter(dirname => dirname !== 'index.js');

describe('data server->', () => {
  before(async () => {
    await ensureDBConnection();
    await userSetup();
  });

  modules.forEach((moduleName) => {
    describe(`${moduleName}->`, async () => {
      const files = fs.readdirSync(path.join(__dirname, moduleName));
      files.forEach((file) => {
        if (file.indexOf('authenticate.js') === -1) {
          const unit = require(path.join(__dirname, moduleName, file)); //eslint-disable-line
          describe(unit.description, unit.func);
        }
      });
    });
  });
});
