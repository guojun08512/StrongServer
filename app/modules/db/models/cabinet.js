
// 租柜表
export function create(sequelize, DataTypes) {
  const Cabinet = sequelize.define('Cabinet', {
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
    // 租柜类型
    type: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 租柜编号
    number: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 截至时间
    deadlinetime: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 费用
    cost: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 押金
    deposit: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 付款方式
    payment: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 收款人
    payee: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 描述
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
  Cabinet.associate = () => {};
  return Cabinet;
}
