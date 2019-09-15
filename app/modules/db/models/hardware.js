// 硬件
export function create(sequelize, DataTypes) {
  const HardWare = sequelize.define('HardWare', {
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
    // devid
    devid: {
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
  HardWare.associate = (models) => {
    models.HardWare.belongsTo(models.Store, {
      as: 'stores',
      foreignKey: 'storeid',
    });
  };
  return HardWare;
}
