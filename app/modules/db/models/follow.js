
// 跟进
export function create(sequelize, DataTypes) {
  const Follow = sequelize.define('Follow', {
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
    // 跟进人员
    personnel: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 跟进方式
    mode: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 跟进记录
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
  Follow.associate = (models) => {
    models.Follow.belongsTo(models.Member, {
      as: 'members',
      foreignKey: 'memberid',
    });
  };
  return Follow;
}
