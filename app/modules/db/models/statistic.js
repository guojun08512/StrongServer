
// 统计每个场馆相关数据
export function create(sequelize, DataTypes) {
  const Statistic = sequelize.define('Statistic', {
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
    // 插入日期
    date: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 每天销售额
    salesvolume: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },
    // 每天增加会员数
    membernumber: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },
    // 每天会员卡签到人数
    siginnumber: {
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
  Statistic.associate = () => {};
  return Statistic;
}
