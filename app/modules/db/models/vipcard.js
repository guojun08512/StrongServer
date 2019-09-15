
// 会员卡
export function create(sequelize, DataTypes) {
  const VipCard = sequelize.define('VipCard', {
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
    // 类型
    cardtype: {
      type: DataTypes.INTEGER(2),
      defaultValue: 0,
    },
    // 子类型
    cardsubtype: {
      type: DataTypes.INTEGER(2),
      defaultValue: 0,
    },
    // 会员卡名称
    cardname: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 有效期
    validity: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },
    // 次数/价值
    param: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },
    // 售价
    price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
    },
    // 在售状态 在售: 1, 停用: 2
    onsale: {
      type: DataTypes.INTEGER(2),
      defaultValue: 1,
    },
    // 手机是否可购买 1 是, 2 否
    purchase: {
      type: DataTypes.INTEGER(2),
      defaultValue: 1,
    },
    // 描述
    remark: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 推荐权重
    recommendWeight: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },
    // 展示图片
    images: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 封面图片
    cover: {
      type: DataTypes.STRING(2048),
      defaultValue: '',
    },
    // 月份数量
    number: {
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
  VipCard.associate = (models) => {
    models.VipCard.hasMany(models.VipCardMap, {
      as: 'vipcardmaps',
      foreignKey: 'vipcardid',
    });
    models.VipCard.hasMany(models.VipCardMapLog, {
      as: 'vipcardmaplogs',
      foreignKey: 'vipcardid',
    });
    models.VipCard.hasMany(models.PrivateMapLog, {
      as: 'privatemaplogs',
      foreignKey: 'vipcardid',
    });
  };
  return VipCard;
}
