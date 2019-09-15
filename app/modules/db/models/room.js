export function create(sequelize, DataTypes) {
  const Room = sequelize.define('Room', {
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
    // 场地名字
    name: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 人数
    number: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },
    // 场地类型
    type: {
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
  Room.associate = (models) => {
    models.Room.hasMany(models.GroupLesson, {
      as: 'grouplesson',
      foreignKey: 'roomId',
    });
  };
  return Room;
}
