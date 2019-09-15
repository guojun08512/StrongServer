
import Acl from 'acl';
import AclSeq from 'acl-sequelize';
import Sequelize from 'sequelize';
import sequelize from 'modules/db/sequelize';

class Acls {
  constructor() {
    this.acl = null;
  }
  createAcl() {
    if (!this.acl) {
      this.acl = new Acl(new AclSeq(sequelize, {
        prefix: 'acl_',
        defaultSchema: {
          key: {
            type: Sequelize.STRING,
            primaryKey: true,
          },
          value: {
            type: Sequelize.TEXT,
          },
        },
      }));
    }
    return this.acl;
  }
}

const acl = new Acls();

export default acl;
