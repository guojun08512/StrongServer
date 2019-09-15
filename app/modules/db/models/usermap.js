
// 用户 场馆 角色 映射表
export function create(sequelize, DataTypes) {
  const UserMap = sequelize.define('UserMap', {
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
    // 角色名称
    rolename: {
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
  UserMap.associate = (models) => {
    models.UserMap.belongsTo(models.User, {
      as: 'users',
      foreignKey: 'userid',
    });
    models.UserMap.belongsTo(models.Store, {
      as: 'stores',
      foreignKey: 'storeid',
    });
  };
  return UserMap;
}
