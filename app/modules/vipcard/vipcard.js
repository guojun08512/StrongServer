import models from 'modules/db/models';
import ERROR, { $required, converSqlToJson } from 'modules/utils';
import moment from 'moment';

// const VipCardType = {
//   SingleStoreCard: 1, // 单店卡
//   MultiStoreCard: 2, // 多店卡
//   ExperienceCard: 3, // 体验卡
// };

export const VipCardSubType = {
  TimeLimitCard: 1, // 期限卡
  SecondaryCard: 2, // 次卡
  StoredValueCard: 3, // 储值卡
};

export const CardType = {
  vipcard: 1, // 会员卡
  private: 2, // 私教课
};

export const IsEnable = {
  Enable: 1, // 启用
  DisUse: 2, // 停用
};

export const addVipCard = async (data, storeid) => {
  $required('cardtype', data.cardtype);
  $required('cardsubtype', data.cardsubtype);
  $required('cardname', data.cardname);
  const cardtype = data.cardtype; // 类型
  const cardsubtype = data.cardsubtype; // 子类型
  const cardname = data.cardname; // 会员卡名称
  const validity = data.validity || 0; // 有效期
  const price = data.price || 0.00; // 售价
  const onsale = data.onsale || IsEnable.Enable; // 在售状态
  const purchase = data.purchase || 0; // 会员手机端是否可以购买
  const remark = data.remark || ''; // 描述
  const param = data.param || 0; // 次数/金额
  const recommendWeight = data.recommendWeight || 0; // 推荐权重
  const images = JSON.stringify(data.images || []); // 展示图片
  const cover = data.cover || ''; // 封面图片
  const number = data.number || 0; // 月份数

  const vcInfo = await models.VipCard.findOne({
    where: {
      cardname,
      storeid,
    },
  });

  if (vcInfo) {
    return ERROR.VipCardNameExist();
  }

  const res = await models.VipCard.create({
    cardtype, cardsubtype, cardname, validity, param, price, onsale, purchase, remark, recommendWeight, images, cover, storeid, number,
  });

  if (!res) {
    return false;
  }

  return true;
};

export const updateVipCard = async (data) => {
  $required('uid', data.uid);
  $required('cardname', data.cardname);
  const uid = data.uid; // 会员卡id
  const cardname = data.cardname; // 会员卡名称

  const info = await models.VipCard.findOne({
    where: {
      uid,
    },
  });

  if (info) {
    if (info.cardname !== cardname) {
      const vcInfo = await models.VipCard.findOne({
        where: {
          cardname,
        },
      });
      if (vcInfo) {
        return ERROR.VipCardNameExist();
      }
    }

    const param = data;
    if (data.images) {
      const images = JSON.parse(info.images);
      for (let i = 0; i < data.images.length; i += 1) {
        images.push(data.images[i]);
      }
      param.images = JSON.stringify(images);
    }
    const ret = await info.update({
      ...param,
    });
    if (!ret) {
      return false;
    }
  } else {
    return false;
  }

  return true;
};

export const deleteVipCard = async (data) => {
  const uids = data.uids; // 会员卡id组

  for (let i = 0; i < uids.length; i += 1) {
    const vcInfo = await models.VipCardMap.findAndCountAll({
      where: {
        vipcardid: uids[i],
      },
    });

    if (vcInfo.count === 0) {
      const ret = await models.VipCard.update({
        deleted: 1,
      }, {
        where: {
          uid: uids[i],
        },
      });
      if (!ret) {
        return false;
      }
    } else {
      return ERROR.deleteVipCardInvalid('exist');
    }
  }

  return true;
};

export const queryVipCardDetails = async (data) => {
  $required('uid', data.uid);
  const uid = data.uid; // 会员卡id

  const res = models.VipCard.findOne({
    where: {
      uid,
    },
  });

  if (!res) {
    return false;
  }

  return res;
};

