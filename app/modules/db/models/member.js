
export function create(sequelize, DataTypes) {
  const Member = sequelize.define('Member', {
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
    from: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    tags: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    belong: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    RFID: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    scords: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 积分
    integral: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    remark: {
      type: DataTypes.STRING,
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
  });
  Member.associate = (models) => {
    models.Member.hasMany(models.NotifyMsg, {
      as: 'msgs',
      foreignKey: 'memberid',
    });
    models.Member.hasMany(models.Cabinet, {
      as: 'cabinets',
      foreignKey: 'memberid',
    });
    models.Member.hasMany(models.Deposit, {
      as: 'deposits',
      foreignKey: 'memberid',
    });
    models.Member.hasMany(models.Earnest, {
      as: 'earnests',
      foreignKey: 'memberid',
    });
    models.Member.hasMany(models.VipCardMap, {
      as: 'vipcardmaps',
      foreignKey: 'memberid',
    });
    models.Member.hasMany(models.Integral, {
      as: 'integrals',
      foreignKey: 'memberid',
    });
    models.Member.hasMany(models.Follow, {
      as: 'follows',
      foreignKey: 'memberid',
    });
    models.Member.belongsTo(models.PDMember, {
      as: 'pdmembers',
      foreignKey: 'pdmemberid',
    });
    models.Member.hasMany(models.PrivateMap, {
      as: 'privatemaps',
      foreignKey: 'memberid',
    });
    models.Member.belongsTo(models.Store, {
      as: 'stores',
      foreignKey: 'storeid',
    });
    models.Member.hasMany(models.VipCardMapLog, {
      as: 'vipcardmaplogs',
      foreignKey: 'memberid',
    });
    models.Member.hasMany(models.PrivateMapLog, {
      as: 'privatemaplogs',
      foreignKey: 'memberid',
    });
    models.Member.hasOne(models.IntelCabinet, {
      as: 'intelcabinets',
      foreignKey: 'memberid',
    });
    models.Member.hasOne(models.Shower, {
      as: 'showers',
      foreignKey: 'memberid',
    });
  };
  return Member;
}
