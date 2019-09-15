
// 智能柜
export function create(sequelize, DataTypes) {
  const IntelCabinetLog = sequelize.define('IntelCabinetLog', {
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
    // 租柜编号
    number: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 手环号
    rfid: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },
    // 存取类型
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
  IntelCabinetLog.associate = (models) => {
    models.IntelCabinetLog.belongsTo(models.Store, {
      as: 'stores',
      foreignKey: 'storeid',
    });
  };
  return IntelCabinetLog;
}
