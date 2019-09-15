
// 省市县
export function create(sequelize, DataTypes) {
  const Area = sequelize.define('Area', {
    codeid: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },
    parentid: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },
    level: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },
    cityname: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
  Area.associate = () => {};
  return Area;
}
