import Moment from 'moment';
import models from 'modules/db/models';
import { $required, converSqlToJson } from 'modules/utils';
import sequelize from 'sequelize';
import Sequelize from 'modules/db/sequelize';

const CardType = {
  vipcard: 1, // 会员卡
  private: 2, // 私教课
  water: 3, // 水费
};

// 营业流水
export const OperationFlow = async (data, storeid) => {
  $required('storeid', storeid);
  const ascription = data.ascription; // 业绩归属
  const payment = data.payment; // 支付方式
  const stime = data.stime || Moment().format('YYYY-MM-DD 00:00:00'); // 开始时间
  const etime = data.etime || Moment().format('YYYY-MM-DD 23:59:59'); // 结束时间
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;

  let sql = 'SELECT SUM(a.`money`) total FROM `Orders` a\n' +
  'LEFT JOIN `VipCardMapLogs` b ON a.`vcmlid` = b.`uid`\n' +
  'LEFT JOIN `PrivateMapLogs` c ON a.`pmlid` = c.`uid`\n' +
  'LEFT JOIN `Members` d ON b.`memberid` = d.`uid` OR c.`memberid` = d.`uid`\n' +
  'WHERE d.`storeid` = ? AND a.`createdAt` >= ? AND a.`createdAt` <= ?';
  if (ascription !== undefined) {
    sql += ' AND a.`ascription` = \'';
    sql += ascription.toString();
    sql += '\'';
  }
  if (payment !== undefined) {
    sql += ' AND a.`payment` = \'';
    sql += payment.toString();
    sql += '\'';
  }
  const total = await Sequelize.query(sql, { replacements: [storeid, stime, etime], type: sequelize.QueryTypes.SELECT });
  let sql1 = 'SELECT SQL_CALC_FOUND_ROWS(a.`uid`), a.`iid`, a.`type` FROM `Orders` a\n' +
  'LEFT JOIN `VipCardMapLogs` b ON a.`vcmlid` = b.`uid`\n' +
  'LEFT JOIN `PrivateMapLogs` c ON a.`pmlid` = c.`uid`\n' +
  'LEFT JOIN `Members` d ON b.`memberid` = d.`uid` OR c.`memberid` = d.`uid`\n' +
  'WHERE d.`storeid` = ? AND a.`createdAt` >= ? AND a.`createdAt` <= ?';
  if (ascription !== undefined) {
    sql1 += ' AND a.`ascription` = \'';
    sql1 += ascription.toString();
    sql1 += '\'';
  }
  if (payment !== undefined) {
    sql1 += ' AND a.`payment` = \'';
    sql1 += payment.toString();
    sql1 += '\'';
  }
  sql1 += ' ORDER BY iid DESC LIMIT ? OFFSET ?';
  const allInfos = await Sequelize.query(sql1, { replacements: [storeid, stime, etime, pageCount, (curPage - 1) * pageCount], type: sequelize.QueryTypes.SELECT });
  const sql2 = 'SELECT FOUND_ROWS() as count';
  const count = await Sequelize.query(sql2, { replacements: [], type: sequelize.QueryTypes.SELECT });

  const vec = [];
  for (let i = 0; i < allInfos.length; i += 1) {
    const type = allInfos[i].type;
    let goodsname = '';
    let username = '';
    let oInfo = null;
    const uid = allInfos[i].uid;
    if (type === CardType.vipcard) {
      oInfo = await models.Order.findOne({
        include: {
          model: models.VipCardMapLog,
          as: 'vipcardmaplogs',
          attributes: ['uid'],
          include: [{
            model: models.Member,
            as: 'members',
            attributes: ['uid'],
            include: {
              model: models.PDMember,
              as: 'pdmembers',
              attributes: ['uid', 'username'],
            },
          }, {
            model: models.VipCard,
            as: 'vipcards',
            attributes: ['uid', 'cardname'],
          }],
        },
        where: {
          uid,
        },
      });
      goodsname = oInfo.vipcardmaplogs.vipcards.cardname;
      username = oInfo.vipcardmaplogs.members.pdmembers.username;
    } else if (type === CardType.private) {
      oInfo = await models.Order.findOne({
        include: {
          model: models.PrivateMapLog,
          as: 'privatemaplogs',
          attributes: ['uid'],
          include: [{
            model: models.Member,
            as: 'members',
            attributes: ['uid'],
            include: {
              model: models.PDMember,
              as: 'pdmembers',
              attributes: ['uid', 'username'],
            },
          }, {
            model: models.Private,
            as: 'privates',
            attributes: ['uid', 'privatename'],
          }],
        },
        where: {
          uid,
        },
      });
      goodsname = oInfo.privatemaplogs.privates.privatename;
      username = oInfo.privatemaplogs.members.pdmembers.username;
    }
    vec.push({
      ordernumber: oInfo.ordernumber,
      createdAt: Moment(oInfo.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      goodsname,
      username,
      operation: oInfo.operation,
      payment: oInfo.payment,
      ascription: oInfo.ascription,
      money: oInfo.money,
      remark: oInfo.remark,
    });
  }
  return {
    total: total[0].total || '0.00',
    count: count[0].count,
    allInfos: vec,
  };
};

// 会员卡销售报表
export const VipCardSaleReport = async (data, storeid) => {
  $required('storeid', storeid);
  const vipcardmapid = data.vipcardmapid; // 会员卡id
  const operation = data.operation; // 消费类型
  const ascription = data.ascription; // 业绩归属
  const payment = data.payment; // 支付方式
  const stime = data.stime || Moment().format('YYYY-MM-DD 00:00:00'); // 开始时间
  const etime = data.etime || Moment().format('YYYY-MM-DD 23:59:59'); // 结束时间
  const cardsubtype = data.cardsubtype; // 会员卡类型
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;

  const where = {};
  if (operation !== undefined) {
    where.operation = operation;
  }
  if (ascription !== undefined) {
    where.ascription = ascription;
  }
  if (payment !== undefined) {
    where.payment = payment;
  }
  where.createdAt = {
    gte: Moment(stime).format('YYYY-MM-DD HH:mm:ss'),
    lte: Moment(etime).format('YYYY-MM-DD HH:mm:ss'),
  };
  where.type = CardType.vipcard;
  const where1 = {};
  if (vipcardmapid !== undefined) {
    where1.vipcardmapid = vipcardmapid;
  }
  const where2 = {};
  if (cardsubtype !== undefined) {
    where2.cardsubtype = cardsubtype;
  }

  const include = {
    model: models.VipCardMapLog,
    as: 'vipcardmaplogs',
    attributes: ['uid', 'operation', 'totalbuy'],
    include: [{
      model: models.Member,
      as: 'members',
      attributes: ['uid'],
      include: {
        model: models.PDMember,
        as: 'pdmembers',
        attributes: ['uid', 'username', 'cellphone'],
      },
      where: {
        storeid,
      },
    }, {
      model: models.VipCard,
      as: 'vipcards',
      attributes: ['uid', 'cardname', 'price', 'cardsubtype'],
      where: where2,
    }, {
      model: models.VipCardMap,
      as: 'vipcardmaps',
      attributes: ['uid', 'entitycardid'],
    }],
    where: where1,
  };
  let sql = 'SELECT SUM(a.`money`) total FROM `Orders` a\n' +
  'LEFT JOIN `VipCardMapLogs` b ON a.`vcmlid` = b.`uid`\n' +
  'LEFT JOIN `VipCardMaps` c ON b.`vipcardmapid` = c.`uid`\n' +
  'LEFT JOIN `VipCards` d ON c.`vipcardid` = d.`uid`\n' +
  'LEFT JOIN `Members` e ON c.`memberid` = e.`uid`\n' +
  'WHERE a.`type` = ? AND e.`storeid` = ? AND a.`createdAt` >= ? AND a.`createdAt` <= ?';
  if (ascription !== undefined) {
    sql += ' AND a.`ascription` = \'';
    sql += ascription.toString();
    sql += '\'';
  }
  if (payment !== undefined) {
    sql += ' AND a.`payment` = \'';
    sql += payment.toString();
    sql += '\'';
  }
  if (cardsubtype !== undefined) {
    sql += ' AND d.`cardsubtype` = \'';
    sql += cardsubtype.toString();
    sql += '\'';
  }
  const total = await Sequelize.query(sql, { replacements: ['1', storeid, stime, etime], type: sequelize.QueryTypes.SELECT });
  const count = await models.Order.count({
    include,
    where,
  });
  const allInfos = converSqlToJson(await models.Order.findAll({
    include,
    where,
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
    order: [['iid', 'DESC']],
  }));

  return {
    total: total[0].total || '0.00',
    count,
    allInfos: allInfos.map(info => ({
      createdAt: Moment(info.createdAt).format('YYYY-MM-DD'),
      ascription: info.ascription,
      entitycardid: info.vipcardmaplogs.vipcardmaps.entitycardid,
      cardname: info.vipcardmaplogs.vipcards.cardname,
      cardsubtype: info.vipcardmaplogs.vipcards.cardsubtype,
      username: info.vipcardmaplogs.members.pdmembers.username,
      cellphone: info.vipcardmaplogs.members.pdmembers.cellphone,
      price: info.vipcardmaplogs.vipcards.price,
      pricediff: parseFloat(info.money - info.vipcardmaplogs.vipcards.price).toFixed(2),
      money: info.money,
      payment: info.payment,
      param: info.vipcardmaplogs.totalbuy,
      operation: info.vipcardmaplogs.operation,
      remark: info.remark,
    })),
  };
};

// 私教课销售报表
export const PrivateSaleReport = async (data, storeid) => {
  $required('storeid', storeid);
  const ascription = data.ascription; // 业绩归属
  const privatemapid = data.privatemapid; // 私教课id
  const payment = data.payment; // 支付方式
  const stime = data.stime || Moment().format('YYYY-MM-DD 00:00:00'); // 开始时间
  const etime = data.etime || Moment().format('YYYY-MM-DD 23:59:59'); // 结束时间
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;

  const where = {};
  if (ascription !== undefined) {
    where.ascription = ascription;
  }
  if (payment !== undefined) {
    where.payment = payment;
  }
  where.createdAt = {
    gte: Moment(stime).format('YYYY-MM-DD HH:mm:ss'),
    lte: Moment(etime).format('YYYY-MM-DD HH:mm:ss'),
  };
  where.type = CardType.private;
  const where1 = {};
  if (privatemapid !== undefined) {
    where1.privatemapid = privatemapid;
  }

  const include = {
    model: models.PrivateMapLog,
    as: 'privatemaplogs',
    attributes: ['uid', 'totalbuy'],
    include: [{
      include: {
        model: models.PDMember,
        as: 'pdmembers',
        attributes: ['uid', 'username', 'cellphone'],
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
      attributes: ['uid', 'privatename', 'price'],
    }, {
      model: models.PrivateMap,
      as: 'privatemaps',
      attributes: ['uid'],
    }],
    where: where1,
  };
  let sql = 'SELECT SUM(a.`money`) total FROM `Orders` a\n' +
  'LEFT JOIN `PrivateMapLogs` b ON a.`pmlid` = b.`uid`\n' +
  'LEFT JOIN `PrivateMaps` c ON b.`privatemapid` = c.`uid`\n' +
  'LEFT JOIN `Members` e ON c.`memberid` = e.`uid`\n' +
  'WHERE a.`type` = ? AND e.`storeid` = ? AND a.`createdAt` >= ? AND a.`createdAt` <= ?';
  if (ascription !== undefined) {
    sql += ' AND a.`ascription` = \'';
    sql += ascription.toString();
    sql += '\'';
  }
  if (payment !== undefined) {
    sql += ' AND a.`payment` = \'';
    sql += payment.toString();
    sql += '\'';
  }
  const total = await Sequelize.query(sql, { replacements: ['2', storeid, stime, etime], type: sequelize.QueryTypes.SELECT });
  const count = await models.Order.count({
    include,
    where,
  });
  const allInfos = converSqlToJson(await models.Order.findAll({
    include,
    where,
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
    order: [['iid', 'DESC']],
  }));

  return {
    total: total[0].total || '0.00',
    count,
    allInfos: allInfos.map(info => ({
      createdAt: Moment(info.createdAt).format('YYYY-MM-DD'),
      ascription: info.ascription,
      privatename: info.privatemaplogs.privates.privatename,
      username: info.privatemaplogs.members.pdmembers.username,
      cellphone: info.privatemaplogs.members.pdmembers.cellphone,
      price: parseFloat(info.privatemaplogs.privates.price * info.privatemaplogs.totalbuy).toFixed(2),
      pricediff: parseFloat(info.money - parseFloat(info.privatemaplogs.privates.price * info.privatemaplogs.totalbuy).toFixed(2)).toFixed(2),
      money: info.money,
      payment: info.payment,
      param: info.privatemaplogs.totalbuy,
      remark: info.remark,
    })),
  };
};

// 私教课消课报表
export const PDisCourseReport = async (data, storeid) => {
  $required('storeid', storeid);
  const coachid = data.coachid; // 上课教练
  const memberid = data.memberid; // 会员id
  const privateid = data.privateid; // 私教课id
  const stime = data.stime; // 开始时间
  const etime = data.etime; // 结束时间
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;

  const where = {};
  if (coachid !== undefined) {
    where.coachId = coachid;
  }
  if (memberid !== undefined) {
    where.memberId = memberid;
  }
  if (privateid !== undefined) {
    where.privateId = privateid;
  }
  if (stime !== undefined && etime !== undefined) {
    where.signOkDate = {
      $gte: stime,
      $lte: etime,
    };
  }
  where.storeid = storeid;

  const count = await models.SignPrivateLesson.count({
    where,
  });
  const total1 = await models.SignPrivateLesson.sum('signNumber', {
    where,
  });
  const total2 = await models.SignPrivateLesson.sum('signGiveNumber', {
    where,
  });
  const splInfo = await models.SignPrivateLesson.findAll({
    where,
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
  });
  const vec = [];
  for (let i = 0; i < splInfo.length; i += 1) {
    const memberId = splInfo[i].memberId;
    const privateId = splInfo[i].privateId;
    const pInfo = await models.PrivateMap.findOne({
      include: {
        model: models.Private,
        as: 'privates',
        attributes: ['uid', 'privatename'],
      },
      where: {
        uid: privateId,
      },
    });
    const mInfo = await models.Member.findOne({
      include: {
        model: models.PDMember,
        as: 'pdmembers',
        attributes: ['username', 'cellphone'],
      },
      where: {
        uid: memberId,
      },
    });
    vec.push({
      signokdate: Moment(splInfo[i].signOkDate).format('YYYY-MM-DD'),
      coachname: splInfo[i].coachId,
      privatename: pInfo.privates.privatename,
      username: mInfo.pdmembers.username,
      cellphone: mInfo.pdmembers.cellphone,
      signnumber: parseInt(splInfo[i].signNumber, 10) + parseInt(splInfo[i].signGiveNumber, 10),
    });
  }

  return {
    count,
    total: total1 + total2,
    allInfos: vec,
  };
};

// 总收入
export const GrossIncome = async (storeid) => {
  $required('storeid', storeid);

  const sum = await models.Order.sum('money', {
    include: {
      model: models.VipCardMapLog,
      as: 'vipcardmaplogs',
      attributes: ['uid'],
      include: {
        model: models.Member,
        as: 'members',
        attributes: ['uid'],
        where: {
          storeid,
        },
      },
    },
  });

  const sum1 = await models.Order.sum('money', {
    include: {
      model: models.VipCardMapLog,
      as: 'vipcardmaplogs',
      attributes: ['uid'],
      include: {
        model: models.Member,
        as: 'members',
        attributes: ['uid'],
        where: {
          storeid,
        },
      },
    },
    where: {
      cardtype: CardType.vipcard,
    },
  });

  const sum2 = await models.Order.sum('money', {
    include: {
      model: models.VipCardMapLog,
      as: 'vipcardmaplogs',
      attributes: ['uid'],
      include: {
        model: models.Member,
        as: 'members',
        attributes: ['uid'],
        where: {
          storeid,
        },
      },
    },
    where: {
      cardtype: CardType.private,
    },
  });

  return {
    GrossIncome: sum,
    VipCardIncome: sum1,
    PrivateIncome: sum2,
  };
};
