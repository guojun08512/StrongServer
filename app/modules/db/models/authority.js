
export function create(sequelize, DataTypes) {
  const Authority = sequelize.define('Authority', {
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
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    defaultScope: {
      where: {
        deleted: false,
      },
    },
  });
  Authority.associate = (models) => {
    models.Authority.hasMany(models.Staff, {
      as: 'staffs',
      foreignKey: 'staff_id',
    });
    models.Authority.hasMany(models.Venue, {
      as: 'venues',
      foreignKey: 'venue_id',
    });
  };
  return Authority;
}
