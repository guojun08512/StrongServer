import models from 'modules/db/models';
import moment from 'moment';
import { $required, converSqlToJson } from 'modules/utils';
import sequelize from 'sequelize';
import Sequelize from 'modules/db/sequelize';
import * as VipCard from 'modules/vipcard';
import * as BuyVipCard from 'modules/buyvipcard';

export const memberConfirm = async (data, storeid) => {
  $required('uid', data.uid);
  const uid = data.uid; // 姓名/电话/实体卡号

  // 人物信息
  const memberInfo = await models.Member.findOne({
    include: [{
      model: models.PDMember,
      as: 'pdmembers',
      attributes: ['username', 'cellphone', 'sex', 'idcard', 'birthday'],
      where: {
        uid,
      },
    }],
    where: {
      storeid,
    },
    attributes: ['uid', 'remark'],
  });
  if (!memberInfo) {
    return false;
  }

  const birthday = memberInfo.pdmembers.birthday;
  let age = 0;
  if (birthday !== '') {
    age = moment().diff(moment(birthday).format('YYYY-MM-DD'), 'year');
  }

  // 拥有会员卡信息
  const vipCardMapInfo = await models.VipCardMap.findAll({
    where: {
      memberid: memberInfo.uid,
    },
  });

  const vipcardInfoVec = [];
  for (let i = 0; i < vipCardMapInfo.length; i += 1) {
    const vipcardid = vipCardMapInfo[i].vipcardid;
    const vipCardInfo = await models.VipCard.findOne({
      where: {
        uid: vipcardid,
      },
    });

    const status = vipCardMapInfo[i].cardstatus;
    if (status === BuyVipCard.CardStatus.Normal) {
      let surplus = 0;
      if (vipCardInfo.cardsubtype === VipCard.VipCardSubType.TimeLimitCard) {
        surplus = moment(vipCardMapInfo[i].expirytime).diff(moment().format('YYYY-MM-DD'), 'days');
      } else {
        surplus = vipCardMapInfo[i].curbuy;
      }

      const vipCardInfoJson = {
        vipcardmapid: vipCardMapInfo[i].uid,
        vipcardname: vipCardInfo.cardname,
        subtype: vipCardInfo.cardsubtype,
        surplus,
        expirytime: vipCardMapInfo[i].expirytime,
        cardstatus: vipCardMapInfo[i].cardstatus,
        singCard: false,
      };

      vipcardInfoVec.push(vipCardInfoJson);
    }
  }

  // 返回数据组合
  const json = {
    memberid: memberInfo.uid,
    name: memberInfo.pdmembers.username,
    age,
    sex: memberInfo.pdmembers.sex,
    ascription: '',
    cellphone: memberInfo.pdmembers.cellphone,
    birthday,
    remark: memberInfo.remark,
    vJsonVec: vipcardInfoVec,
  };

  return json;
};

