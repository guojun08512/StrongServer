
// 课程表
export function create(sequelize, DataTypes) {
  const Course = sequelize.define('Course', {
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
    coursename: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    coursekind: {
      type: DataTypes.STRING,
      defaultValue: '1', // 1 2
    },
    needConfine: {
      type: DataTypes.STRING,
      defaultValue: '1', // 1 2
    },
    stopOrderCourse: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    stopCancelCourse: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    // 时长
    coursetime: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 提前几天约课
    beforeDay: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // 提前几天约课
    orderTime: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 最少
    mincoursemember: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // 最多
    maxcoursemember: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // 封面地址
    coverUrl: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    remark: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    notifyMsgStatus: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 图片
    images: {
      type: DataTypes.STRING(2048),
      defaultValue: '',
    },

    // 推荐权重
    recommendWeight: {
      type: DataTypes.INTEGER,
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
  Course.associate = (models) => {
    models.Course.hasMany(models.GroupLesson, {
      as: 'grouplesson',
      foreignKey: 'courseId',
    });
    models.Course.belongsTo(models.Store, {
      as: 'store',
      foreignKey: 'storeid',
    });
  };
  return Course;
}
