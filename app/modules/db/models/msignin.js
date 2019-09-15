
// 签到表
export function create(sequelize, DataTypes) {
  const MSignin = sequelize.define('MSignin', {
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
    // 签到人数
    number: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 签到方式
    signin: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 签到日期
    signdate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // 签到手牌号
    handcardid: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 未归还手牌号
    noreturncardid: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 返还时间
    returntime: {
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
  MSignin.associate = (models) => {
    models.MSignin.belongsTo(models.VipCardMap, {
      as: 'vipcardmaps',
      foreignKey: 'vipcardmapid',
    });
  };
  return MSignin;
}
