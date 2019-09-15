export function create(sequelize, DataTypes) {
  const Employee = sequelize.define('Employee', {
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
    sex: {
      type: DataTypes.INTEGER(2),
      defaultValue: 1,
    },
    cellphone: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    groupId: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },
    position: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    isMember: {
      type: DataTypes.BOOLEAN,
    },

    dataAuth: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 场馆id
    storeid: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    images: {
      type: DataTypes.STRING(2048),
      defaultValue: '',
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    initialAutoIncrement: 50000000,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    defaultScope: {
      where: {
        deleted: false,
      },
    },
    scopes: {
      scopeFunction(where) {
        return {
          where,
        };
      },
    },
  });
  Employee.associate = (models) => {
    models.Employee.hasMany(models.GroupLesson, {
      as: 'grouplesson',
      foreignKey: 'recordPersonId',
    });
    models.Employee.hasMany(models.Experience, {
      as: 'experience',
      foreignKey: 'employeeId',
    });
    models.Employee.belongsTo(models.PDMember, {
      as: 'pdmembers',
      foreignKey: 'pdmemberid',
    });
  };
  return Employee;
}
