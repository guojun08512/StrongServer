
// 淋浴
export function create(sequelize, DataTypes) {
  const Shower = sequelize.define('Shower', {
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
    // 单次时长
    singledate: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },
    // 总剩余时长
    totaldate: {
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
  Shower.associate = (models) => {
    models.Shower.hasOne(models.ShowerLog, {
      as: 'showerlogs',
      foreignKey: 'showerid',
    });
    models.Shower.belongsTo(models.Member, {
      as: 'members',
      foreignKey: 'memberid',
    });
  };
  return Shower;
}
