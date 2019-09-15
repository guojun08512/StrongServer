export function create(sequelize, DataTypes) {
  const Coach = sequelize.define('Coach', {
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
    coachType: {
      type: DataTypes.INTEGER(4),
      defaultValue: 1,
    },
    allowCourse: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    feature: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
    position: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    course: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    honor: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    descript: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    isOpenCoach: {
      type: DataTypes.INTEGER(1),
      defaultValue: 0,
    },
    dailyLessonNumLimit: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },
    workTime: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    workBeginDate: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    workEndDate: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    pauseWorkBeginDate: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    pauseWorkEndDate: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },

    images: {
      type: DataTypes.STRING(2048),
      defaultValue: '',
    },
    // 头像
    headimags: {
      type: DataTypes.STRING(2048),
      defaultValue: '',
    },
    score: { // 评分
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },
    weight: { // 权重
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },
    weeks: {
      type: DataTypes.STRING(2048),
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
    scopes: {
      scopeFunction(where) {
        return {
          where,
        };
      },
    },
    initialAutoIncrement: 1000,
  });
  Coach.associate = (models) => {
    models.Coach.hasMany(models.GroupLesson, {
      as: 'grouplesson',
      foreignKey: 'coachId',
    });
    models.Coach.belongsTo(models.Store, {
      as: 'store',
      foreignKey: 'storeid',
    });
    models.Coach.belongsTo(models.PDMember, {
      as: 'pdmembers',
      foreignKey: 'pdmemberid',
    });
  };
  return Coach;
}
