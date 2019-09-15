
export function create(sequelize, DataTypes) {
  const VipCardMapLog = sequelize.define('VipCardMapLog', {
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
    // 实体卡号
    entitycardid: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 开卡时间
    opencardtime: {
      type: DataTypes.DATE,
    },
    // 到期时间
    expirytime: {
      type: DataTypes.DATE,
    },
    // 请假开始时间
    leavestarttime: {
      type: DataTypes.DATE,
    },
    // 请假结束时间
    leaveendtime: {
      type: DataTypes.DATE,
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
    // 会员卡状态
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
  VipCardMapLog.associate = (models) => {
    models.VipCardMapLog.belongsTo(models.VipCardMap, {
      as: 'vipcardmaps',
      foreignKey: 'vipcardmapid',
    });
    models.VipCardMapLog.hasOne(models.Order, {
      as: 'orders',
      foreignKey: 'vcmlid',
    });
    models.VipCardMapLog.belongsTo(models.VipCard, {
      as: 'vipcards',
      foreignKey: 'vipcardid',
    });
    models.VipCardMapLog.belongsTo(models.Member, {
      as: 'members',
      foreignKey: 'memberid',
    });
  };
  return VipCardMapLog;
}
