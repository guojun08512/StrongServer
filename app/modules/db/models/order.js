// 订单表
export function create(sequelize, DataTypes) {
  const Order = sequelize.define('Order', {
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
    // 订单号
    ordernumber: {
      type: DataTypes.UUID,
      defaultValue: '',
    },
    // 卡类型 如 会员卡 1, 私教课 2, 水费 3
    type: {
      type: DataTypes.INTEGER(2),
      defaultValue: 0,
    },
    // 金额
    money: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
    },
    // 收退款类型
    method: {
      type: DataTypes.INTEGER(2),
      defaultValue: 0,
    },
    // 付款方式
    payment: {
      type: DataTypes.INTEGER(2),
      defaultValue: 0,
    },
    // 业绩归属
    ascription: {
      type: DataTypes.UUID,
      defaultValue: '',
    },
    // 成交方式
    deal: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 描述
    remark: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 订单状态
    status: {
      type: DataTypes.INTEGER(2),
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
  Order.associate = (models) => {
    models.Order.belongsTo(models.VipCardMapLog, {
      as: 'vipcardmaplogs',
      foreignKey: 'vcmlid',
    });
    models.Order.belongsTo(models.PrivateMapLog, {
      as: 'privatemaplogs',
      foreignKey: 'pmlid',
    });
  };
  return Order;
}
