
export function create(sequelize, DataTypes) {
  const PrivateMapLog = sequelize.define('PrivateMapLog', {
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
    // 开卡时间
    opencardtime: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 到期时间
    expirytime: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 教练
    coach: {
      type: DataTypes.UUID,
      defaultValue: '',
    },
    // 订单编号
    orderid: {
      type: DataTypes.UUID,
      defaultValue: '',
    },
    // 总购买数
    totalbuy: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },
    // 当前剩余购买数
    curbuy: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },
    // 私教课状态
    cardstatus: {
      type: DataTypes.INTEGER(2),
      defaultValue: 0,
    },
    // 操作方式 如 购卡,升卡
    operation: {
      type: DataTypes.INTEGER(2),
      defaultValue: 0,
    },
    // 备注
    remark: {
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
  PrivateMapLog.associate = (models) => {
    models.PrivateMapLog.belongsTo(models.PrivateMap, {
      as: 'privatemaps',
      foreignKey: 'privatemapid',
    });
    models.PrivateMapLog.hasOne(models.Order, {
      as: 'orders',
      foreignKey: 'pmlid',
    });
    models.PrivateMapLog.belongsTo(models.Private, {
      as: 'privates',
      foreignKey: 'privateid',
    });
    models.PrivateMapLog.belongsTo(models.Member, {
      as: 'members',
      foreignKey: 'memberid',
    });
  };
  return PrivateMapLog;
}
