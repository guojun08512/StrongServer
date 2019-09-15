
import sequelize from 'modules/db/sequelize';

// const sequelize = require('../../app/modules/db/sequelize');

console.log(sequelize)


sequelize.query("SELECT * FROM users", { type:sequelize.QueryTypes.SELECT });