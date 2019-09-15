
// 淋浴
export function create(sequelize, DataTypes) {
  const ShowerLog = sequelize.define('ShowerLog', {
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
    // 淋浴时长
    lof: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },
    // 结束时间
    etime: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
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
  ShowerLog.associate = () => {};
  return ShowerLog;
}
