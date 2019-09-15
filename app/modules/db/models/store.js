// 场馆
export function create(sequelize, DataTypes) {
  const Store = sequelize.define('Store', {
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
    // 场馆名称
    storename: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 场馆电话
    storephone: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 场馆logo
    logourl: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 省
    province: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 市
    city: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 县
    county: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 场馆地址
    storeaddr: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 营业面积
    businessarea: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 场馆介绍内容
    introduction: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 场馆展示图片
    pictureurl: {
      type: DataTypes.STRING(2048),
      defaultValue: '',
    },
    // 微信
    wechat: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 邮件
    mail: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 地图坐标
    coordinate: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    // 营业状态 0待开业，1开业, 2休息
    businessstatus: {
      type: DataTypes.INTEGER(2),
      defaultValue: 1,
    },
    // 营业时间:星期,时间段(01:00-02:00);...
    businesstime: {
      type: DataTypes.STRING,
      defaultValue: '1,10:00-18:00;2,10:00-18:00;3,10:00-18:00;',
    },
    // 场馆简介
    synopsis: {
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
  Store.associate = (models) => {
    models.Store.hasMany(models.UserMap, {
      as: 'usermaps',
      foreignKey: 'storeid',
    });
    models.Store.hasMany(models.Member, {
      as: 'members',
      foreignKey: 'storeid',
    });
    models.Store.hasMany(models.VipCard, {
      as: 'vipcards',
      foreignKey: 'storeid',
    });
    models.Store.hasMany(models.Private, {
      as: 'privates',
      foreignKey: 'storeid',
    });
    models.Store.hasMany(models.GroupLesson, {
      as: 'grouplesson',
      foreignKey: 'storeid',
    });
    models.Store.hasMany(models.Coach, {
      as: 'coach',
      foreignKey: 'storeid',
    });
    models.Store.hasMany(models.CoachScore, {
      as: 'coachscore',
      foreignKey: 'storeid',
    });
    models.Store.hasMany(models.Room, {
      as: 'room',
      foreignKey: 'storeid',
    });
    models.Store.hasMany(models.CommonConf, {
      as: 'commonconf',
      foreignKey: 'storeid',
    });
    models.Store.hasMany(models.Statistic, {
      as: 'statistics',
      foreignKey: 'storeid',
    });
    models.Store.hasMany(models.HardWare, {
      as: 'HardWares',
      foreignKey: 'storeid',
    });
  };
  return Store;
}