export const getAllVipCards = async (options, storeid) => {
  $required('storeid', storeid);
  const pageCount = options.pageCount || 10;
  const curPage = options.curPage || 1;
  const onsale = options.onsale;

  const where = {};
  if (onsale !== undefined) {
    where.onsale = onsale;
  }
  where.storeid = storeid;
  const count = await models.VipCard.count({
    where,
  });
  const allCards = converSqlToJson(await models.VipCard.findAll({
    where,
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
    order: [['iid', 'DESC']],
  }));
  const mInfo = await models.Store.findOne({
    where: {
      uid: storeid,
    },
    attributes: ['storename'],
  });
  return {
    count,
    allCards: allCards.map(info => ({
      uid: info.uid,
      cardtype: info.cardtype,
      cardsubtype: info.cardsubtype,
      cardname: info.cardname,
      validity: info.validity,
      param: info.param,
      price: info.price,
      onsale: info.onsale,
      purchase: info.purchase,
      remark: info.remark,
      recommendWeight: info.recommendWeight,
      images: (info.images && JSON.parse(info.images)) || [],
      createdAt: moment(info.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment(info.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
      storeid: info.storeid,
      strorename: mInfo.storename,
      number: info.number,
    })),
  };
};

export const addPrivate = async (data, storeid) => {
  $required('privatename', data.privatename);
  $required('param', data.param);
  const privatename = data.privatename; // 会员卡名称
  const validity = data.validity || 0; // 有效期
  const param = data.param; // 节数
  const price = data.price || 0.00; // 售价
  const onsale = data.onsale || IsEnable.Enable; // 在售状态
  const purchase = data.purchase || 0; // 会员手机端是否可以购买
  const remark = data.remark || ''; // 描述
  const recommendWeight = data.recommendWeight || 0; // 推荐权重
  const images = JSON.stringify(data.images || ''); // 展示图片
  const cover = data.cover || ''; // 封面图片

  const pInfo = await models.Private.findOne({
    where: {
      privatename,
      storeid,
    },
  });

  if (pInfo) {
    return false;
  }

  const res = await models.Private.create({
    privatename, validity, param, price, onsale, purchase, remark, recommendWeight, images, cover, storeid,
  });

  if (!res) {
    return false;
  }

  return true;
};

export const updatePrivate = async (data, storeid) => {
  $required('uid', data.uid);
  const uid = data.uid; // 会员卡id
  const privatename = data.privatename; // 私教课名称

  const pInfo = await models.Private.findOne({
    where: {
      uid,
    },
  });

  if (pInfo) {
    console.log(pInfo.privatename);
    console.log(privatename);
    if (pInfo.privatename !== privatename) {
      const pInfo1 = await models.Private.findOne({
        where: {
          privatename,
          storeid,
        },
      });
      if (pInfo1) {
        console.log(1);
        return false;
      }
    }

    const param = data;
    if (data.images) {
      const images = JSON.parse(pInfo.images);
      for (let i = 0; i < data.images.length; i += 1) {
        images.push(data.images[i]);
      }
      param.images = JSON.stringify(images);
    }
    const ret = await pInfo.update({
      ...param,
    });
    if (!ret) {
      console.log(2);
      return false;
    }
  } else {
    console.log(3);
    return false;
  }

  return true;
};

export const deletePrivate = async (data) => {
  const uids = data.uids; // 会员卡id组

  for (let i = 0; i < uids.length; i += 1) {
    const pmInfo = await models.PrivateMap.findAndCountAll({
      where: {
        privateid: uids[i],
      },
    });

    if (pmInfo.count === 0) {
      const ret = await models.Private.update({
        deleted: 1,
      }, {
        where: {
          uid: uids[i],
        },
      });
      if (!ret) {
        return false;
      }
    } else {
      return false;
    }
  }

  return true;
};

export const queryPrivateDetails = async (data) => {
  $required('uid', data.uid);
  const uid = data.uid; // 会员卡id

  const res = models.Private.findOne({
    where: {
      uid,
    },
  });

  if (!res) {
    return false;
  }

  return res;
};

export const getAllPrivates = async (options, storeid) => {
  const pageCount = options.pageCount || 10;
  const curPage = options.curPage || 1;
  const param = options.param || '';

  const where = {};
  if (param !== '') {
    where.cardname = param;
  }
  where.storeid = storeid;
  const count = await models.Private.count({
    where,
  });
  const allCards = converSqlToJson(await models.Private.findAll({
    where,
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
    order: [['iid', 'DESC']],
  }));
  return {
    count,
    allCards: allCards.map(info => ({
      uid: info.uid,
      privatename: info.privatename,
      validity: info.validity,
      param: info.param,
      price: info.price,
      onsale: info.onsale,
      purchase: info.purchase,
      remark: info.remark,
      recommendWeight: info.recommendWeight,
      images: (info.images && JSON.parse(info.images)) || [],
      createdAt: moment(info.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment(info.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
      storeid: info.storeid,
    })),
  };
};

// 修改会员卡在售状态
export const updateVOnsale = async (data) => {
  $required('uid', data.uid);
  $required('onsale', data.onsale);
  const uid = data.uid; // 会员卡id
  const onsale = data.onsale; // 是否启用

  const vcInfo = await models.VipCard.update({
    onsale,
  }, {
    where: {
      uid,
    },
  });
  if (!vcInfo) {
    return false;
  }
  return true;
};

// 修改私教课在售状态
export const updatePOnsale = async (data) => {
  $required('uid', data.uid);
  $required('onsale', data.onsale);
  const uid = data.uid; // 会员卡id
  const onsale = data.onsale; // 是否启用

  const vcInfo = await models.Private.update({
    onsale,
  }, {
    where: {
      uid,
    },
  });
  if (!vcInfo) {
    return false;
  }
  return true;
};
