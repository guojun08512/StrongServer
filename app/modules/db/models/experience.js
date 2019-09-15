// 预约体验

export function create(sequelize, DataTypes) {
  const Experience = sequelize.define('Experience', {
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
      comment: '名字',
    },
    phone: {
      type: DataTypes.STRING,
      defaultValue: '',
      comment: '电话',
    },
    /*
    employeeId: {
      type: DataTypes.BIGINT,
      comment: '员工id',
    },
    */
    // type: {
    //   type: DataTypes.INTEGER(2),
    //   defaultValue: 0,
    //   comment: '0:预约，1:体验',
    // },
    ordertime: {
      type: DataTypes.STRING,
      defaultValue: '',
      comment: '预约时间',
    },

    enterTime: {
      type: DataTypes.STRING,
      defaultValue: '',
      comment: '进店时间',
    },
    // status: {
    //   type: DataTypes.INTEGER(2),
    //   defaultValue: 0,
    //   comment: '1离店',
    // },
    leavetime: {
      type: DataTypes.STRING,
      defaultValue: '',
      comment: '离店时间',
    },
    remark: {
      type: DataTypes.STRING,
      defaultValue: '',
      comment: '备注',
    },
    operaFlag: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: '标志',
    },
    // 场馆id
    storeid: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    defaultScope: {
    },
  });
  Experience.associate = (models) => {
    models.Experience.belongsTo(models.Employee, {
      as: 'employee',
      foreignKey: 'employeeId',
    });
  };
  return Experience;
}
