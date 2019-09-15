export function create(sequelize, DataTypes) {
  const SignPrivateLesson = sequelize.define(
    'SignPrivateLesson', {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },

      memberId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      // privateMap 私教课id
      privateId: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      // 上课教练id
      coachId: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },

      // 签到日期
      signDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // 签退日期
      signOkDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // 签到方式 1前台 2指纹
      signType: {
        type: DataTypes.INTEGER(2),
        defaultValue: 1,
      },
      // 签退方式 1前台 2指纹
      signOkType: {
        type: DataTypes.INTEGER(2),
        defaultValue: 1,
      },
      // 1签到 2签退 3取消签到
      status: {
        type: DataTypes.INTEGER(2),
        defaultValue: 0,
      },
      // 签到次数
      signNumber: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        defaultValue: 0,
      },

      // 签到赠予次数
      signGiveNumber: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        defaultValue: 0,
      },
      // 场馆id
      storeid: {
        type: DataTypes.STRING,
        defaultValue: '',
      },

      // 预约日期
      orderDate: {
        type: DataTypes.STRING,
        defaultValue: '',
      },

      // 预约教练id
      orderCoachId: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },

      // 预约时间
      orderTime: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      // 0 无 1约课 2签到 3 废弃(取消签课)
      orderStatus: {
        type: DataTypes.INTEGER(2),
        defaultValue: 0,
      },

      // 用户评分
      userScore: {
        type: DataTypes.INTEGER(11),
        defaultValue: 0,
      },

      // 用户评价
      userReview: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      // 评价时间
      scoretime: {
        type: DataTypes.STRING,
        defaultValue: '',
      },

    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    },
  );
  SignPrivateLesson.associate = () => {};
  return SignPrivateLesson;
}
