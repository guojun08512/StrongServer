export function create(sequelize, DataTypes) {
  const EmployeePosition = sequelize.define('EmployeePosition', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // 场馆id
    storeid: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
  EmployeePosition.associate = () => {};
  return EmployeePosition;
}
