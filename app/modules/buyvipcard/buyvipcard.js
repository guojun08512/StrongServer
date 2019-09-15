import models from 'modules/db/models';
import ERROR, { $required, createOrderNum, converSqlToJson } from 'modules/utils';
import sequelize from 'sequelize';
import Sequelize from 'modules/db/sequelize';
import * as Search from 'modules/search';
import moment from 'moment';
import config from 'modules/config';
import { requestApi } from 'modules/request';
import * as Employee from 'modules/employee';
import * as VipCard from 'modules/vipcard';

// const payMent = {
//   cash: 1, // 现金
//   wx: 2, // 微信
//   zfb: 3, // 支付宝
//   card: 4, // 刷卡
//   other: 5, // 其他
// };

const Operation = {
  Buycard: 1, // 购卡
  RenewalCard: 2, // 续卡
  Charging: 3, // 扣费
  StopCard: 4, // 停卡
  TransferCard: 5, // 转卡
  RecoveryCard: 6, // 停卡恢复
};

export const CardStatus = {
  Normal: 1, // 正常
  Depleted: 2, // 已耗尽
  Expired: 3, // 已过期
  ExpAndDep: 4, // 过期耗尽
  Leave: 5, // 请假
  Stop: 6, // 停卡
  UnOpen: 8, // 未开卡
};

const Method = {
  Collect: 1, // 收款
  RetReat: 2, // 退款
};

const OrderStatus = {
  Pending: 1, // 待付款
  Paid: 2, // 已付款
};

const From = {
  Web: 1, // web页面
  App: 2, // 手机端
};

export const payMoney = async (data, authorization) => {
  const route = `${config.get('PAY_SERVER')}/pay/`;
  const params = {
    headers: {
      Authorization: authorization,
    },
    body: data,
  };
  const fr = await requestApi(route, 'POST', params);

  // 更新下会员消费金额
  const mInfo = await models.Member.findOne({
    where: {
      uid: data.memberid,
    },
  });
  if (mInfo && fr) {
    let amount = parseFloat(mInfo.totalamount);
    const method = data.method;
    const money = parseFloat(data.money);
    if (method === 0) {
      amount += money;
    } else {
      amount -= money;
      if (amount < 0.0000001) {
        amount = 0;
      }
    }
    const ret = await mInfo.update({
      totalamount: amount,
    });
    if (!ret) {
      return false;
    }
  }

  return fr;
};

// 购买会员卡
export const MemberBuyVipCard = async (data) => {
  $required('memberid', data.memberid);
  $required('vipcardid', data.vipcardid);
  $required('payment', data.payment);
  $required('entitycardid', data.entitycardid);
  const memberid = data.memberid; // 会员id
  const vipcardid = data.vipcardid; // 会员卡id
  const opencardtime = moment(data.opencardtime).format('YYYY-MM-DD HH:mm:ss') || moment().format('YYYY-MM-DD HH:mm:ss'); // 开卡时间
  const payment = data.payment; // 支付方式
  const entitycardid = data.entitycardid; // 实体卡号
  const volume = parseFloat(data.volume).toFixed(2) || 1.00; // 折扣卷
  const ascription = data.ascription || ''; // 业绩归属
  const deal = data.deal || 0; // 成交方式
  const remark = data.remark || ''; // 备注

  // 检查实体卡号是否重复
  const check = await models.VipCardMap.findOne({
    where: {
      entitycardid,
    },
  });
  if (check) {
    return ERROR.EntityCardExist();
  }

  const vcInfo = await models.VipCard.findOne({
    where: {
      uid: vipcardid,
      onsale: 1,
    },
  });
  if (!vcInfo) {
    return ERROR.OnsoleError();
  }

  let param1 = 0;
  let validity = 0;
  const cardsubtype = vcInfo.cardsubtype;
  if (cardsubtype === VipCard.VipCardSubType.TimeLimitCard) {
    param1 = vcInfo.validity;
    validity = param1;
  } else {
    param1 = vcInfo.param;
    validity = vcInfo.validity;
  }

  const ctime = moment().format('YYYY-MM-DD HH:mm:ss');
  let expirytime = ''; // 到期时间
  if (validity !== 0) {
    expirytime = moment(opencardtime).add(validity, 'days').format('YYYY-MM-DD HH:mm:ss');
  } else {
    expirytime = moment('9999-12-31 00:00:00').format('YYYY-MM-DD HH:mm:ss');
  }

  let contractamount = parseInt(vcInfo.price, 10); // 合同金额
  if (volume > 0 && volume < 1) {
    contractamount = parseFloat(volume * contractamount).toFixed(2);
  }

  const ret = await Sequelize.transaction(t => models.VipCardMap.create({
    memberid,
    vipcardid,
    entitycardid,
    opencardtime,
    expirytime,
    totalbuy: param1,
    curbuy: param1,
    cardstatus: ctime < opencardtime ? CardStatus.UnOpen : CardStatus.Normal,
    remark,
  }, {
    transaction: t,
  }).then((vcmInfo) => {
    if (!vcmInfo) throw new Error();
    return models.VipCardMapLog.create({
      memberid,
      vipcardid,
      vipcardmapid: vcmInfo.uid,
      entitycardid,
      opencardtime,
      expirytime,
      totalbuy: param1,
      curbuy: param1,
      cardstatus: ctime <= opencardtime ? CardStatus.UnOpen : CardStatus.Normal,
      operation: Operation.Buycard,
      remark,
    }, {
      transaction: t,
    }).then((vcmlInfo) => {
      if (!vcmlInfo) throw new Error();
      return models.Order.create({
        vcmlid: vcmlInfo.uid,
        ordernumber: createOrderNum(From.Web),
        type: VipCard.CardType.vipcard,
        money: contractamount,
        method: Method.Collect,
        payment,
        ascription,
        deal,
        remark,
        status: OrderStatus.Paid,
      }, {
        transaction: t,
      });
    });
  })).then((result) => {
    if (!result) throw new Error();
    return true;
  }).catch((err) => {
    console.log(err);
    return false;
  });

  if (!ret) {
    return ERROR.GenerateError();
  }

  return true;
};

// 购买私教课
export const MemberBuyPrivate = async (data) => {
  $required('memberid', data.memberid);
  $required('privateid', data.privateid);
  $required('number', data.number);
  $required('coachid', data.coachid);
  $required('payment', data.payment);
  const memberid = data.memberid; // 会员id
  const privateid = data.privateid; // 私教课id
  const number = parseInt(data.number, 10); // 购买节数
  const coach = data.coachid || ''; // 教练
  const opencardtime = moment(data.opencardtime).format('YYYY-MM-DD HH:mm:ss') || moment().format('YYYY-MM-DD HH:mm:ss'); // 开卡时间
  const payment = data.payment; // 支付方式
  const ascription = data.ascription || ''; // 销售教练
  const volume = parseFloat(data.volume).toFixed(2) || 1.00; // 折扣卷
  const deal = data.deal || 0; // 成交方式
  const remark = data.remark || ''; // 备注

  const pInfo = await models.Private.findOne({
    where: {
      uid: privateid,
    },
  });
  if (!pInfo) {
    return false;
  }

  const validity = pInfo.validity;

  let expirytime = ''; // 到期时间
  if (validity !== 0) {
    expirytime = moment(opencardtime).add(validity, 'days').format('YYYY-MM-DD HH:mm:ss');
  } else {
    expirytime = moment('9999-12-31 00:00:00').format('YYYY-MM-DD HH:mm:ss');
  }

  let contractamount = parseInt(pInfo.price, 10) * number; // 合同金额
  if (volume > 0 && volume < 1) {
    contractamount = parseFloat(volume * contractamount).toFixed(2);
  }

  const ret = await Sequelize.transaction(t => models.PrivateMap.create({
    memberid,
    privateid,
    coach,
    opencardtime,
    expirytime,
    totalbuy: number,
    curbuy: number,
    cardstatus: CardStatus.Normal,
    remark,
  }, {
    transaction: t,
    logging: console.log,
  }).then((pmInfo) => {
    if (!pmInfo) throw new Error();
    return models.PrivateMapLog.create({
      memberid,
      privateid,
      privatemapid: pmInfo.uid,
      coach,
      opencardtime,
      expirytime,
      totalbuy: number,
      curbuy: number,
      cardstatus: CardStatus.Normal,
      operation: Operation.Buycard,
      remark,
    }, {
      transaction: t,
    }).then((vcmlInfo) => {
      if (!vcmlInfo) throw new Error();
      return models.Order.create({
        pmlid: vcmlInfo.uid,
        ordernumber: createOrderNum(From.Web),
        type: VipCard.CardType.private,
        money: contractamount,
        method: Method.Collect,
        operation: Operation.Buycard,
        payment,
        ascription,
        deal,
        remark,
        status: OrderStatus.Paid,
      }, {
        transaction: t,
      });
    });
  })).then((result) => {
    if (!result) throw new Error();
    return true;
  }).catch((err) => {
    console.log(err);
    return false;
  });

  if (!ret) {
    return ERROR.GenerateError();
  }

  return true;
};

