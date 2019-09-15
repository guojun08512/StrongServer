
// 押金表
export function create(sequelize, DataTypes) {
  const Deposit = sequelize.define('Deposit', {
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
    // 用途
    use: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 收取时间
    chargetime: {
      type: DataTypes.DATE,
    },
    // 退款时间
    returntime: {
      type: DataTypes.DATE,
    },
    // 金额
    cost: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 付款方式
    payment: {
      type: DataTypes.INTEGER(2),
      defaultValue: 0,
    },
    // 退款方式
    returntype: {
      type: DataTypes.INTEGER(2),
      defaultValue: 0,
    },
    // 收款人
    payee: {
      type: DataTypes.UUID,
      defaultValue: '',
    },
    // 描述
    remark: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 状态
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
  Deposit.associate = (models) => {
    models.Deposit.belongsTo(models.Member, {
      as: 'members',
      foreignKey: 'memberid',
    });
  };
  return Deposit;
}
