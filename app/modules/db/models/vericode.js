
// 短信验证码
export function create(sequelize, DataTypes) {
  const VeriCode = sequelize.define('VeriCode', {
    // 电话号
    cellphone: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    // 验证码
    code: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    defaultScope: {
      where: {
        deleted: false,
      },
    },
  });
  VeriCode.associate = () => {};
  return VeriCode;
}
