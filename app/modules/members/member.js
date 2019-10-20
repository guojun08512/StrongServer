import models from 'modules/db/models';
import ERROR, { $required, createOrderNum, converSqlToJson } from 'modules/utils';
import moment from 'moment';
import sequelize from 'sequelize';
import Sequelize from 'modules/db/sequelize';
import * as VipCard from 'modules/vipcard';

const logger = require('modules/logger').default;

// 押金状态
export const DState = {
  NotUse: 1, // 未使用
  Use: 2, // 已抵扣
  ReFund: 3, // 已退款
};

// 定金状态
export const EState = {
  NotUse: 1, // 未使用
  ReFund: 2, // 已退款
};

// 姓名正则
const nameReg = /^[a-zA-Z\u4e00-\u9fa5]{2,16}$/;
// 手机号正则
const phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;

export const registerMember = async (data, storeid) => {
  logger.debug(`member::registerMember data : ${JSON.stringify(data)}`);
  $required('storeid', storeid);
  $required('username', data.username);
  $required('cellphone', data.cellphone);
  const username = data.username; // 姓名
  const sex = data.sex || 1; // 性别
  const cellphone = data.cellphone; // 电话
  const idcard = data.idcard || ''; // 身份证号码
  let birthday = '';
  if (data.birthday !== '') {
    birthday = moment(data.birthday).format('YYYY-MM-DD'); // 生日
  }
  const from = data.from || ''; // 获客来源
  const belong = data.belong || ''; // 会籍归属
  const tags = data.tags === undefined ? '' : data.tags.join(','); // 用户标签
  const city = data.city || ''; // 所在城市
  const remark = data.remark || ''; // 备注

  if (!nameReg.test(username)) {
    return ERROR.nameInvalid(' 长度限制');
  }

  if (!phoneReg.test(cellphone)) {
    return ERROR.phoneInvalid();
  }

  const ret = await Sequelize.transaction(t => models.PDMember.findOrCreate({
    where: {
      cellphone,
    },
    defaults: {
      username,
      cellphone,
      sex,
      idcard,
      birthday,
      city,
    },
    transaction: t,
  }).then(([pdmInfo]) => {
    if (!pdmInfo) throw new Error();
    const pdmemberid = pdmInfo.dataValues.uid;
    return models.Member.findOrCreate({
      where: {
        storeid,
        pdmemberid,
      },
      defaults: {
        from,
        belong,
        tags,
        remark,
        storeid,
        pdmemberid,
      },
      transaction: t,
    }).then(([mInfo]) => {
      if (!mInfo) throw new Error();
      const memberid = mInfo.dataValues.uid;
      return models.Shower.create({
        memberid,
        singledate: 5,
        totaldate: 0,
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

  return ret;
};

export const updateMember = async (data) => {
  logger.debug(`member::updateMember data : ${JSON.stringify(data)}`);
  $required('memberid', data.memberid);
  const memberid = data.memberid; // 会员id
  const newData = { ...data };
  console.log(newData);
  if (newData.birthday !== '') {
    newData.birthday = moment(newData.birthday).format('YYYY-MM-DD');
  }
  if (newData.tags !== '') {
    newData.tags = data.tags.join(',');
  }
  const cellphone = newData.cellphone;

  const mInfo = await models.Member.findOne({
    include: {
      model: models.PDMember,
      as: 'pdmembers',
      attributes: ['uid', 'cellphone'],
    },
    where: {
      uid: memberid,
    },
  });
  if (!mInfo) {
    return false;
  }
  if (cellphone !== mInfo.pdmembers.cellphone) {
    const pdmInfo = await models.PDMember.findOne({
      where: {
        cellphone,
      },
    });
    if (pdmInfo) {
      // 电话被占用
      return ERROR.UpdatePhoneError();
    }
  }
  // 电话未被占用
  const pdmInfo1 = await models.PDMember.findOne({
    where: {
      uid: mInfo.pdmemberid,
    },
  });
  if (!pdmInfo1) {
    return false;
  }

  const ret = await Sequelize.transaction(t => pdmInfo1.update({
    ...newData,
  }, {
    transaction: t,
  }).then((result) => {
    if (!result) throw new Error();
    return mInfo.update({
      ...newData,
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

export const deleteMember = async (data) => {
  logger.debug(`member::deleteMember data : ${JSON.stringify(data)}`);
  $required('uids', data.uids);
  const uids = data.uids;

  for (let i = 0; i < uids.length; i += 1) {
    const ret = await models.Member.update({
      deleted: 1,
    }, {
      where: {
        uid: uids[i],
      },
    });

    if (!ret) {
      return false;
    }
  }

  return true;
};

export const updateAvater = async (data) => {
  logger.debug(`member::updateAvater data : ${JSON.stringify(data)}`);
  $required('memberid', data.memberid);
  const memberid = data.memberid; // 会员id
  const avatar = data.avatar; // 头像
  console.log(data);

  const info = await models.Member.findOne({
    where: {
      uid: memberid,
    },
  });

  const res = await info.update({
    avatar,
  });

  if (!res) {
    return false;
  }

  return true;
};

export const queryMemberInfo = async (memberID) => {
  logger.debug(`member::queryMemberInfo data : ${memberID}`);
  $required('memberid', memberID);
  const info = await models.Member.findOne({
    include: [{
      model: models.PDMember,
      as: 'pdmembers',
      attributes: ['username', 'cellphone', 'sex', 'idcard', 'birthday'],
    }],
    where: {
      uid: memberID,
    },
  });

  if (!info) {
    return {};
  }

  const sInfo = await models.Shower.findOne({
    where: {
      memberid: memberID,
    },
  });

  return {
    uid: info.uid,
    from: info.from,
    tags: info.tags,
    belong: info.belong,
    RFID: info.RFID,
    scords: info.scords,
    avatar: info.avatar,
    integral: info.integral,
    remark: info.remark,
    username: info.pdmembers.username,
    cellphone: info.pdmembers.cellphone,
    sex: info.pdmembers.sex,
    idcard: info.pdmembers.idcard,
    birthday: info.pdmembers.birthday,
    water: sInfo.totaldate,
    createdAt: moment(info.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment(info.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
  };
};

export const insertDeposit = async (data) => {
  logger.debug(`member::insertDeposit data : ${JSON.stringify(data)}`);
  $required('memberid', data.memberid);
  $required('use', data.use);
  $required('cost', data.cost);
  const memberid = data.memberid; // 会员id
  const use = data.use; // 用途
  const cost = data.cost; // 押金金额
  const payment = data.payment || 0; // 付款方式
  const payee = data.payee || 0; // 收款人
  const remark = data.remark || ''; // 备注
  const status = data.status || DState.NotUse; // 状态
  const chargetime = moment().format('YYYY-MM-DD HH:mm:ss');

  // 判断是否有会员
  const memberInfo = await models.Member.findOne({
    where: {
      uid: memberid,
    },
  });

  if (!memberInfo) {
    return Error.MemberExist();
  }

  const res = await models.Deposit.create({
    memberid, use, cost, payment, remark, status, chargetime, payee,
  });

  if (!res) {
    return false;
  }

  return true;
};

export const InsertEarnest = async (data) => {
  logger.debug(`member::InsertEarnest data : ${JSON.stringify(data)}`);
  $required('memberid', data.memberid);
  $required('cost', data.cost);
  const memberid = data.memberid; // 会员id
  const cost = data.cost; // 定金金额
  const payment = data.payment || 0; // 付款方式
  const payee = data.payee || 0; // 收款人
  const remark = data.remark || ''; // 备注
  const status = data.status || EState.NotUse; // 状态
  const chargetime = moment().format('YYYY-MM-DD HH:mm:ss');

  // 判断是否有会员
  const memberInfo = await models.Member.findOne({
    where: {
      uid: memberid,
    },
  });

  if (!memberInfo) {
    return Error.MemberExist();
  }

  const res = await models.Earnest.create({
    memberid, cost, payment, payee, remark, status, chargetime,
  });

  if (!res) {
    return false;
  }

  return true;
};

export const queryDeposit = async (data) => {
  logger.debug(`member::queryDeposit data : ${JSON.stringify(data)}`);
  $required('memberid', data.memberid);
  const memberid = data.memberid; // 会员id
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;

  const where = {};
  where.memberid = memberid;
  const count = await models.Deposit.count({
    where,
  });
  const allInfos = converSqlToJson(await models.Deposit.findAll({
    where,
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
    attributes: ['uid', 'use', 'chargetime', 'cost', 'payment', 'remark', 'status', 'createdAt'],
    order: [['iid', 'DESC']],
    logging: console.log,
  }));

  return {
    count,
    allInfos: allInfos.map(info => ({ ...info, chargetime: moment(info.chargetime).format('YYYY-MM-DD HH:mm:ss'), returntime: moment(info.returntime).format('YYYY-MM-DD HH:mm:ss') })),
  };
};

export const queryEarnest = async (data) => {
  logger.debug(`member::queryEarnest data : ${JSON.stringify(data)}`);
  $required('memberid', data.memberid);
  const memberid = data.memberid; // 会员id
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;

  const where = {};
  where.memberid = memberid;
  const count = await models.Earnest.count({
    where,
  });
  const allInfos = converSqlToJson(await models.Earnest.findAll({
    where,
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
    attributes: ['uid', 'chargetime', 'cost', 'payment', 'remark', 'status', 'createdAt'],
    order: [['iid', 'DESC']],
    logging: console.log,
  }));

  return {
    count,
    allInfos: allInfos.map(info => ({ ...info, chargetime: moment(info.chargetime).format('YYYY-MM-DD HH:mm:ss'), returntime: moment(info.returntime).format('YYYY-MM-DD HH:mm:ss') })),
  };
};

export const deleteDeposit = async (data) => {
  logger.debug(`member::deleteDeposit data : ${JSON.stringify(data)}`);
  $required('uids', data.uids);
  $required('returntype', data.returntype);
  const uids = data.uids; // 押金表uid
  const returntype = data.returntype; // 退款方式

  const res = await models.Deposit.update({
    status: EState.ReFund,
    returntype,
    returntime: moment().format('YYYY-MM-DD HH:mm:ss'),
  }, {
    where: {
      uid: {
        $in: uids,
      },
    },
  });

  return res;
};

export const deleteEarnest = async (data) => {
  logger.debug(`member::deleteEarnest data : ${JSON.stringify(data)}`);
  $required('uids', data.uids);
  const uids = data.uids; // 定金表uid
  const returntype = data.returntype; // 退款方式

  const res = await models.Earnest.update({
    status: DState.ReFund,
    returntype,
    returntime: moment().format('YYYY-MM-DD HH:mm:ss'),
  }, {
    where: {
      uid: {
        $in: uids,
      },
    },
  });

  return res;
};

export const getAllDeposits = async (data, storeid) => {
  logger.debug(`member::getAllDeposits data : ${JSON.stringify(data)}`);
  $required('storeid', storeid);
  const payee = data.payee; // 收款人
  const pdmemberid = data.memberid; // 会员id
  const stime = data.stime || moment().format('YYYY-MM-DD 00:00:00'); // 开始时间
  const etime = data.etime || moment().format('YYYY-MM-DD 23:59:59'); // 结束时间
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;

  const where = {};
  if (pdmemberid !== '') {
    where.uid = pdmemberid;
  }
  const where1 = {};
  where1.createdAt = {
    gte: moment(stime).format('YYYY-MM-DD HH:mm:ss'),
    lte: moment(etime).format('YYYY-MM-DD HH:mm:ss'),
  };
  if (payee !== '') {
    where1.payee = payee;
  }
  const include = [{
    include: [{
      model: models.PDMember,
      as: 'pdmembers',
      attributes: ['uid', 'cellphone', 'username'],
      where,
    }],
    model: models.Member,
    as: 'members',
    where: {
      storeid,
    },
  }];
  const count = await models.Deposit.count({
    include,
    where: where1,
  });
  const allInfos = converSqlToJson(await models.Deposit.findAll({
    include,
    where: where1,
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
    order: [['iid', 'DESC']],
  }));

  return {
    count,
    allInfos: allInfos.map(info => ({ ...info, chargetime: moment(info.chargetime).format('YYYY-MM-DD HH:mm:ss'), returntime: moment(info.returntime).format('YYYY-MM-DD HH:mm:ss') })),
  };
};

export const getAllEarnests = async (data, storeid) => {
  logger.debug(`member::getAllEarnests data : ${JSON.stringify(data)}`);
  $required('storeid', storeid);
  const payee = data.payee; // 收款人
  const pdmemberid = data.memberid; // 会员id
  const stime = data.stime || moment().format('YYYY-MM-DD 00:00:00'); // 开始时间
  const etime = data.etime || moment().format('YYYY-MM-DD 23:59:59'); // 结束时间
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;
  const where = {};
  if (pdmemberid !== '') {
    where.uid = pdmemberid;
  }
  const where1 = {};
  where1.createdAt = {
    gte: moment(stime).format('YYYY-MM-DD HH:mm:ss'),
    lte: moment(etime).format('YYYY-MM-DD HH:mm:ss'),
  };
  if (payee !== '') {
    where1.payee = payee;
  }
  const include = [{
    include: [{
      model: models.PDMember,
      as: 'pdmembers',
      attributes: ['uid', 'cellphone', 'username'],
      where,
    }],
    model: models.Member,
    as: 'members',
    where: {
      storeid,
    },
  }];
  const count = await models.Earnest.count({
    include,
    where: where1,
  });
  const allInfos = converSqlToJson(await models.Earnest.findAll({
    include,
    where: where1,
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
    order: [['iid', 'DESC']],
  }));
  return {
    count,
    allInfos: allInfos.map(info => ({ ...info, chargetime: moment(info.chargetime).format('YYYY-MM-DD HH:mm:ss'), returntime: moment(info.returntime).format('YYYY-MM-DD HH:mm:ss') })),
  };
};

export const insertCabinets = async (data) => {
  logger.debug(`member::insertCabinets data : ${JSON.stringify(data)}`);
  $required('memberid', data.memberid);
  $required('number', data.number);
  $required('cost', data.cost);
  const memberid = data.memberid; // 会员id
  const type = data.type || 0; // 租柜类型
  const number = data.number; // 租柜编号
  const deadlinetime = data.deadlinetime || moment('9999-12-31 00:00:00').format('YYYY-MM-DD HH:mm:ss'); // 截至时间
  const cost = data.cost; // 费用
  const deposit = data.deposit || ''; // 押金
  const payment = data.payment || ''; // 付款方式
  const payee = data.payee || ''; // 收款人
  const remark = data.remark || ''; // 描述

  const res = await models.Cabinet.create({
    memberid, type, number, deadlinetime, cost, deposit, payment, payee, remark,
  });

  if (!res) {
    return false;
  }

  return true;
};

export const queryCabinets = async (data) => {
  logger.debug(`member::queryCabinets data : ${JSON.stringify(data)}`);
  $required('memberid', data.memberid);
  const memberid = data.memberid; // 会员id

  const res = await models.Cabinet.findOne({
    where: {
      memberid,
    },
  });

  return res;
};

export const deleteCabinets = async (data) => {
  logger.debug(`member::deleteCabinets data : ${JSON.stringify(data)}`);
  $required('uid', data.uid);
  const uid = data.uid; // 租柜id

  const res = await models.Cabinet.update({
    where: {
      uid,
    },
    deleted: true,
  });

  if (!res) {
    return false;
  }

  return true;
};

export const updateRfid = async (data, storeid) => {
  logger.debug(`member::updateRfid data : ${JSON.stringify(data)}`);
  $required('memberid', data.memberid);
  $required('RFID', data.RFID);
  const memberid = data.memberid; // 会员id
  const RFID = data.RFID; // rfid

  const ret = await models.Member.update({
    RFID,
  }, {
    where: {
      uid: memberid,
      storeid,
    },
  });

  return ret;
};

export const updateNotifyMsg = async (data) => {
  logger.debug(`member::updateNotifyMsg data : ${JSON.stringify(data)}`);
  $required('memberid', data.memberid);
  const memberid = data.memberid; // 会员id
  const notifymsg = data.notifymsg; // 通知消息

  const res = await models.NotifyMsg.findOrCreate({
    where: {
      memberid,
    },
    defaults: { notifymsg },
  });

  if (!res) {
    return false;
  }

  return true;
};

export const updateIntegral = async (data) => {
  logger.debug(`member::updateIntegral data : ${JSON.stringify(data)}`);
  const memberid = data.memberid; // 会员id
  const arrange = data.arrange; // 调整方式
  const integration = data.integration; // 调整积分

  // 查询当前积分
  const memberInfo = await models.Member.findOne({
    where: {
      uid: memberid,
    },
  });
  if (memberInfo === null) {
    return false;
  }

  let tempIntegration = '';
  const member = memberInfo.dataValues;
  if (member.integral === '') {
    tempIntegration = '0';
  } else {
    tempIntegration = member.integral;
  }
  // 查看调整方式
  if (arrange === '1') {
    tempIntegration = (parseInt(tempIntegration, 10) + parseInt(integration, 10)).toString();
  } else {
    tempIntegration = (parseInt(tempIntegration, 10) - parseInt(integration, 10)).toString();
  }
  if (tempIntegration < 0) {
    tempIntegration = 0;
  }

  const resMember = await models.Member.update({
    where: {
      uid: memberid,
    },
    integral: tempIntegration,
  });

  if (!resMember) {
    return false;
  }

  // 加入积分日志
  const resIntegral = await models.Integral.create({
    memberid, arrange, integration,
  });

  if (!resIntegral) {
    return false;
  }

  return true;
};

export const getAllMembers = async (data, storeid) => {
  logger.debug(`member::getAllMembers data : ${JSON.stringify(data)}`);
  $required('storeid', storeid);
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;
  const pdmemberid = data.uid; // 姓名/电话/实体卡号
  const from = data.from; // 来源信息
  const belong = data.belong; // 会籍归属
  const sex = data.sex; // 性别

  const where = {};
  let include = {};
  if (from !== '') {
    where.from = from;
  }
  if (belong !== '') {
    where.belong = belong;
  }

  if (pdmemberid !== '') {
    where.pdmemberid = pdmemberid;
  }
  where.storeid = storeid;

  include = {
    model: models.PDMember,
    as: 'pdmembers',
    attributes: ['username', 'cellphone', 'sex', 'idcard', 'birthday'],
  };
  const count = await models.Member.count({
    include,
    where,
  });
  const allMembers = converSqlToJson(await models.Member.findAll({
    include,
    where,
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
    order: [['iid', 'DESC']],
    logging: console.log,
  }));
  return {
    count,
    allMembers: allMembers.map(info => ({
      uid: info.uid,
      username: info.pdmembers.username,
      cellphone: info.pdmembers.cellphone,
      sex: info.pdmembers.sex,
      idcard: info.pdmembers.idcard,
      birthday: info.pdmembers.birthday,
      from: info.from,
      tags: info.tags,
      belong: info.belong,
      RFID: info.RFID,
      scords: info.scords,
      avatar: info.avatar,
      integral: info.integral,
      remark: info.remark,
      createdAt: moment(info.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment(info.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
    })),
  };
};

export const getMemberByID = async (memberID) => {
  const memberInfo = await models.Member.findOne({
    include: [{
      model: models.PDMember,
      as: 'pdmembers',
      attributes: ['username', 'cellphone', 'sex', 'idcard', 'birthday'],
    }],
    where: {
      uid: memberID,
    },
  });
  return {
    memberInfo: {
      uid: memberInfo.uid,
      username: memberInfo.pdmembers.username,
      cellphone: memberInfo.pdmembers.cellphone,
      sex: memberInfo.pdmembers.sex,
      idcard: memberInfo.pdmembers.idcard,
      birthday: memberInfo.pdmembers.birthday,
      from: memberInfo.from,
      tags: memberInfo.tags,
      belong: memberInfo.belong,
      RFID: memberInfo.RFID,
      scords: memberInfo.scords,
      avatar: memberInfo.avatar,
      integral: memberInfo.integral,
      remark: memberInfo.remark,
      createdAt: moment(memberInfo.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment(memberInfo.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
    },
  };
};

export const trainingfrequency = async (data) => {
  logger.debug(`member::trainingfrequency data : ${JSON.stringify(data)}`);
  const memberid = data.memberid; // 会员id

  const nowdate = Date.now();
  const monthDate = nowdate - (30 * 24 * 3600 * 1000);

  const dateInfo = await models.Signin.findAll({
    where: {
      memberid,
      dateofsignin: {
        $gte: nowdate,
        $lte: monthDate,
      },
    },
  });

  let time = 0;
  let num = 0;
  for (let i = 0; i < dateInfo.length; i += 1) {
    if (time === 0) {
      num += 1;
    } else {
      const m = time.getMonth();
      const d = time.getDate();
      const m1 = dateInfo[i].getMonth();
      const d1 = dateInfo[i].getDate();
      if (m !== m1 && d !== d1) {
        time = dateInfo[i].dateofsignin;
        num += 1;
      }
    }
  }

  return num;
};

export const longTrainingTime = async () => {
  // 根据仪器
};

export const fitnessCalendar = async (data) => {
  logger.debug(`member::fitnessCalendar data : ${JSON.stringify(data)}`);
  const memberid = data.memberid; // 会员id

  const nowdate = Date.now();
  const startDate = nowdate - (32 * 24 * 3600 * 1000);
  const endDate = nowdate + (32 * 24 * 3600 * 1000);

  const dateInfo = await models.Signin.findAll({
    where: {
      memberid,
      dateofsignin: {
        $gt: startDate,
        $lte: endDate,
      },
    },
  });

  const dates = [];
  const m = nowdate.getMonth() + 1;
  for (let i = 0; i < dateInfo.length; i += 1) {
    const m1 = dateInfo[i].dateofsignin.getMonth() + 1;
    const d1 = dateInfo[i].dateofsignin.getDate();
    if (m === m1) {
      dates.push(d1);
    }
  }

  return dates;
};

export const birthdayReminder = async (storeid) => {
  const monthStart = moment().startOf('month').format('YYYY-MM-DD');
  const monthEnd = moment().endOf('month').format('YYYY-MM-DD');

  const count = await models.Member.count({
    include: [{
      model: models.PDMember,
      as: 'pdmembers',
      attributes: ['uid'],
      where: {
        birthday: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    }],
    where: {
      storeid,
    },
  });

  return count;
};

export const shipReminder = async (storeid) => {
  const ctime = moment().format('YYYY-MM-DD HH:mm:ss');

  const sql = 'SELECT COUNT(DISTINCT(a.`memberid`)) AS total FROM `VipCardMaps` a, `VipCards` b, `Members` c WHERE a.`vipcardid` = b.`uid` AND a.`memberid` = c.`uid` AND ? > DATE_SUB(a.`expirytime`,INTERVAL 30 DAY) AND b.`cardsubtype` = ? AND c.`storeid` = ?';
  const ret = await Sequelize.query(sql, { replacements: [ctime, VipCard.VipCardSubType.TimeLimitCard, storeid], type: sequelize.QueryTypes.SELECT });

  return ret[0].total;
};

export const classReminder = async (storeid) => {
  const sql = 'SELECT COUNT(DISTINCT(a.`memberid`)) AS total FROM `PrivateMaps` a, `Members` b WHERE a.`memberid` = b.`uid` AND a.`curbuy` >= 0 AND a.`curbuy` <= 5 AND b.`storeid` = ?';
  const ret = await Sequelize.query(sql, { replacements: [storeid], type: sequelize.QueryTypes.SELECT });

  return ret[0].total;
};

export const lazyReminder = async (storeid) => {
  const startDate = moment().subtract(30, 'days').format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const sql = 'SELECT COUNT(DISTINCT(a.`memberid`)) AS total FROM `VipCardMaps` a, `Members` b WHERE a.`memberid` = b.`uid` AND a.`uid` IN (SELECT vipcardmapid FROM `MSignins` WHERE createdAt >= ? AND createdAt <= ? GROUP BY vipcardmapid HAVING COUNT(vipcardmapid) < 5) AND b.`storeid` = ?;';
  const ret = await Sequelize.query(sql, { replacements: [startDate, endDate, storeid], type: sequelize.QueryTypes.SELECT });

  return ret[0].total;
};

// 会员拥有的会员卡列表
export const queryMemberVipCard = async (data) => {
  logger.debug(`member::queryMemberVipCard data : ${JSON.stringify(data)}`);
  $required('memberid', data.memberid);
  const memberid = data.memberid;
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;

  const sql = 'SELECT `VipCardMap`.`uid` FROM `VipCardMaps` AS `VipCardMap`\n' +
  'INNER JOIN `Members` AS `members` ON `VipCardMap`.`memberid` = `members`.`uid` AND `members`.`uid` = ? AND `members`.`deleted` = FALSE\n' +
  'INNER JOIN `VipCards` AS `vipcards` ON `VipCardMap`.`vipcardid` = `vipcards`.`uid` AND `vipcards`.`deleted` = FALSE\n' +
  'INNER JOIN `VipCardMapLogs` AS `vipcardmaplogs` ON `VipCardMap`.`uid` = `vipcardmaplogs`.`vipcardmapid` AND `vipcardmaplogs`.`deleted` = FALSE\n' +
  'WHERE `VipCardMap`.`deleted` = FALSE GROUP BY `VipCardMap`.`uid`';
  const count = await Sequelize.query(sql, { replacements: [memberid, pageCount, (curPage - 1) * pageCount], type: sequelize.QueryTypes.SELECT });
  const include = [{
    model: models.Member,
    as: 'members',
    attributes: ['uid'],
    where: {
      uid: memberid,
    },
  }, {
    model: models.VipCard,
    as: 'vipcards',
    attributes: ['uid', 'cardsubtype', 'cardname'],
  }, {
    model: models.VipCardMapLog,
    as: 'vipcardmaplogs',
    attributes: ['uid', 'operation'],
  }];
  // const count = await models.VipCardMap.count({
  //   include,
  //   group: 'uid',
  // });
  const allInfos = converSqlToJson(await models.VipCardMap.findAll({
    include,
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
    order: [['iid', 'DESC']],
    attributes: ['uid', 'iid', 'totalbuy', 'curbuy', 'opencardtime', 'expirytime', 'cardstatus', 'remark', 'entitycardid'],
  }));

  return {
    count: count.length,
    allInfos: allInfos.map(info => ({
      entitycardid: info.entitycardid,
      cardsubtype: info.vipcards.cardsubtype,
      cardname: info.vipcards.cardname,
      vipcardmapid: info.uid,
      totalbuy: info.totalbuy,
      curbuy: info.curbuy,
      validity: moment(info.expirytime).diff(moment(), 'days') >= 0 ? moment(info.expirytime).diff(moment(), 'days') : 0,
      cardstatus: info.cardstatus,
      remark: info.remark,
      operation: info.vipcardmaplogs.operation,
      opencardtime: moment(info.opencardtime).format('YYYY-MM-DD HH:mm:ss'),
      expirytime: moment(info.expirytime).format('YYYY-MM-DD HH:mm:ss'),
    })),
  };
};

// 会员拥有的私教课列表
export const queryMemberPrivate = async (data, storeid) => {
  logger.debug(`member::queryMemberPrivate data : ${JSON.stringify(data)}`);
  $required('memberid', data.memberid);
  const memberid = data.memberid;
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;

  const include = [{
    model: models.Member,
    as: 'members',
    attributes: ['uid'],
    where: {
      storeid,
      pdmemberid: memberid,
    },
  }, {
    model: models.Private,
    as: 'privates',
    attributes: ['uid', 'privatename'],
  }];
  const count = await models.PrivateMap.count({
    include,
  });
  const allInfos = converSqlToJson(await models.PrivateMap.findAll({
    include,
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
    order: [['iid', 'DESC']],
  }));

  return {
    count,
    allInfos: allInfos.map(info => ({
      ...info,
      opencardtime: moment(info.opencardtime).format('YYYY-MM-DD HH:mm:ss'),
      expirytime: moment(info.expirytime).format('YYYY-MM-DD HH:mm:ss'),
    })),
  };
};

// 合同订单
export const queryOrderList = async (data) => {
  logger.debug(`member::queryOrderList data : ${JSON.stringify(data)}`);
  $required('memberid', data.memberid);
  const memberid = data.memberid;
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;

  let sql = 'SELECT SQL_CALC_FOUND_ROWS(a.`uid`), a.`iid` FROM `Orders` a\n' +
  'LEFT JOIN `VipCardMapLogs` b ON a.`vcmlid` = b.`uid`\n' +
  'LEFT JOIN `PrivateMapLogs` c ON a.`pmlid` = c.`uid`\n' +
  'LEFT JOIN `Members` d ON b.`memberid` = d.`uid`\n' +
  'WHERE d.`uid` = ?';
  sql += ' ORDER BY iid DESC LIMIT ? OFFSET ?';
  const allInfos = await Sequelize.query(sql, { replacements: [memberid, pageCount, (curPage - 1) * pageCount], type: sequelize.QueryTypes.SELECT });
  const sql1 = 'SELECT FOUND_ROWS() as num';
  const ret = await Sequelize.query(sql1, { type: sequelize.QueryTypes.SELECT });
  const vec = [];
  for (let i = 0; i < allInfos.length; i += 1) {
    const oInfo = await models.Order.findOne({
      where: {
        uid: allInfos[i].uid,
      },
    });
    vec.push({
      ordernumber: oInfo.ordernumber,
      updatedAt: moment(oInfo.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
      price: oInfo.money,
      payment: oInfo.payment,
      remark: oInfo.remark,
      ascription: oInfo.ascription,
    });
  }
  return {
    count: ret[0].num,
    allInfos: vec,
  };
};

// 训练记录
export const querySigninList = async (data) => {
  logger.debug(`member::querySigninList data : ${JSON.stringify(data)}`);
  $required('memberid', data.memberid);
  const memberid = data.memberid;
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;

  const include = {
    model: models.VipCardMap,
    as: 'vipcardmaps',
    attributes: ['uid', 'operation'],
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
  };
  const count = await models.MSignin.count({
    include,
  });
  const allInfos = converSqlToJson(await models.MSignin.findAll({
    include,
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
    order: [['iid', 'DESC']],
  }));

  return {
    count,
    allInfos: allInfos.map(info => ({
      uid: info.uid,
      signdate: info.signdate,
      cardname: info.vipcardmaps.vipcards.cardname,
      number: info.number,
      signin: info.signin,
      handcardid: info.handcardid,
      returntime: info.returntime,
      status: info.status,
    })),
  };
};

// 跟进记录
export const queryFollowList = async (data) => {
  logger.debug(`member::queryFollowList data : ${JSON.stringify(data)}`);
  $required('memberid', data.memberid);
  const memberid = data.memberid;
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;

  const include = {
    model: models.Member,
    as: 'members',
    attributes: ['uid'],
    where: {
      uid: memberid,
    },
  };
  const count = await models.Follow.count({
    include,
  });
  const allInfos = converSqlToJson(await models.Follow.findAll({
    include,
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
    order: [['iid', 'DESC']],
  }));

  return {
    count,
    allInfos: allInfos.map(info => ({
      ...info,
      createdAt: moment(info.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment(info.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
    })),
  };
};

// 增加水费
export const addWaterRate = async (data) => {
  logger.debug(`member::addWaterRate data : ${JSON.stringify(data)}`);
  $required('memberid', data.memberid);
  const memberid = data.memberid;
  const water = parseInt(data.water || 0, 10);
  const price = data.price || 0.00;
  const payment = data.payment || 1;

  const rs = await models.Shower.findOne({
    where: {
      memberid,
    },
  });
  if (!rs) {
    return false;
  }

  const itemWater = rs.totaldate;
  const ret = await Sequelize.transaction(t => models.Shower.update({
    totaldate: water + itemWater,
  }, {
    transaction: t,
  }).then((sInfo) => {
    if (!sInfo) throw new Error();
    return models.Order.create({
      wlid: sInfo.uid,
      ordernumber: createOrderNum(1),
      type: VipCard.CardType.water,
      contractamount: price,
      method: 1,
      payment,
      status: 2,
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
