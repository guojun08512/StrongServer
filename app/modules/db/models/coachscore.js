// 教练评分表
export function create(sequelize, DataTypes) {
  const CoachScore = sequelize.define('CoachScore', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    coachId: {
      type: DataTypes.INTEGER(11),
    },
    memberId: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    score: {
      type: DataTypes.INTEGER(11),
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
  CoachScore.associate = (models) => {
    models.CoachScore.belongsTo(models.Store, {
      as: 'store',
      foreignKey: 'storeid',
    });
  };
  return CoachScore;
}

