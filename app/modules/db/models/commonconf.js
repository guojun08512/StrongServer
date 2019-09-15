export function create(sequelize, DataTypes) {
  const CommonConf = sequelize.define('CommonConf', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },

    // 开课前多少分钟不能预约
    groupLessonOrderTimeLimit: {
      type: DataTypes.INTEGER(11),
      defaultValue: 5,
      comment: '开课前多少分钟不能预约',
    },

    // 开始前多少分钟不能取消预约
    groupLessonCancelOrderTimeLimit: {
      type: DataTypes.INTEGER(11),
      defaultValue: 10,
      comment: '开始前多少分钟不能取消预约',
    },

    // 私课开课前多少分钟不能预约
    priavteLessonOrderTimeLimit: {
      type: DataTypes.INTEGER(11),
      defaultValue: 5,
      comment: '私课开课前多少分钟不能预约',
    },

    // 私课开始前多少分钟不能取消预约
    privateLessonCancelOrderTimeLimit: {
      type: DataTypes.INTEGER(11),
      defaultValue: 10,
      comment: '私课开始前多少分钟不能取消预约',
    },

    // 备注
    remark: {
      type: DataTypes.STRING,
      defaultValue: '',
    },

  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci',

  });

  CommonConf.associate = () => { };

  return CommonConf;
}

