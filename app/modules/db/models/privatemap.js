
// 私教课映射表
export function create(sequelize, DataTypes) {
  const PrivateMap = sequelize.define('PrivateMap', {
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
    // 请假开始时间
    leavestarttime: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 请假结束时间
    leaveendtime: {
      type: DataTypes.STRING,
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
  PrivateMap.associate = (models) => {
    models.PrivateMap.belongsTo(models.Member, {
      as: 'members',
      foreignKey: 'memberid',
    });
    models.PrivateMap.belongsTo(models.Private, {
      as: 'privates',
      foreignKey: 'privateid',
    });
    models.PrivateMap.hasMany(models.PrivateMapLog, {
      as: 'privatemaplogs',
      foreignKey: 'privatemapid',
    });
    models.PrivateMap.belongsTo(models.Coach, {
      as: 'coachs',
      foreignKey: 'coach',
    });
  };
  return PrivateMap;
}
