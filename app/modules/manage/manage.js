import models from 'modules/db/models';
import ERROR, { $required, converSqlToJson } from 'modules/utils';
import Sequelize from 'modules/db/sequelize';
import acl from 'modules/acl';
import Moment from 'moment';
import config from 'modules/config';

const logger = require('modules/logger').default;

export const AddStore = async (data, userInfo) => {
  $required('storename', data.storename);
  $required('storephone', data.storephone);
  $required('province', data.province);
  $required('city', data.city);
  $required('county', data.county);
  $required('businessarea', data.businessarea);
  if (typeof (data.coordinate) !== 'string') {
    ERROR.ParamsError('AddStore', 'coordinate');
  }
  const storename = data.storename; // 场馆名称
  const storephone = data.storephone; // 场馆电话
  const logourl = data.logourl || ''; // 场馆logo
  const province = data.province; // 省
  const city = data.city; // 市
  const county = data.county; // 县
  const storeaddr = data.storeaddr || ''; // 场馆地址
  const businessarea = data.businessarea; // 营业面积
  const introduction = data.introduction || ''; // 场馆介绍内容
  const wechat = data.wechat || ''; // 微信
  const mail = data.mail || ''; // 邮件
  const coordinate = data.coordinate; // 场馆坐标
  let pictureurl = data.pictureurl || []; // 场馆图片
  const synopsis = data.synopsis || ''; // 场馆简介
  if (!Array.isArray(pictureurl)) {
    ERROR.ArrayError();
  }
  pictureurl = JSON.stringify(data.pictureurl);
  logger.debug(`manage::AddStore data : ${JSON.stringify(data)}`);

  const roles = await acl.createAcl().userRoles(userInfo.uid);
  const ret = await Sequelize.transaction(t => models.Store.create({
    storename, storephone, logourl, province, city, county, storeaddr, businessarea, introduction, wechat, mail, coordinate, pictureurl, synopsis,
  }, {
    transaction: t,
  }).then((sInfo) => {
    if (!sInfo) throw new Error();
    return models.UserMap.create({
      userid: userInfo.uid,
      storeid: sInfo.uid,
      rolename: roles.join(','),
    }, {
      transaction: t,
    });
  }).catch(e => ERROR.AddStoreError(e)));

  return ret;
};

export const UpdateStore = async (data, storeid) => {
  logger.debug(`manage::UpdateStore data : ${data}`);

  const storeInfo = await models.Store.findOne({
    where: {
      uid: storeid,
    },
  });

  if (!storeInfo) {
    return false;
  }

  const params = data;
  if (!Array.isArray(data.pictureurl)) {
    ERROR.ArrayError();
  }
  params.pictureurl = JSON.stringify(data.pictureurl);

  const ret = storeInfo.update({
    ...params,
  });

  if (!ret) {
    return false;
  }
  return true;
};

export const DeleteStore = async (storeid) => {
  $required('storeid', storeid);
  const ret = await Sequelize.transaction(t => models.Store.update({
    deleted: 1,
  }, {
    where: {
      uid: storeid,
    },
  }, {
    transaction: t,
  }).then((sInfo) => {
    if (!sInfo) throw new Error();
    return models.UserMap.update({
      deleted: 1,
    }, {
      where: {
        storeid,
      },
    }, {
      transaction: t,
    });
  })).then((result) => {
    if (!result) throw new Error();
    return true;
  }).catch((err) => {
    console.log(err);
    return false;
  });
  return ret;
};

export const QueryStore = async (storeid) => {
  const storeInfo = converSqlToJson(await models.Store.findOne({
    where: {
      uid: storeid,
    },
  }));

  if (storeInfo) {
    storeInfo.pictureurl = (storeInfo.pictureurl && JSON.parse(storeInfo.pictureurl)) || [];
  }

  const roomInfo = converSqlToJson(await models.Room.findAll({
    where: {
      storeid,
    },
  })) || [];

  const json = {};
  const ret = await models.Area.findOne({ where: { codeid: storeInfo.province } });
  json.provinceName = ret.cityname;
  const ret1 = await models.Area.findOne({ where: { codeid: storeInfo.city } });
  json.cityName = ret1.cityname;
  const ret2 = await models.Area.findOne({ where: { codeid: storeInfo.county } });
  json.countyName = ret2.cityname;
  json.createdAt = Moment(storeInfo.createdAt).format('YYYY-MM-DD HH:mm:ss');
  json.updatedAt = Moment(storeInfo.updatedAt).format('YYYY-MM-DD HH:mm:ss');

  return {
    storeInfo: storeInfo ? { ...storeInfo, ...json } : {},
    roomInfo: roomInfo.map(info => ({ ...info, createdAt: Moment(info.createdAt).format('YYYY-MM-DD HH:mm:ss'), updatedAt: Moment(info.updatedAt).format('YYYY-MM-DD HH:mm:ss') })),
  };
};

