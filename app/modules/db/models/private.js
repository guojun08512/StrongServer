
// 私教课
export function create(sequelize, DataTypes) {
  const Private = sequelize.define('Private', {
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
    // 会员卡名称
    privatename: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 有效期
    validity: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },
    // 节数
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
    // 手机是否可购买  2 否  1 是
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
      type: DataTypes.STRING(2048),
      defaultValue: '',
    },
    // 封面图片
    cover: {
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
  Private.associate = (models) => {
    models.Private.hasMany(models.PrivateMap, {
      as: 'privatemaps',
      foreignKey: 'privateid',
    });
    models.Private.belongsTo(models.Store, {
      as: 'stores',
      foreignKey: 'storeid',
    });
  };
  return Private;
}
