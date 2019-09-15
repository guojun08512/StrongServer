
export function create(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    uid: {
      type: DataTypes.UUID,
      validate: {
        isLowercase: true,
      },
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    password: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // realname: {
    //   type: DataTypes.STRING,
    //   defaultValue: '',
    // },
    // 性别 男:1, 女:2
    sex: {
      type: DataTypes.INTEGER(2),
      defaultValue: 0,
    },
    cellphone: {
      type: DataTypes.STRING,
      defaultValue: '18888888888',
    },
    // email: {
    //   type: DataTypes.STRING,
    // },
    // expires: {
    //   type: DataTypes.DATE,
    // },
    // office: {
    //   type: DataTypes.STRING,
    // },
    // role: {
    //   type: DataTypes.STRING,
    // },
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
  User.associate = (models) => {
    models.User.hasMany(models.UserMap, {
      as: 'usermaps',
      foreignKey: 'userid',
    });
    models.User.hasMany(models.Employee, {
      as: 'employee',
      foreignKey: 'userid',
    });
    models.User.hasMany(models.Coach, {
      as: 'coach',
      foreignKey: 'userid',
    });
  };
  return User;
}
