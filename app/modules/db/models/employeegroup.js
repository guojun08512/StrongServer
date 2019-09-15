export function create(sequelize, DataTypes) {
  const EmployeeGroup = sequelize.define('EmployeeGroup', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      defaultValue: '',
    },

    parentid: {
      type: DataTypes.INTEGER(11).UNSIGNED,
    },

    gtype: {
      type: DataTypes.INTEGER(2),
    },

    treetype: {
      type: DataTypes.INTEGER(2),
    },

    isSelected: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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

  EmployeeGroup.associate = () => {};

  return EmployeeGroup;
}
