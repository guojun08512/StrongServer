export function create(sequelize, DataTypes) {
  const GroupLesson = sequelize.define('GroupLesson', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },

    courseDate: {
      type: DataTypes.STRING,
    },

    beginTime: {
      type: DataTypes.STRING,
    },

    endTime: {
      type: DataTypes.STRING,
    },

    allowCards: {
      type: DataTypes.STRING,
      defaultValue: '',
      comment: '允许使用的卡',
    },

    // 1签到
    status: {
      type: DataTypes.INTEGER(2),
      defaultValue: 0,
    },
    // 实际人数
    currentNumber: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },

    // 签到时间
    signDate: {
      type: DataTypes.STRING,
      defaultValue: '',
    },

    // 签退时间
    signOkDate: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 备注
    remark: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 推荐权重
    recommendWeight: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },

    // 最少人数
    minNum: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },

    // 最多人数
    maxNum: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },

    // 设备领取 haveDevice 0未领取 1已领取
    haveDevice: {
      type: DataTypes.INTEGER(2),
      defaultValue: 0,
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci',

  });

  GroupLesson.associate = (models) => {
    models.GroupLesson.belongsTo(models.Course, {
      as: 'course',
      foreignKey: 'courseId',
    });
    models.GroupLesson.belongsTo(models.Store, {
      as: 'store',
      foreignKey: 'storeid',
    });
    models.GroupLesson.belongsTo(models.Coach, {
      as: 'coach',
      foreignKey: 'coachId',
    });
    models.GroupLesson.belongsTo(models.Room, {
      as: 'room',
      foreignKey: 'roomId',
    });
    models.GroupLesson.hasMany(models.OrderGroup, {
      as: 'ordergroup',
      foreignKey: 'groupLessonId',
    });
    models.GroupLesson.belongsTo(models.Employee, {
      as: 'employee',
      foreignKey: 'recordPersonId',
    });
  };


  return GroupLesson;
}

