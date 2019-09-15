// 公共会员信息表
export function create(sequelize, DataTypes) {
  const PDMember = sequelize.define('PDMember', {
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
    username: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    cellphone: {
      type: DataTypes.STRING,
      defaultValue: '',
      unique: true,
    },
    // 性别 男:1, 女:2
    sex: {
      type: DataTypes.INTEGER(2),
      defaultValue: 0,
    },
    idcard: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    birthday: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    city: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 头像
    avatar: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    wxunionid: {
      type: DataTypes.STRING,
      defaultValue: '',
      comment: '微信用户唯一id',
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
  PDMember.associate = (models) => {
    models.PDMember.hasMany(models.Member, {
      as: 'members',
      foreignKey: 'pdmemberid',
    });
    models.PDMember.hasMany(models.Employee, {
      as: 'employee',
      foreignKey: 'pdmemberid',
    });
    models.PDMember.hasMany(models.Coach, {
      as: 'coach',
      foreignKey: 'pdmemberid',
    });
  };
  return PDMember;
}
