export function create(sequelize, DataTypes) {
  const OrderGroup = sequelize.define('OrderGroup', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    memberId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    // 1预约  2签到 3取消
    status: {
      type: DataTypes.INTEGER(2),
      defaultValue: 0,
    },

    vipCardMapId: {
      type: DataTypes.STRING,
      defaultValue: '',
    },

    signType: {
      type: DataTypes.INTEGER(2),
      defaultValue: 0,
      comment: '签到方式 0:未签到 1:pc签到 2:扫码签到',
    },
    // 场馆id
    storeid: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 用户评分
    userScore: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },

    // 用户评价
    userReview: {
      type: DataTypes.STRING,
      defaultValue: '',
    },

    orderdate: {
      type: DataTypes.STRING,
      defaultValue: '',
    },

    signdate: {
      type: DataTypes.STRING,
      defaultValue: '',
    },

  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  OrderGroup.associate = () => {};

  return OrderGroup;
}