export const memberSignin = async (data) => {
  $required('vipcardmapid', data.vipcardmapid);
  $required('number', data.number);
  $required('signin', data.signin);
  $required('handcardid', data.handcardid);
  const vipcardmapid = data.vipcardmapid; // 会员卡mapid
  const number = data.number; // 签到人数
  const signin = data.signin; // 签到方式
  // const handcardid = data.handcardid; // 手牌号
  const status = data.status || 1; // 状态

  // const tempHandCardIds = handcardid.join(',');

  const vcmInfo = await models.VipCardMap.findOne({
    include: [{
      model: models.VipCard,
      as: 'vipcards',
      attributes: ['cardsubtype'],
    }],
    where: {
      uid: vipcardmapid,
    },
  });

  if (vcmInfo.vipcards.cardsubtype === VipCard.VipCardSubType.SecondaryCard) {
    let param = parseInt(vcmInfo.curbuy, 10);
    param = (param - 1) < 0 ? 0 : (param - 1);
    const ret = await Sequelize.transaction(t => vcmInfo.update({
      curbuy: param,
    }, {
      transaction: t,
    }).then((pmInfo) => {
      if (!pmInfo) throw new Error();
      return models.MSignin.create({
        vipcardmapid, number, signin, signdate: moment().format('YY-MM-DD'), status,
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
      return false;
    }
  } else {
    const ret = await models.MSignin.create({
      vipcardmapid, number, signin, signdate: moment().format('YY-MM-DD'), status,
    });
    if (!ret) {
      return false;
    }
  }

  return true;
};

export const cancelMemSignin = async (data) => {
  $required('uid', data.uid);
  const uid = data.uid; // 签到表id

  const info = await models.MSignin.findOne({
    where: {
      uid,
    },
  });

  if (info.status === 2) {
    return false;
  }

  if (info.noreturncardid !== '') {
    return false;
  }

  const res = await info.update({
    status: 2,
  });

  if (!res) {
    return false;
  }

  return true;
};

export const queryMemSigninList = async (data) => {
  const param = data.param; // 姓名/电话/实体卡号
  const RFID = data.RFID; // 手牌号
  // const courseid = data.courseid; // 课程id
  const vipcardid = data.vipcardid; // 会员卡id
  const starttime = data.starttime; // 开始时间
  const endtime = data.endtime; // 结束时间

  // 人物信息
  let memberInfo = null;
  if (param.length > 1 || param.length < 5) {
    memberInfo = await models.Member.findOne({
      username: param,
    });
  } else if (param.length === 11) {
    memberInfo = await models.Member.findOne({
      cellphone: param,
    });
  } else if (param.length > 11) {
    memberInfo = await models.Member.findOne({
      RFID: param,
    });
  }

  // 查询Signin表
  const info = models.Signin.findAll({
    where: {
      memberid: memberInfo.uid,
      vipcardid,
      RFID,
      expirytime: {
        $gte: starttime,
        $lte: endtime,
      },
    },
  });

  return info;
};

export const getAllSigninList = async (data, storeid) => {
  $required('storeid', storeid);
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;
  const pdmemberid = data.memberid; // 姓名/电话/实体卡号
  const handcardid = data.handcardid; // 手牌号
  const date = data.date || moment().format('YYYY-MM-DD'); // 时间
  const starttime = moment(date).format('YYYY-MM-DD 00:00:00'); // 开始时间
  const endtime = moment(date).format('YYYY-MM-DD 23:59:59'); // 结束时间

  const where = {};
  const where1 = {};
  if (pdmemberid !== undefined) {
    where.uid = pdmemberid;
  }
  if (handcardid !== undefined) {
    where1.handcardid = handcardid;
  }
  where1.createdAt = {
    gte: starttime,
    lte: endtime,
  };
  const include = {
    model: models.VipCardMap,
    as: 'vipcardmaps',
    attributes: ['uid'],
    include: [{
      model: models.Member,
      as: 'members',
      attributes: ['uid'],
      include: {
        model: models.PDMember,
        as: 'pdmembers',
        attributes: ['uid', 'username', 'avatar'],
        where,
      },
      where: {
        storeid,
      },
    }, {
      model: models.VipCard,
      as: 'vipcards',
      attributes: ['uid', 'cardname'],
    }],
  };
  const count = await models.MSignin.count({
    include,
    where: where1,
  });
  const allInfos = converSqlToJson(await models.MSignin.findAll({
    include,
    where: where1,
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
    order: [['iid', 'DESC']],
  }));

  return {
    count,
    allInfos: allInfos.map(info => ({
      uid: info.uid,
      avatar: info.vipcardmaps.members.pdmembers.avatar,
      name: info.vipcardmaps.members.pdmembers.username,
      cardname: info.vipcardmaps.vipcards.cardname,
      number: info.number,
      signin: info.signin,
      sigintime: moment(info.createdAt).format('YY-MM-DD'),
      handcardid: info.handcardid,
      returntime: info.returntime,
      status: info.status,
    })),
  };
};

export const leadingCard = async (data) => {
  $required('uid', data.uid);
  $required('handcardid', data.handcardid);
  const uid = data.uid; // 签到表id
  const handcardid = data.handcardid; // 手牌号

  const info = await models.MSignin.findOne({
    where: {
      uid,
    },
  });

  const tempHandCardIdVec = info.handcardid === '' ? [] : info.handcardid.split(',');
  const tempNoReturnCardVec = info.noreturncardid === '' ? [] : info.noreturncardid.split(',');
  tempHandCardIdVec.push(handcardid);
  tempNoReturnCardVec.push(handcardid);

  const res = await info.update({
    handcardid: tempHandCardIdVec.join(','), noreturncardid: tempNoReturnCardVec.join(','),
  });

  if (!res) {
    return false;
  }

  return true;
};

export const returnCard = async (data) => {
  $required('uid', data.uid);
  $required('handcardid', data.handcardid);
  const uid = data.uid; // 签到表id
  const handcardid = data.handcardid; // 手牌号

  const info = await models.MSignin.findOne({
    where: {
      uid,
    },
  });

  const indexs = [];
  const noReturnCardIdVec = info.noreturncardid.split(',');
  for (let i = noReturnCardIdVec.length - 1; i >= 0; i -= 1) {
    for (let j = 0; j < handcardid.length; j += 1) {
      if (noReturnCardIdVec[i] === handcardid[j]) {
        indexs.push(i);
      }
    }
  }

  for (let i = 0; i < indexs.length; i += 1) {
    noReturnCardIdVec.splice(indexs[i], 1);
  }

  const res = await info.update({
    noreturncardid: noReturnCardIdVec.join(','), returntime: moment().format('MM-DD HH:mm'),
  });

  if (!res) {
    return false;
  }

  return true;
};

// 今日会员签到人数
export const getTodayCount = async (storeid) => {
  $required('storeid', storeid);
  const stime = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
  const etime = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');

  const sql = 'SELECT DISTINCT(`vipcardmaps->members`.`uid`) FROM `MSignins` AS `MSignin` INNER JOIN `VipCardMaps` AS `vipcardmaps` ON `MSignin`.`vipcardmapid` = `vipcardmaps`.`uid` AND `vipcardmaps`.`deleted` = FALSE INNER JOIN `Members` AS `vipcardmaps->members` ON `vipcardmaps`.`memberid` = `vipcardmaps->members`.`uid` AND `vipcardmaps->members`.`storeid` = ? AND `vipcardmaps->members`.`deleted` = FALSE WHERE (`MSignin`.`createdAt` > ? AND `MSignin`.`createdAt` <= ?) AND `MSignin`.`deleted` = FALSE;';
  const info = await Sequelize.query(sql, { replacements: [storeid, stime, etime], type: sequelize.QueryTypes.SELECT });

  return info.length;
};