// 查询所有会员卡
export const QueryAllBVCard = async (data, storeid) => {
  $required('storeid', storeid);
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;
  const memberid = data.memberid;
  const cardsubtype = data.cardsubtype; // 会员卡类型
  const cardstatus = data.cardstatus; // 会员卡状态

  const where = {};
  if (cardsubtype !== undefined) {
    where.cardsubtype = cardsubtype;
  }
  const where1 = {};
  if (cardstatus !== undefined) {
    where1.cardstatus = cardstatus;
  }
  const where2 = {};
  if (memberid !== undefined) {
    where2.uid = memberid;
  }
  const include = [{
    model: models.Member,
    as: 'members',
    attributes: ['uid'],
    where: {
      storeid,
    },
    include: {
      model: models.PDMember,
      as: 'pdmembers',
      attributes: ['username'],
      where: where2,
    },
  }, {
    model: models.VipCard,
    as: 'vipcards',
    attributes: ['cardname', 'cardsubtype'],
    where,
  }];
  const count = await models.VipCardMap.count({
    include,
    where: where1,
  });
  const allInfos = converSqlToJson(await models.VipCardMap.findAll({
    include,
    where: where1,
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
    order: [['iid', 'DESC']],
  }));

  return {
    count,
    allInfos: allInfos.map(info => ({
      ...info,
      validity: moment(info.expirytime).diff(moment(), 'days') >= 0 ? moment(info.expirytime).diff(moment(), 'days') : 0,
      opencardtime: moment(info.opencardtime).format('YYYY-MM-DD HH:mm:ss'),
      expirytime: moment(info.expirytime).format('YYYY-MM-DD HH:mm:ss'),
      leavestarttime: moment(info.leavestarttime).format('YYYY-MM-DD HH:mm:ss'),
      leaveendtime: moment(info.leaveendtime).format('YYYY-MM-DD HH:mm:ss'),
      createdAt: moment(info.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment(info.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
    })),
  };
};

// 查询所有私教课
export const QueryAllBPCard = async (data, storeid) => {
  $required('storeid', storeid);
  const coach = data.coach;
  const pdmemberid = data.memberid;
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;

  const where = {};
  if (pdmemberid !== undefined) {
    where.uid = pdmemberid;
  }
  const where1 = {};
  if (coach !== undefined) {
    where1.coach = coach;
  }
  const include = [{
    include: {
      model: models.PDMember,
      as: 'pdmembers',
      attributes: ['uid', 'username', 'cellphone'],
      where,
    },
    model: models.Member,
    as: 'members',
    attributes: ['uid'],
    where: {
      storeid,
    },
  }, {
    model: models.Private,
    as: 'privates',
    attributes: ['uid', 'privatename'],
  }];
  const count = await models.PrivateMap.count({
    include,
    where: where1,
  });
  const allInfos = converSqlToJson(await models.PrivateMap.findAll({
    include,
    where: where1,
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
    order: [['iid', 'DESC']],
  }));

  // const vec = [];
  // for (let i = 0; i < allInfos.length; i += 1) {
  //   const privatemapid = allInfos[i].uid;
  //   const splInfo = await models.SignPrivateLesson.findOne({
  //     where: {
  //       privateId: privatemapid,
  //       storeid,
  //       memberId: allInfos[i].members.uid,
  //     },
  //   });
  //   let curbuy = allInfos[i].curbuy;
  //   if (splInfo) {
  //     curbuy = splInfo.signNumber;
  //   }
  //   vec.push({
  //     ...allInfos[i],
  //     curbuy,
  //     opencardtime: moment(allInfos[i].opencardtime).format('YYYY-MM-DD HH:mm:ss'),
  //     expirytime: moment(allInfos[i].expirytime).format('YYYY-MM-DD HH:mm:ss'),
  //     leavestarttime: moment(allInfos[i].leavestarttime).format('YYYY-MM-DD HH:mm:ss'),
  //     leaveendtime: moment(allInfos[i].leaveendtime).format('YYYY-MM-DD HH:mm:ss'),
  //     createdAt: moment(allInfos[i].createdAt).format('YYYY-MM-DD HH:mm:ss'),
  //     updatedAt: moment(allInfos[i].updatedAt).format('YYYY-MM-DD HH:mm:ss'),
  //   });
  // }
  // return {
  //   count,
  //   allInfos: vec,
  // };
  return {
    count,
    allInfos: allInfos.map(info => ({
      ...info,
      opencardtime: moment(info.opencardtime).format('YYYY-MM-DD HH:mm:ss'),
      expirytime: moment(info.expirytime).format('YYYY-MM-DD HH:mm:ss'),
      leavestarttime: moment(info.leavestarttime).format('YYYY-MM-DD HH:mm:ss'),
      leaveendtime: moment(info.leaveendtime).format('YYYY-MM-DD HH:mm:ss'),
      createdAt: moment(info.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment(info.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
    })),
  };
};

// 赠送会员卡体验卡
export const GiveExperienceCard = async (data) => {
  $required('memberid', data.memberid);
  $required('vipcardid', data.vipcardid);
  $required('entitycardid', data.entitycardid);
  $required('give', data.give);
  $required('opencardtime', data.opencardtime);
  const memberid = data.memberid; // 会员id
  const vipcardid = data.vipcardid; // 会员卡id
  const entitycardid = data.entitycardid; // 实体卡号
  const give = data.give; // 赠送数
  const opencardtime = moment(data.opencardtime, '').format('YYYY-MM-DD HH:mm:ss'); // 开卡时间
  const remark = data.remark || ''; // 备注

  // 检查实体卡号是否重复
  const check = await models.VipCardMap.findOne({
    where: {
      entitycardid,
    },
  });
  if (check) {
    return ERROR.EntityCardExist();
  }

  const vcInfo = await models.VipCard.findOne({
    where: {
      uid: vipcardid,
    },
  });
  if (!vcInfo) {
    return false;
  }

  let param1 = 0;
  let param2 = 0;
  let validity = 0;
  const cardsubtype = vcInfo.cardsubtype;
  if (cardsubtype === VipCard.VipCardSubType.TimeLimitCard) {
    param1 = vcInfo.validity;
    param2 = give;
    validity = param1 + param2;
  } else {
    param1 = vcInfo.param;
    param2 = give;
    validity = vcInfo.validity;
  }

  const expirytime = moment(opencardtime).add(parseInt(validity, 10), 'days').format('YYYY-MM-DD HH:mm:ss');

  const ret = models.VipCardMap.create({
    memberid, vipcardid, entitycardid, opencardtime, expirytime, totalbuy: param1, curbuy: param1, totalgive: param2, curgive: param2, cardstatus: CardStatus.Normal, remark,
  });

  if (!ret) {
    return false;
  }
  return true;
};

// 赠送私教课体验卡
export const GivePrivateCard = async (data) => {
  $required('memberid', data.memberid);
  $required('privateid', data.privateid);
  $required('entitycardid', data.entitycardid);
  $required('give', data.give);
  $required('opencardtime', data.opencardtime);
  $required('coachid', data.coachid);
  const memberid = data.memberid; // 会员id
  const privateid = data.privateid; // 会员卡id
  const entitycardid = data.entitycardid; // 实体卡号
  const give = data.give; // 赠送数
  const opencardtime = moment(data.opencardtime, '').format('YYYY-MM-DD HH:mm:ss'); // 开卡时间
  const remark = data.remark || ''; // 备注
  const coach = data.coachid; // 教练
  console.log(data);

  // 检查实体卡号是否重复
  const check = await models.PrivateMap.findOne({
    where: {
      entitycardid,
    },
  });
  if (check) {
    return ERROR.EntityCardExist();
  }

  const pInfo = await models.Private.findOne({
    where: {
      uid: privateid,
    },
  });
  if (!pInfo) {
    return false;
  }

  const param1 = pInfo.param;
  const param2 = give;
  const validity = pInfo.validity;

  const expirytime = moment(opencardtime).add(parseInt(validity, 10), 'days').format('YYYY-MM-DD HH:mm:ss');

  const ret = models.PrivateMap.create({
    memberid,
    privateid,
    entitycardid,
    opencardtime,
    expirytime,
    coach,
    totalbuy: param1,
    curbuy: param1,
    totalgive: param2,
    curgive: param2,
    cardstatus: CardStatus.Normal,
    remark,
  });

  if (!ret) {
    return false;
  }
  return true;
};

// 编辑购买会员卡
export const EditVipCard = async (data) => {
  console.log(data);
  // $required('uid', data.uid);
  // $required('entitycardid', data.entitycardid);
  // if (data.opencardtime !== undefined) {
  //   return ERROR.OpenTimeError();
  // }
  // const uid = data.uid;
  // const entitycardid = data.entitycardid; // 实体卡号
  // const validity = data.validity || ''; // 有效期
  // console.log(data);

  // // 检查实体卡号是否存在
  // const cardMapInfo = await models.VipCardMap.findOne({ where: { uid } });
  // if (cardMapInfo) {
  //   if (cardMapInfo.entitycardid !== data.entitycardid) {
  //     const vcmInfo = await models.VipCardMap.findOne({
  //       where: {
  //         entitycardid,
  //       },
  //     });
  //     if (vcmInfo) {
  //       return ERROR.EntityCardExist();
  //     }
  //   }
  // }

  // const result = await Sequelize.transaction(t => models.VipCardMapLog.update({
  //   iseditstatus: 1,
  // }, {
  //   where: {
  //     vipcardmapid: data.uid,
  //     iseditstatus: 0,
  //   },
  //   transaction: t,
  // }).then((res) => {
  //   if (!res) throw new Error();
  //   return models.VipCardMapLog.create({
  //     vipcardmapid: cardMapInfo.uid,
  //     entitycardid: cardMapInfo.entitycardid,
  //     opencardtime: cardMapInfo.opencardtime,
  //     expirytime: cardMapInfo.expirytime,
  //     orderid: cardMapInfo.orderid,
  //     totalbuy: cardMapInfo.totalbuy,
  //     curbuy: cardMapInfo.curbuy,
  //     totalgive: cardMapInfo.totalgive,
  //     curgive: cardMapInfo.curgive,
  //     cardstatus: cardMapInfo.cardstatus,
  //     remark: cardMapInfo.remark,
  //     operation: Operation.EditCard,
  //     Reason: data.Reason,
  //     iseditstatus: 0,
  //   }, {
  //     transaction: t,
  //   }).then((res2) => {
  //     if (!res2) throw new Error();
  //     let expirytime = '';
  //     const opencardtime = moment(cardMapInfo.opencardtime).format('YYYY-MM-DD HH:mm:ss'); // 开卡时间
  //     if (validity !== '') {
  //       expirytime = moment(opencardtime).add(parseInt(validity, 10), 'days').format('YYYY-MM-DD HH:mm:ss');
  //     } else if (validity === '') {
  //       const vcInfo = models.VipCard.findOne({
  //         where: {
  //           uid: cardMapInfo.vipcardid,
  //         },
  //       });
  //       const type = vcInfo.cardSubType;
  //       if (type === VipCard.VipCardSubType.TimeLimitCard) {
  //         expirytime = cardMapInfo.expirytime;
  //       } else {
  //         expirytime = moment('9999-12-31 23:59:59').format('YYYY-MM-DD HH:mm:ss');
  //       }
  //     }
  //     return cardMapInfo.update({
  //       ...data,
  //       expirytime,
  //       cardstatus: CardStatus.Normal,
  //     }, {
  //       transaction: t,
  //     });
  //   });
  // })).then((res) => {
  //   if (!res) throw new Error();
  //   return true;
  // }).catch((err) => {
  //   console.log(err);
  //   return false;
  // });
  // console.log(result);
  // return result;
};

// 编辑购买私教课
export const EditPrivateCard = async (data) => {
  console.log(data);
  // $required('uid', data.uid);
  // $required('entitycardid', data.entitycardid);
  // if (data.opencardtime !== undefined) {
  //   return ERROR.OpenTimeError();
  // }
  // const uid = data.uid;
  // const entitycardid = data.entitycardid; // 实体卡号
  // const validity = data.validity || ''; // 有效期
  // console.log(data);

  // // 检查实体卡号是否存在
  // const pmInfo = await models.PrivateMap.findOne({ where: { uid } });
  // if (pmInfo) {
  //   if (pmInfo.entitycardid !== data.entitycardid) {
  //     const vcmInfo = await models.PrivateMap.findOne({
  //       where: {
  //         entitycardid,
  //       },
  //     });
  //     if (vcmInfo) {
  //       return ERROR.EntityCardExist();
  //     }
  //   }
  // }

  // const result = await Sequelize.transaction(t => models.PrivateMapLog.update({
  //   iseditstatus: 1,
  // }, {
  //   where: {
  //     privatemapid: data.uid,
  //     iseditstatus: 0,
  //   },
  //   transaction: t,
  // }).then((res) => {
  //   if (!res) throw new Error();
  //   return models.PrivateMapLog.create({
  //     privatemapid: pmInfo.uid,
  //     entitycardid: pmInfo.entitycardid,
  //     opencardtime: pmInfo.opencardtime,
  //     expirytime: pmInfo.expirytime,
  //     coach: pmInfo.coach,
  //     orderid: pmInfo.orderid,
  //     totalbuy: pmInfo.totalbuy,
  //     curbuy: pmInfo.curbuy,
  //     totalgive: pmInfo.totalgive,
  //     curgive: pmInfo.curgive,
  //     cardstatus: pmInfo.cardstatus,
  //     remark: pmInfo.remark,
  //     operation: Operation.EditCard,
  //     Reason: data.Reason,
  //     iseditstatus: 0,
  //   }, {
  //     transaction: t,
  //   }).then((res2) => {
  //     if (!res2) throw new Error();
  //     let expirytime = '';
  //     const opencardtime = moment(pmInfo.opencardtime).format('YYYY-MM-DD HH:mm:ss'); // 开卡时间
  //     if (validity !== '') {
  //       expirytime = moment(opencardtime).add(parseInt(validity, 10), 'days').format('YYYY-MM-DD HH:mm:ss');
  //     } else if (validity === '') {
  //       expirytime = moment('9999-12-31 23:59:59').format('YYYY-MM-DD HH:mm:ss');
  //     }
  //     return pmInfo.update({
  //       ...data,
  //       expirytime,
  //       cardstatus: CardStatus.Normal,
  //     }, {
  //       transaction: t,
  //     });
  //   });
  // })).then((res) => {
  //   if (!res) throw new Error();
  //   return true;
  // }).catch((err) => {
  //   console.log(err);
  //   return false;
  // });
  // console.log(result);
  // return result;
};

// 续卡
export const RenewalCard = async (data) => {
  $required('vipcardmapid', data.vipcardmapid);
  $required('vipcardid', data.vipcardid);
  $required('payment', data.payment);
  const vipcardmapid = data.vipcardmapid; // 会员卡购卡id
  const vipcardid = data.vipcardid; // 会员卡id
  const volume = parseFloat(data.volume).toFixed(2) || 1.00; // 折扣卷
  const payment = data.payment; // 付款方式
  const ascription = data.ascription || ''; // 业绩归属
  const remark = data.remark || ''; // 备注

  // 当前卡
  const vcmInfo = await models.VipCardMap.findOne({
    include: {
      model: models.VipCard,
      as: 'vipcards',
      attributes: ['uid', 'cardsubtype'],
    },
    where: {
      uid: vipcardmapid,
    },
    logging: console.log,
  });

  // 续卡
  const vcInfo = await models.VipCard.findOne({
    where: {
      uid: vipcardid,
    },
    logging: console.log,
  });

  const vcmType = vcmInfo.vipcards.cardsubtype;
  const vcType = vcInfo.cardsubtype;
  if (vcmType !== vcType) {
    return ERROR.CardTypeError();
  }

  let contractamount = parseFloat(vcInfo.price).toFixed(2); // 合同金额
  if (volume > 0 && volume < 1) {
    contractamount = parseFloat(volume * contractamount).toFixed(2);
  }

  let expirytime = vcmInfo.expirytime;
  const ctime = moment().format('YYYY-MM-DD HH:mm:ss');
  if (ctime > expirytime) {
    expirytime = moment(ctime).add(vcInfo.validity, 'days').format('YYYY-MM-DD HH:mm:ss');
  } else {
    expirytime = moment(vcmInfo.expirytime).add(vcInfo.validity, 'days').format('YYYY-MM-DD HH:mm:ss');
  }

  const ret = await Sequelize.transaction(t => models.VipCardMapLog.create({
    memberid: vcmInfo.memberid,
    vipcardid: vcmInfo.vipcardid,
    vipcardmapid: vcmInfo.uid,
    entitycardid: vcmInfo.entitycardid,
    opencardtime: vcmInfo.opencardtime,
    expirytime: vcmInfo.expirytime,
    leavestarttime: vcmInfo.leavestarttime,
    leaveendtime: vcmInfo.leaveendtime,
    totalbuy: vcmInfo.totalbuy,
    curbuy: vcmInfo.curbuy,
    cardstatus: vcmInfo.cardstatus,
    operation: Operation.RenewalCard,
    remark: vcmInfo.remark,
  }, {
    transaction: t,
  }).then((vcmlInfo) => {
    if (!vcmlInfo) throw new Error();
    console.log(vcmlInfo.uid);
    return models.Order.create({
      vcmlid: vcmlInfo.uid,
      ordernumber: createOrderNum(From.Web),
      type: VipCard.CardType.vipcard,
      contractamount,
      method: Method.Collect,
      payment,
      ascription,
      deal: 0,
      remark,
      status: OrderStatus.Paid,
    }, {
      transaction: t,
    }).then((oInfo) => {
      if (!oInfo) throw new Error();
      return vcmInfo.update({
        expirytime,
        totalbuy: parseInt(vcmInfo.totalbuy, 10) + parseInt(vcInfo.param, 10),
        curbuy: parseInt(vcmInfo.curbuy, 10) + parseInt(vcInfo.param, 10),
        cardstatus: CardStatus.Normal,
      }, {
        transaction: t,
      });
    });
  })).then((result) => {
    if (!result) throw new Error();
    return true;
  }).catch((err) => {
    console.log(err);
    return false;
  });

  if (!ret) {
    return ERROR.GenerateError();
  }

  return true;
};

// 续私教
export const RenewalPrivate = async (data) => {
  $required('privatemapid', data.privatemapid);
  $required('privateid', data.privateid);
  $required('payment', data.payment);
  $required('param', data.param);
  const privatemapid = data.privatemapid; // 会员卡购卡id
  const param = data.param; // 次数
  const price = parseFloat(data.price).toFixed(2) || 0.00; // 金额
  const volume = parseFloat(data.volume).toFixed(2) || 1.00; // 折扣卷
  const payment = data.payment; // 付款方式
  const ascription = data.ascription || ''; // 业绩归属
  const remark = data.remark || ''; // 备注
  console.log(privatemapid);

  // 当前卡
  const pmInfo = await models.PrivateMap.findOne({
    where: {
      uid: privatemapid,
    },
  });

  let contractamount = parseFloat(price).toFixed(2); // 合同金额
  if (volume > 0 && volume < 1) {
    contractamount = parseFloat(volume * contractamount).toFixed(2);
  }

  const ret = await Sequelize.transaction(t => models.PrivateMapLog.create({
    memberid: pmInfo.memberid,
    privateid: pmInfo.privateid,
    privatemapid: pmInfo.uid,
    opencardtime: pmInfo.opencardtime,
    expirytime: pmInfo.expirytime,
    totalbuy: pmInfo.totalbuy,
    curbuy: pmInfo.curbuy,
    cardstatus: pmInfo.cardstatus,
    operation: Operation.RenewalCard,
    remark: pmInfo.remark,
  }, {
    transaction: t,
  }).then((pmlInfo) => {
    if (!pmlInfo) throw new Error();
    return models.Order.create({
      pmlid: pmlInfo.uid,
      ordernumber: createOrderNum(From.Web),
      type: VipCard.CardType.private,
      contractamount,
      method: Method.Collect,
      payment,
      ascription,
      deal: 0,
      remark,
      status: OrderStatus.Paid,
    }, {
      transaction: t,
    }).then((oInfo) => {
      if (!oInfo) throw new Error();
      return pmInfo.update({
        totalbuy: parseInt(pmInfo.totalbuy, 10) + parseInt(param, 10),
        curbuy: parseInt(pmInfo.curbuy, 10) + parseInt(param, 10),
        cardstatus: CardStatus.Normal,
      }, {
        transaction: t,
      });
    });
  })).then((result) => {
    if (!result) throw new Error();
    return true;
  }).catch((err) => {
    console.log(err);
    return false;
  });

  if (!ret) {
    return ERROR.GenerateError();
  }

  return true;
};

// 扣费
export const ChargeCard = async (data) => {
  $required('vipcardmapid', data.vipcardmapid);
  $required('param', data.param);
  const vipcardmapid = data.vipcardmapid;
  const param = parseInt(data.param, 10); // 扣除参数
  const remark = data.remark || ''; // 备注

  // 当前卡
  const vcmInfo = await models.VipCardMap.findOne({
    include: {
      model: models.VipCard,
      as: 'vipcards',
      attributes: ['uid', 'cardsubtype'],
    },
    where: {
      uid: vipcardmapid,
    },
  });

  let curbuy = 0;
  let expirytime = '';
  const type = vcmInfo.vipcards.cardsubtype;
  if (type === VipCard.VipCardSubType.TimeLimitCard) {
    curbuy = vcmInfo.curbuy;
    expirytime = moment(vcmInfo.expirytime).subtract(param, 'days').format('YYYY-MM-DD HH:mm:ss');
  } else {
    curbuy = parseInt(vcmInfo.curbuy - param, 10);
    expirytime = vcmInfo.expirytime;
  }

  if (curbuy < 0) {
    return Error.BalanceError();
  }

  const ret = await Sequelize.transaction(t => models.VipCardMapLog.create({
    memberid: vcmInfo.memberid,
    vipcardid: vcmInfo.vipcardid,
    vipcardmapid: vcmInfo.uid,
    entitycardid: vcmInfo.entitycardid,
    opencardtime: vcmInfo.opencardtime,
    expirytime: vcmInfo.expirytime,
    leavestarttime: vcmInfo.leavestarttime,
    leaveendtime: vcmInfo.leaveendtime,
    totalbuy: vcmInfo.totalbuy,
    curbuy: vcmInfo.curbuy,
    cardstatus: vcmInfo.cardstatus,
    remark: vcmInfo.remark,
  }, {
    transaction: t,
  }).then((vcmlInfo) => {
    if (!vcmlInfo) throw new Error();
    return vcmInfo.update({
      expirytime,
      curbuy,
      cardstatus: CardStatus.Normal,
      remark,
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

  if (!ret) {
    return ERROR.GenerateError();
  }

  return true;
};

// 停卡
export const StopCard = async (data) => {
  $required('vipcardmapid', data.vipcardmapid);
  const vipcardmapid = data.vipcardmapid;
  const remark = data.remark || ''; // 备注

  // 当前卡
  const vcmInfo = await models.VipCardMap.findOne({
    include: {
      model: models.VipCard,
      as: 'vipcards',
      attributes: ['uid', 'cardsubtype'],
    },
    where: {
      uid: vipcardmapid,
    },
  });

  const ret = await Sequelize.transaction(t => models.VipCardMapLog.create({
    memberid: vcmInfo.memberid,
    vipcardid: vcmInfo.vipcardid,
    vipcardmapid: vcmInfo.uid,
    entitycardid: vcmInfo.entitycardid,
    opencardtime: vcmInfo.opencardtime,
    expirytime: vcmInfo.expirytime,
    leavestarttime: vcmInfo.leavestarttime,
    leaveendtime: vcmInfo.leaveendtime,
    totalbuy: vcmInfo.totalbuy,
    curbuy: vcmInfo.curbuy,
    cardstatus: vcmInfo.cardstatus,
    remark: vcmInfo.remark,
  }, {
    transaction: t,
  }).then((vcmlInfo) => {
    if (!vcmlInfo) throw new Error();
    return vcmInfo.update({
      cardstatus: CardStatus.Stop,
      operation: Operation.StopCard,
      remark,
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

  if (!ret) {
    return ERROR.GenerateError();
  }

  return true;
};

// 停卡恢复
export const RecoveryCard = async (data) => {
  $required('vipcardmapid', data.vipcardmapid);
  const vipcardmapid = data.vipcardmapid;
  const remark = data.remark || ''; // 备注

  // 当前卡
  const vcmInfo = await models.VipCardMap.findOne({
    where: {
      uid: vipcardmapid,
    },
  });

  const ret = await Sequelize.transaction(t => models.VipCardMapLog.create({
    memberid: vcmInfo.memberid,
    vipcardid: vcmInfo.vipcardid,
    vipcardmapid: vcmInfo.uid,
    entitycardid: vcmInfo.entitycardid,
    opencardtime: vcmInfo.opencardtime,
    expirytime: vcmInfo.expirytime,
    leavestarttime: vcmInfo.leavestarttime,
    leaveendtime: vcmInfo.leaveendtime,
    totalbuy: vcmInfo.totalbuy,
    curbuy: vcmInfo.curbuy,
    cardstatus: vcmInfo.cardstatus,
    operation: Operation.RecoveryCard,
    remark: vcmInfo.remark,
  }, {
    transaction: t,
  }).then((vcmlInfo) => {
    if (!vcmlInfo) throw new Error();
    return vcmInfo.update({
      cardstatus: CardStatus.Normal,
      remark,
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

// 转卡
export const TransferCard = async (data, storeid) => {
  $required('vipcardmapid', data.vipcardmapid);
  $required('memberid', data.memberid);
  $required('price', data.price);
  $required('payment', data.payment);
  const vipcardmapid = data.vipcardmapid; // 卡id
  const memberid = data.memberid; // 会员id
  const price = data.price; // 金额
  const payment = data.payment; // 付款方式
  const volume = parseFloat(data.volume).toFixed(2) || 1.00; // 折扣卷
  const remark = data.remark || ''; // 备注

  // 当前卡
  const vcmInfo = await models.VipCardMap.findOne({
    include: {
      model: models.VipCard,
      as: 'vipcards',
      attributes: ['uid', 'cardsubtype'],
    },
    where: {
      uid: vipcardmapid,
    },
  });

  // 转的会员
  const mInfo = await models.Member.findOne({
    where: {
      storeid,
      pdmemberid: memberid,
    },
  });

  let contractamount = parseFloat(price).toFixed(2); // 合同金额
  if (volume > 0 && volume < 1) {
    contractamount = parseFloat(volume * contractamount).toFixed(2);
  }

  const ret = await Sequelize.transaction(t => models.VipCardMapLog.create({
    memberid: vcmInfo.memberid,
    vipcardid: vcmInfo.vipcardid,
    vipcardmapid: vcmInfo.uid,
    entitycardid: vcmInfo.entitycardid,
    opencardtime: vcmInfo.opencardtime,
    expirytime: vcmInfo.expirytime,
    leavestarttime: vcmInfo.leavestarttime,
    leaveendtime: vcmInfo.leaveendtime,
    totalbuy: vcmInfo.totalbuy,
    curbuy: vcmInfo.curbuy,
    cardstatus: vcmInfo.cardstatus,
    operation: Operation.TransferCard,
    remark: vcmInfo.remark,
  }, {
    transaction: t,
  }).then((vcmlInfo) => {
    if (!vcmlInfo) throw new Error();
    return models.Order.create({
      vcmlid: vcmlInfo.uid,
      ordernumber: createOrderNum(From.Web),
      type: VipCard.CardType.vipcard,
      contractamount,
      method: Method.Collect,
      operation: Operation.Buycard,
      payment,
      deal: 0,
      remark,
      status: OrderStatus.Paid,
    }, {
      transaction: t,
    }).then((oInfo) => {
      if (!oInfo) throw new Error();
      return vcmInfo.update({
        memberid: mInfo.uid,
        cardstatus: CardStatus.Normal,
      }, {
        transaction: t,
      });
    });
  })).then((result) => {
    if (!result) throw new Error();
    return true;
  }).catch((err) => {
    console.log(err);
    return false;
  });

  if (!ret) {
    return ERROR.GenerateError();
  }

  return true;
};

// 请假
export const LeaveCard = async (data) => {
  $required('uids', data.uids);
  $required('leavestarttime', data.leavestarttime);
  $required('leaveendtime', data.leaveendtime);
  const uids = data.uids; // 卡ids
  const leavestarttime = data.leaveendtime; // 请假开始时间
  const leaveendtime = data.leaveendtime; // 请假结束时间

  const ret = await models.VipCardMap.update({
    leavestarttime,
    leaveendtime,
    cardstatus: CardStatus.Leave,
  }, {
    where: {
      uid: uids,
    },
  });

  return ret;
};

// 有效会员
export const queryEffective = async (data, storeid) => {
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;
  const from = data.from;
  const belong = data.belong;
  const sex = data.sex;
  // const coach = data.coach;
  const uid = data.uid;

  let sql = 'SELECT A.`uid` FROM `Members` AS A left join `PDMembers` as b on A.`pdmemberid` = b.`uid` WHERE A.`uid` IN (SELECT DISTINCT memberid FROM `VipCardMaps` AS B WHERE B.`cardstatus` = ?) And A.`storeid` = ? And A.`deleted` = 0';
  if (from !== undefined) {
    sql += ' And A.from = \'';
    sql += from.toString();
    sql += '\'';
  }
  if (belong !== undefined) {
    sql += ' And A.belong = \'';
    sql += belong.toString();
    sql += '\'';
  }
  if (sex !== undefined) {
    sql += ' And b.sex = \'';
    sql += sex.toString();
    sql += '\'';
  }
  if (uid !== undefined) {
    sql += ' And A.pdmemberid = \'';
    sql += uid.toString();
    sql += '\'';
  }
  console.log(sql);
  const count = await Sequelize.query(sql, { replacements: [CardStatus.Normal, storeid, pageCount, (curPage - 1) * pageCount], type: sequelize.QueryTypes.SELECT });
  sql += ' ORDER BY A.`iid` DESC LIMIT ? OFFSET ?';
  const allInfos = await Sequelize.query(sql, { replacements: [CardStatus.Normal, storeid, pageCount, (curPage - 1) * pageCount], type: sequelize.QueryTypes.SELECT });

  const vec = [];
  for (let i = 0; i < allInfos.length; i += 1) {
    const memberid = allInfos[i].uid;
    const mInfo = await models.Member.findOne({
      include: {
        model: models.PDMember,
        as: 'pdmembers',
        attributes: ['uid', 'username', 'sex', 'cellphone', 'birthday'],
      },
      attributes: ['uid', 'from', 'createdAt', 'belong'],
      where: {
        uid: memberid,
      },
    });

    const vcmInfo = await models.VipCardMap.findAll({
      include: [{
        model: models.Member,
        as: 'members',
        attributes: ['uid'],
        where: {
          uid: memberid,
        },
      }, {
        model: models.VipCard,
        as: 'vipcards',
        attributes: ['uid', 'cardname'],
      }],
      attributes: ['uid'],
    });

    const vec1 = [];
    for (let j = 0; j < vcmInfo.length; j += 1) {
      vec1.push(vcmInfo[j].vipcards.cardname);
    }

    vec.push({
      uid: mInfo.uid,
      username: mInfo.pdmembers.username,
      sex: mInfo.pdmembers.sex,
      cardname: vec1,
      cellphone: mInfo.pdmembers.cellphone,
      from: mInfo.from,
      birthday: mInfo.pdmembers.birthday,
      createdAt: moment(mInfo.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      belong: mInfo.belong,
    });
  }

  return {
    count: count.length,
    infoVec: vec,
  };
};

// 潜在会员
export const queryPotential = async (data, storeid) => {
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;
  const from = data.from;
  const belong = data.belong;
  const sex = data.sex;
  // const coach = data.coach;
  const uid = data.uid;

  let sql = 'SELECT A.uid FROM `Members` AS A left join `PDMembers` as b on A.`pdmemberid` = b.`uid` WHERE A.`uid` NOT IN (SELECT DISTINCT memberid FROM `VipCardMaps`) AND A.`storeid` = ? And A.`deleted` = 0';
  if (from !== undefined) {
    sql += ' And A.`from` = \'';
    sql += from.toString();
    sql += '\'';
  }
  if (belong !== undefined) {
    sql += ' And A.`belong` = \'';
    sql += belong.toString();
    sql += '\'';
  }
  if (sex !== undefined) {
    sql += ' And b.`sex` = \'';
    sql += sex.toString();
    sql += '\'';
  }
  if (uid !== undefined) {
    sql += ' And A.`pdmemberid` = \'';
    sql += uid.toString();
    sql += '\'';
  }
  console.log(sql);
  const count = await Sequelize.query(sql, { replacements: [storeid, pageCount, (curPage - 1) * pageCount], type: sequelize.QueryTypes.SELECT });
  sql += ' ORDER BY A.`iid` DESC LIMIT ? OFFSET ?';
  const allInfos = await Sequelize.query(sql, { replacements: [storeid, pageCount, (curPage - 1) * pageCount], type: sequelize.QueryTypes.SELECT });

  const vec = [];
  for (let i = 0; i < allInfos.length; i += 1) {
    const memberid = allInfos[i].uid;
    const mInfo = await models.Member.findOne({
      include: {
        model: models.PDMember,
        as: 'pdmembers',
        attributes: ['uid', 'username', 'sex', 'cellphone', 'birthday'],
      },
      attributes: ['uid', 'from', 'belong', 'createdAt'],
      where: {
        uid: memberid,
      },
    });

    vec.push({
      uid: mInfo.uid,
      username: mInfo.pdmembers.username,
      sex: mInfo.pdmembers.sex,
      coachname: '',
      shipname: mInfo.belong,
      cellphone: mInfo.pdmembers.cellphone,
      from: mInfo.from,
      birthday: mInfo.pdmembers.birthday,
      createdAt: moment(mInfo.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    });
  }

  return {
    count: count.length,
    infoVec: vec,
  };
};

// 过期会员
export const expiredMember = async (data, storeid) => {
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;
  const from = data.from;
  const belong = data.belong;
  const sex = data.sex;
  // const coach = data.coach;
  const uid = data.uid;

  let sql = 'SELECT A.uid FROM `Members` AS A left join `PDMembers` as b on A.`pdmemberid` = b.`uid` WHERE A.`uid` IN (SELECT DISTINCT memberid FROM `VipCardMaps` AS B WHERE B.`cardstatus` = ? OR B.`cardstatus` = ?) And A.`storeid` = ? And A.`deleted` = 0';
  if (from !== undefined) {
    sql += ' And A.`from` = \'';
    sql += from.toString();
    sql += '\'';
  }
  if (belong !== undefined) {
    sql += ' And A.`belong` = \'';
    sql += belong.toString();
    sql += '\'';
  }
  if (sex !== undefined) {
    sql += ' And b.`sex` = \'';
    sql += sex.toString();
    sql += '\'';
  }
  if (uid !== undefined) {
    sql += ' And A.`pdmemberid` = \'';
    sql += uid.toString();
    sql += '\'';
  }

  const count = await Sequelize.query(sql, { replacements: [CardStatus.Expired, CardStatus.ExpAndDep, storeid, pageCount, (curPage - 1) * pageCount], type: sequelize.QueryTypes.SELECT });
  sql += ' ORDER BY A.`iid` DESC LIMIT ? OFFSET ?';
  const allInfos = await Sequelize.query(sql, { replacements: [CardStatus.Expired, CardStatus.ExpAndDep, storeid, pageCount, (curPage - 1) * pageCount], type: sequelize.QueryTypes.SELECT });

  const vec = [];
  for (let i = 0; i < allInfos.length; i += 1) {
    const memberid = allInfos[i].uid;
    const mInfo = await models.Member.findOne({
      include: {
        model: models.PDMember,
        as: 'pdmembers',
        attributes: ['uid', 'username', 'sex', 'cellphone', 'birthday'],
      },
      attributes: ['uid', 'from', 'belong', 'createdAt'],
      where: {
        uid: memberid,
      },
    });

    const vcmInfo = await models.VipCardMap.findAll({
      include: [{
        model: models.Member,
        as: 'members',
        attributes: ['uid'],
        where: {
          uid: memberid,
        },
      }, {
        model: models.VipCard,
        as: 'vipcards',
        attributes: ['uid', 'cardname'],
      }],
      attributes: ['uid'],
    });

    const vec1 = [];
    for (let j = 0; j < vcmInfo.length; j += 1) {
      vec1.push(vcmInfo[j].vipcards.cardname);
    }

    vec.push({
      uid: mInfo.uid,
      username: mInfo.pdmembers.username,
      sex: mInfo.pdmembers.sex,
      cardname: vec1,
      cellphone: mInfo.pdmembers.cellphone,
      from: mInfo.from,
      birthday: mInfo.pdmembers.birthday,
      belong: mInfo.belong,
      createdAt: moment(mInfo.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    });
  }

  return {
    count: count.length,
    infoVec: vec,
  };
};

// 体验卡会员
export const experienceMember = async (data, storeid) => {
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;
  const from = data.from; // 来源
  const belong = data.belong; // 会籍归属
  const sex = data.sex; // 性别
  // const coach = data.coach; // 所属教练
  const uid = data.uid; // 会员id

  let sql = 'SELECT a.`uid` FROM `Members` a\n' +
  'LEFT JOIN `PDMembers` b ON a.`pdmemberid` = b.`uid`\n' +
  'LEFT JOIN `VipCardMaps` c ON c.`memberid` = a.`uid`\n' +
  'LEFT JOIN `VipCards` d ON c.`vipcardid` = d.`uid`\n' +
  'WHERE a.`storeid` = ? AND d.`cardtype` = ?';
  if (from !== undefined) {
    sql += ' And a.`from` = \'';
    sql += from.toString();
    sql += '\'';
  }
  if (belong !== undefined) {
    sql += ' And a.`belong` = \'';
    sql += belong.toString();
    sql += '\'';
  }
  if (sex !== undefined) {
    sql += ' And b.`sex` = \'';
    sql += sex.toString();
    sql += '\'';
  }
  if (uid !== undefined) {
    sql += ' And a.`pdmemberid` = \'';
    sql += uid.toString();
    sql += '\'';
  }
  const count = await Sequelize.query(sql, { replacements: [storeid, '3', pageCount], type: sequelize.QueryTypes.SELECT });
  sql += ' ORDER BY a.`iid` DESC LIMIT ? OFFSET ?';
  const allInfos = await Sequelize.query(sql, { replacements: [storeid, '3', pageCount, (curPage - 1) * pageCount], type: sequelize.QueryTypes.SELECT });

  const vec = [];
  for (let i = 0; i < allInfos.length; i += 1) {
    const memberid = allInfos[i].uid;
    const mInfo = await models.Member.findOne({
      include: {
        model: models.PDMember,
        as: 'pdmembers',
        attributes: ['uid', 'username', 'sex', 'cellphone', 'birthday'],
      },
      attributes: ['uid', 'from', 'belong', 'createdAt'],
      where: {
        uid: memberid,
      },
    });

    vec.push({
      uid: mInfo.uid,
      username: mInfo.pdmembers.username,
      sex: mInfo.pdmembers.sex,
      coachname: '',
      shipname: mInfo.belong,
      cellphone: mInfo.pdmembers.cellphone,
      from: mInfo.from,
      birthday: mInfo.pdmembers.birthday,
      createdAt: moment(mInfo.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    });
  }

  return {
    count: count.length,
    infoVec: vec,
  };
};

// 耗尽会员
export const depletedMember = async (data, authorization, storeid) => {
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;
  const param = data.param || '';
  console.log(data);

  const mIdvec = [];
  if (param !== '') {
    const searchInfo = await Search.searchData(param, authorization);
    // const searchAllInfo = await Search.searchAllData(searchInfo.search, authorization);
    const hitInfo = searchInfo;
    const mInfo = await models.Member.findAll({
      where: {
        pdmemberid: {
          $in: hitInfo,
        },
        storeid,
      },
    });
    if (mInfo) {
      for (let i = 0; i < mInfo.length; i += 1) {
        mIdvec.push(mInfo[i].uid);
      }
    }
  }
  let sql = 'SELECT SQL_CALC_FOUND_ROWS uid, iid FROM Members WHERE storeid = ? and uid IN (SELECT DISTINCT memberid FROM VipCardMaps AS a, `VipCards` AS b WHERE cardstatus = ? AND a.`vipcardid` = b.`uid` AND b.`cardtype` != ?)';
  if (mIdvec.length !== 0) {
    const memberIdstr = mIdvec.join(',');
    sql += ' and uid in (';
    sql += memberIdstr;
    sql += ')';
  }
  sql += ' Order By iid DESC LIMIT ? OFFSET ?';
  console.log(sql);
  const allMembers = await Sequelize.query(sql, { replacements: [storeid, CardStatus.Depleted, VipCard.VipCardSubType.TimeLimitCard, pageCount, (curPage - 1) * pageCount], type: sequelize.QueryTypes.SELECT });
  const sql1 = 'SELECT FOUND_ROWS() as count';
  const count = await Sequelize.query(sql1, { replacements: [storeid], type: sequelize.QueryTypes.SELECT });
  const infoVec = [];
  for (let i = 0; i < allMembers.length; i += 1) {
    const memberInfo = await models.Member.findOne({
      include: [{
        model: models.PDMember,
        as: 'pdmembers',
        attributes: ['username', 'cellphone', 'birthday'],
      }],
      where: {
        uid: allMembers[i].uid,
      },
    });
    let name = '';
    if (memberInfo.belong !== '') {
      const ecInfo = await Employee.querySingleEmpAndCoach(memberInfo.belong, storeid);
      name = ecInfo.name;
    }
    infoVec.push({
      memberid: memberInfo.uid,
      avatar: memberInfo.avatar,
      username: memberInfo.pdmembers.username,
      cellphone: memberInfo.pdmembers.cellphone,
      from: memberInfo.from,
      birthday: memberInfo.pdmembers.birthday,
      belong: name,
    });
  }

  return {
    count: count[0].count,
    infoVec,
  };
};

// 销卡会员
export const pincardMember = async (data, authorization, storeid) => {
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;
  const param = data.param || '';
  console.log(data);

  const mIdvec = [];
  if (param !== '') {
    const searchInfo = await Search.searchData(param, authorization);
    // const searchAllInfo = await Search.searchAllData(searchInfo.search, authorization);
    const hitInfo = searchInfo;
    const mInfo = await models.Member.findAll({
      where: {
        pdmemberid: {
          $in: hitInfo,
        },
        storeid,
      },
    });
    if (mInfo) {
      for (let i = 0; i < mInfo.length; i += 1) {
        mIdvec.push(mInfo[i].uid);
      }
    }
  }
  let sql = 'SELECT SQL_CALC_FOUND_ROWS uid, iid FROM Members WHERE storeid = ? AND uid IN (SELECT DISTINCT memberid FROM VipCardMaps AS a, `VipCards` AS b WHERE a.`vipcardid` = b.`uid` AND a.`cardstatus` != ?)';
  if (mIdvec.length !== 0) {
    const memberIdstr = mIdvec.join(',');
    sql += ' and uid in (';
    sql += memberIdstr;
    sql += ')';
  }
  sql += ' Order By iid DESC LIMIT ? OFFSET ?';
  console.log(sql);
  const allMembers = await Sequelize.query(sql, { replacements: [storeid, CardStatus.Destruction, pageCount, (curPage - 1) * pageCount], type: sequelize.QueryTypes.SELECT });
  const sql1 = 'SELECT FOUND_ROWS() as count';
  const count = await Sequelize.query(sql1, { replacements: [storeid], type: sequelize.QueryTypes.SELECT });
  const infoVec = [];
  console.log(allMembers.length);
  for (let i = 0; i < allMembers.length; i += 1) {
    const memberInfo = await models.Member.findOne({
      include: [{
        model: models.PDMember,
        as: 'pdmembers',
        attributes: ['username', 'cellphone', 'birthday'],
      }],
      where: {
        uid: allMembers[i].uid,
      },
    });
    let name = '';
    if (memberInfo.belong !== '') {
      const ecInfo = await Employee.querySingleEmpAndCoach(memberInfo.belong, storeid);
      name = ecInfo.name;
    }
    infoVec.push({
      memberid: memberInfo.uid,
      avatar: memberInfo.avatar,
      username: memberInfo.pdmembers.username,
      cellphone: memberInfo.pdmembers.cellphone,
      from: memberInfo.from,
      birthday: memberInfo.pdmembers.birthday,
      belong: name,
    });
  }

  return {
    count: count[0].count,
    infoVec,
  };
};

// 租柜会员
export const cabinetMember = async () => {
  const cabinets = await models.Cabinet.findAll();
  return cabinets;
};

// 请假会员
export const leaveMember = async (data, storeid) => {
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;
  const from = data.from;
  const belong = data.belong;
  const sex = data.sex;
  const uid = data.uid;

  let sql = 'SELECT DISTINCT(a.`uid`), a.`iid` FROM `Members` a\n' +
  'LEFT JOIN `VipCardMaps` b ON a.`uid` = b.`memberid`\n' +
  'WHERE a.`storeid` = ? AND b.`cardstatus` = ?';
  if (from !== undefined) {
    sql += ' And a.`from` = \'';
    sql += from.toString();
    sql += '\'';
  }
  if (belong !== undefined) {
    sql += ' And a.`belong` = \'';
    sql += belong.toString();
    sql += '\'';
  }
  if (sex !== undefined) {
    sql += ' And a.`sex` = \'';
    sql += sex.toString();
    sql += '\'';
  }
  if (uid !== undefined) {
    sql += ' And a.`pdmemberid` = \'';
    sql += uid.toString();
    sql += '\'';
  }
  const count = await Sequelize.query(sql, { replacements: [storeid, 5], type: sequelize.QueryTypes.SELECT });
  sql += ' ORDER BY a.`iid` DESC LIMIT ? OFFSET ?';
  const allInfos = await Sequelize.query(sql, { replacements: [storeid, 5, pageCount, (curPage - 1) * pageCount], type: sequelize.QueryTypes.SELECT });

  const vec = [];
  for (let i = 0; i < allInfos.length; i += 1) {
    const memberid = allInfos[i].uid;
    const mInfo = await models.Member.findOne({
      include: {
        model: models.PDMember,
        as: 'pdmembers',
        attributes: ['uid', 'username', 'sex', 'cellphone', 'birthday'],
      },
      attributes: ['uid', 'from', 'belong', 'createdAt'],
      where: {
        uid: memberid,
      },
    });

    vec.push({
      uid: mInfo.uid,
      username: mInfo.pdmembers.username,
      sex: mInfo.pdmembers.sex,
      cellphone: mInfo.pdmembers.cellphone,
      birthday: mInfo.pdmembers.birthday,
      createdAt: moment(mInfo.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      leavestarttime: mInfo.leavestarttime,
      leaveendtime: mInfo.leaveendtime,
    });
  }

  return {
    count: count.length,
    infoVec: vec,
  };
};

export const nearFutureCard = async (data) => {
  // const param = data.param;
  const type = data.type;
  const subtype = data.subtype;
  const expiretimestart = data.expiretimestart;
  const expiretimeend = data.expiretimeend;
  // const state = data.state;
  // const ascription = data.ascription;
  const info = [];
  const cardids = await models.VipCard.findAll({
    where: {
      cardtype: type,
      cardsubtype: subtype,
    },
  });
  for (let i = 0; i < cardids.length; i += 1) {
    const vipCardMaps = await models.VipCardMap.findAll({
      vipcardid: cardids[i],
      expirytime: {
        $gte: expiretimestart,
        $lte: expiretimeend,
      },
    });
    for (let j = 0; j < vipCardMaps.length; j += 1) {
      info.push(vipCardMaps[j].memberid);
    }
  }
};

export const frequencyCard = async (data) => {
  const param = data.param;
  const type = data.type;
  const subtype = data.subtype;
  const frequencystart = data.frequencystart;
  const frequencyend = data.frequencyend;
  let memberid = 0;
  if (param.length < 11) {
    const info = await models.Member.findAll({
      where: {
        username: param,
      },
    });
    memberid = info.uid;
  } else if (param.length === 11) {
    const info = await models.Member.findAll({
      where: {
        cellphone: param,
      },
    });
    memberid = info.uid;
  }
  let vipcards = [];
  if (typeof memberid !== 'undefined') {
    vipcards = await models.VipCard.findAll({
      where: {
        cardtype: type,
        cardsubtype: subtype,
      },
    });
  } else {
    vipcards = await models.VipCard.findAll({
      where: {
        memberid,
        cardtype: type,
        cardsubtype: subtype,
      },
    });
  }
  const memberids = [];
  const cards = [];
  for (let i = 0; i < vipcards.length; i += 1) {
    cards.push(vipcards[i].uid);
  }
  const vipCardMaps = await models.VipCardMap.findAll({
    where: {
      $in: cards,
    },
  });
  for (let i = 0; i < vipCardMaps.length; i += 1) {
    if (vipCardMaps[i].frequency > frequencystart || frequencyend > vipCardMaps[i].frequency) {
      memberids.push(vipCardMaps[i]);
    }
  }
  return memberids;
};

export const balanceDeplete = async (data) => {
  const param = data.param;
  const type = data.type;
  const subtype = data.subtype;
  const balancestart = data.balancestart;
  const balanceend = data.balancesend;
  let memberid = '';
  if (param.length < 11) {
    const info = await models.Member.findAll({
      where: {
        username: param,
      },
    });
    memberid = info.uid;
  } else if (param.length === 11) {
    const info = await models.Member.findAll({
      where: {
        cellphone: param,
      },
    });
    memberid = info.uid;
  }
  let vipcards = [];
  if (typeof memberid !== 'undefined') {
    vipcards = await models.VipCard.findAll({
      where: {
        cardtype: type,
        cardsubtype: subtype,
      },
    });
  } else {
    vipcards = await models.VipCard.findAll({
      where: {
        memberid,
        cardtype: type,
        cardsubtype: subtype,
      },
    });
  }
  const memberids = [];
  const cards = [];
  for (let i = 0; i < vipcards.length; i += 1) {
    cards.push(vipcards[i].uid);
  }
  const vipCardMaps = await models.VipCardMap.findAll({
    where: {
      $in: cards,
    },
  });
  for (let i = 0; i < vipCardMaps.length; i += 1) {
    if (vipCardMaps[i].balance > balancestart || vipCardMaps[i].balance < balanceend) {
      memberids.push(vipCardMaps[i]);
    }
  }
  return memberids;
};

export const birthdayReminding = async (data) => {
  const param = data.param;
  const type = data.type;
  const subtype = data.subtype;
  const birthday = data.birthday;
  let memberid = '';
  if (param.length < 11) {
    const info = await models.Member.findAll({
      where: {
        username: param,
      },
    });
    memberid = info.uid;
  } else if (param.length === 11) {
    const info = await models.Member.findAll({
      where: {
        cellphone: param,
      },
    });
    memberid = info.uid;
  }
  let vipcards = [];
  if (typeof memberid !== 'undefined') {
    vipcards = await models.VipCard.findAll({
      where: {
        cardtype: type,
        cardsubtype: subtype,
      },
    });
  } else {
    vipcards = await models.VipCard.findAll({
      where: {
        memberid,
        cardtype: type,
        cardsubtype: subtype,
      },
    });
  }
  const memberids = [];
  const cards = [];
  for (let i = 0; i < vipcards.length; i += 1) {
    cards.push(vipcards[i].uid);
  }
  const vipCardMaps = await models.VipCardMap.findAll({
    where: {
      $in: cards,
    },
  });
  for (let i = 0; i < vipCardMaps.length; i += 1) {
    if (parseInt(Math.abs(birthday - vipCardMaps[i].birthday) / 1000 / 60 / 60 / 24, 10) === 7) {
      memberids.push(vipCardMaps[i]);
    }
  }
  return memberids;
};

export const getCardCountByDay = async (storeid) => {
  const dayStart = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
  const dayEnd = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');

  const cardCount = await models.VipCardMap.count({
    include: {
      model: models.Member,
      as: 'members',
      where: {
        storeid,
      },
    },
    where: {
      createdAt: {
        gte: dayStart,
        lte: dayEnd,
      },
    },
  });

  return cardCount;
};

export const getCardCountByMonth = async (storeid) => {
  const monthStart = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
  const monthEnd = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');

  const cardCount = await models.VipCardMap.count({
    include: {
      model: models.Member,
      as: 'members',
      where: {
        storeid,
      },
    },
    where: {
      createdAt: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
  });

  return cardCount;
};

export const getCourseCountByDay = async (storeid) => {
  const dayStart = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
  const dayEnd = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');

  const cardCount = await models.PrivateMap.count({
    include: {
      model: models.Member,
      as: 'members',
      where: {
        storeid,
      },
    },
    where: {
      createdAt: {
        gte: dayStart,
        lte: dayEnd,
      },
    },
  });

  return cardCount;
};

export const getCourseCountByMonth = async (storeid) => {
  const monthStart = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
  const monthEnd = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');

  const cardCount = await models.PrivateMap.count({
    include: {
      model: models.Member,
      as: 'members',
      where: {
        storeid,
      },
    },
    where: {
      createdAt: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
  });

  return cardCount;
};
