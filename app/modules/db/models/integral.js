
// 积分log表
export function create(sequelize, DataTypes) {
  const Integral = sequelize.define('Integral', {
    uid: {
      type: DataTypes.UUID,
      validate: {
        isLowercase: true,
      },
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    iid: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    // 调整方式
    arrange: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 调整积分
    integration: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 备注
    remark: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 场馆id
    storeid: {
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
  Integral.associate = () => {};
  return Integral;
}