export const queryArea = async (parentID) => {
  $required('parentID', parentID);

  const allAreas = await models.Area.findAll({
    where: {
      parentid: parentID,
    },
  });
  return allAreas;
};

export const queryAllStores = async (userID) => {
  const umInfo = await models.UserMap.findAll({
    where: {
      userid: userID,
    },
    order: [['iid', 'DESC']],
  });
  // 场馆信息
  const allStores = [];
  for (let i = 0; i < umInfo.length; i += 1) {
    const rolename = umInfo[i].rolename;
    const storeid = umInfo[i].storeid;
    const sInfo = await models.Store.findOne({
      where: {
        uid: storeid,
      },
    });
    const provinceid = sInfo.province;
    const cityid = sInfo.city;
    const countyid = sInfo.county;
    const provinceInfo = await models.Area.findOne({
      where: {
        codeid: provinceid,
      },
    });
    const cityInfo = await models.Area.findOne({
      where: {
        codeid: cityid,
      },
    });
    const countyInfo = await models.Area.findOne({
      where: {
        codeid: countyid,
      },
    });
    const json = {};
    json.storeID = storeid;
    json.storeName = sInfo.storename;
    json.storePhone = sInfo.storephone;
    json.storeAddr = sInfo.storeaddr;
    json.weChat = sInfo.wechat;
    json.mail = sInfo.mail;
    json.rolename = rolename;
    json.businessarea = sInfo.businessarea;
    json.introduction = sInfo.introduction;
    json.provinceid = provinceid;
    json.province = provinceInfo.cityname;
    json.cityid = cityid;
    json.city = cityInfo.cityname;
    json.countyid = countyid;
    json.county = countyInfo.cityname;
    json.pictureurl = (sInfo.pictureurl && JSON.parse(sInfo.pictureurl)) || [];
    json.logourl = sInfo.logourl;
    json.synopsis = sInfo.synopsis;
    allStores.push(json);
  }
  return {
    allStores,
  };
};

export const addRoom = async (data, storeid) => {
  $required('storeid', storeid);
  $required('name', data.name);
  $required('number', data.number);
  const name = data.name; // 教室名字
  const number = parseInt(data.number, 10); // 教室人数
  const type = parseInt(data.type, 10) || 0; // 教室类型

  const res = await models.Room.findOrCreate({
    where: {
      name,
      storeid,
    },
    defaults: {
      name,
      number,
      type,
    },
  });

  return res;
};

export const updateRoom = async (data) => {
  $required('uid', data.uid);
  const uid = data.uid;

  const res = await models.Room.update({
    ...data,
  }, {
    where: {
      uid,
    },
  });

  return res;
};

export const delRoom = async (data) => {
  $required('uid', data.uid);
  const uid = data.uid;

  const res = await models.Room.update({
    deleted: 1,
  }, {
    where: {
      uid,
    },
  });

  return res;
};

export const queryRoom = async (uid) => {
  $required('uid', uid);
  // $required('uid', data.uid);
  // const uid = data.uid;

  const rInfo = await models.Room.findOne({
    where: {
      uid,
    },
  });

  return rInfo;
};

export const queryAllRoom = async (storeid) => {
  $required('storeid', storeid);

  const where = {
    storeid,
  };
  const count = await models.Room.count({
    where,
  });
  const allRoomInfo = await models.Room.findAll({
    where,
  });

  return {
    count,
    allRoomInfo,
  };
};

// 请求list
export const queryHWlist = async (storeid) => {
  $required('storeid', storeid);
  const list = config.get('HardWarelist');
  const res = converSqlToJson(await models.HardWare.findOne({
    where: {
      storeid,
    },
  }));
  const keys = Object.keys(list);
  return keys.map((k) => {
    const data = {};
    data.type = k;
    data.name = list[k].name;
    if (res) {
      switch (Number(k)) {
        case 1:
          data.devid = res.devid;
          break;
        default:
          break;
      }
    }
    return data;
  });
};

// 更新硬件信息
export const updateHardWare = async (data, storeid) => {
  $required('storeid', storeid);
  $required('type', data.type);
  const id = data.id;
  const type = parseInt(data.type, 10);

  const params = {};
  switch (type) {
    case 1:
      params.devid = id;
      break;
    default:
      break;
  }

  const hwInfo = await models.HardWare.findOne({
    where: {
      storeid,
    },
  });
  if (!hwInfo) {
    await models.HardWare.create({
      ...params,
      storeid,
    });
  } else {
    await models.HardWare.update({
      ...params,
    }, {
      storeid,
    });
  }

  const info = await models.HardWare.findOne({
    where: {
      storeid,
    },
  });

  return {
    storeid: info.storeid,
    1: info.devid,
  };
};
