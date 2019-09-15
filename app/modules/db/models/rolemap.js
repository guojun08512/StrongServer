export function create(sequelize, DataTypes) {
  const RoleMap = sequelize.define('RoleMap', {
    uid: {
      type: DataTypes.UUID,
      validate: {
        isLowercase: true,
      },
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },

    // 角色名
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'compositeIndex',
    },

    // 是否为管理员
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    // 是否为超级管理员
    isSuperAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    // 1教练 2工作人员
    owner: {
      type: DataTypes.INTEGER(2),
      defaultValue: 1,
    },

    // 是否可用
    isEnable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    storeid: {
      type: DataTypes.STRING,
      defaultValue: '',
      unique: 'compositeIndex',
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
  RoleMap.associate = () => {
    // models.RoleMap.belongsTo(models.Store, {
    //   as: 'store',
    //   foreignKey: 'storeid',
    //   unique: 'compositeIndex',
    // });
  };
  return RoleMap;
}

