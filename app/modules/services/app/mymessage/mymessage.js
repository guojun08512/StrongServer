import models from 'modules/db/models';
import ERROR, { $required, converSqlToJson } from 'modules/utils';
import * as OrderCoach1 from 'modules/coach/ordercoach';
import * as OrderGroup1 from 'modules/ordergroup';
import Moment from 'moment';
import fs from 'fs';
import uuid from 'uuid';
import config from 'modules/config';
import sequelize from 'sequelize';
import Sequelize from 'modules/db/sequelize';
import * as redisModels from 'modules/redisdb';

export const COURSETYPE = {
  total: 1, // 全部
  waitclass: 2, // 待上课
  waitevaluate: 3, // 待评价
  evaluate: 4, // 已评价
};

export const RETCOURSETYPE = {
  waitclass: 1, // 待上课
  waitevaluate: 2, // 待评价
  evaluate: 3, // 已评价
  cancel: 4, // 取消
};

export const CTYPE = {
  private: 1, // 私教课
  League: 2, // 团课
};

// 查询我的资料
export const QueryMyInformation = async (uid) => {
  console.log(uid);
  const pdmInfo = await models.PDMember.findOne({
    include: {
      model: models.Member,
      as: 'members',
      attributes: ['uid', 'storeid'],
      required: false,
    },
    where: {
      uid,
    },
  });
  let storeid = await redisModels.Get(redisModels.tableIndex.base, 'Last_Sport', uid);
  if (storeid === null) {
    storeid = pdmInfo.members.length > 0 ? pdmInfo.members[0].storeid : '';
  }
  return {
    uid: pdmInfo.uid,
    username: pdmInfo.username,
    cellphone: pdmInfo.cellphone,
    sex: pdmInfo.sex,
    idcard: pdmInfo.idcard,
    birthday: Moment(pdmInfo.birthday).format('X'),
    city: pdmInfo.city,
    avatar: pdmInfo.avatar,
    wxunionid: pdmInfo.wxunionid,
    createdAt: Moment(pdmInfo.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: Moment(pdmInfo.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
    storeid,
  };
};

function base64decode(base64str, filepath) {
  // const base64Data = base64str.replace(/^data:image\/\w+;base64,/, '');
  const bitMap = Buffer.from(base64str, 'base64');
  fs.writeFileSync(filepath, bitMap);
}

// 设置我的资料
export const SetupMyInformation = async (data, uid) => {
  const pdmInfo = await models.PDMember.findOne({
    where: {
      uid,
    },
  });
  if (!pdmInfo) {
    return ERROR.QueryDataError();
  }

  const newData = { ...data };
  // 头像
  if (data.avatar !== undefined) {
    const UUid = uuid.v4();
    const timestamp = Moment().valueOf();
    const dir = `${config.get('UPLOAD')}/${UUid}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const filepath = `${dir}/${timestamp}.bmp`;
    base64decode(data.avatar, filepath);
    const fileurl = `${config.get('HOST_URL')}/${UUid}/${timestamp}.bmp`;
    newData.avatar = fileurl;
  }
  const res = await pdmInfo.update({
    ...newData,
  });
  if (!res) {
    return ERROR.UpdataDataError();
  }
  return newData;
};

// 查询我的私教课程
export const QueryMyCourse = async (data, uid) => {
  const pageCount = data.pageCount === undefined ? 10 : parseInt(data.pageCount, 10);
  const curPage = data.curPage === undefined ? 1 : parseInt(data.curPage, 10);
  const include = {
    model: models.Member,
    as: 'members',
    attributes: ['storeid'],
    where: {
      pdmemberid: uid,
    },
  };
  const count = await models.PrivateMap.count({
    include,
  });
  const allInfos = converSqlToJson(await models.PrivateMap.findAll({
    include,
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
    order: [['iid', 'DESC']],
  }));

  const vec = [];
  for (let i = 0; i < allInfos.length; i += 1) {
    const info = allInfos[i];
    const storeid = info.members.storeid;
    const privateid = info.privateid;
    // 场馆信息
    const sInfo = await models.Store.findOne({
      where: {
        uid: storeid,
      },
    });
    // 课程信息
    const pInfo = await models.Private.findOne({
      where: {
        uid: privateid,
      },
    });
    vec.push({
      ...info,
      memberid: info.memberid,
      storename: sInfo.storename,
      privateid,
      privatename: pInfo.privatename,
      createdAt: Moment(info.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: Moment(info.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
      type: CTYPE.private,
      cover: pInfo.cover,
    });
  }
  return {
    count,
    allInfos: vec,
  };
};

// 查询团课
export const QueryOrderGroup = async (data, uid) => {
  $required('date', data.date);
  const date = Moment(data.date).format('YYYY-MM-DD');

  const mInfo = await models.Member.findAll({
    where: {
      pdmemberid: uid,
    },
    attributes: ['uid'],
  });

  const memberids = [];
  for (let i = 0; i < mInfo.length; i += 1) {
    memberids.push(mInfo[i].uid);
  }
  if (memberids.length === 0) {
    return ERROR.MemberLengthError();
  }

  const ogInfo = converSqlToJson(await models.OrderGroup.findAll({
    where: {
      memberId: memberids,
      status: {
        ne: 3,
      },
    },
  }));

  const grouplessonids = [];
  for (let i = 0; i < ogInfo.length; i += 1) {
    grouplessonids.push(ogInfo[i].groupLessonId);
  }
  if (grouplessonids.length === 0) {
    return grouplessonids;
  }

  const allInfos = converSqlToJson(await models.GroupLesson.findAll({
    include: [{
      model: models.Course,
      as: 'course',
      attributes: ['uid', 'coursename', 'coverUrl'],
      required: false,
    }, {
      model: models.Coach,
      as: 'coach',
      attributes: ['id', 'name'],
      required: false,
    }, {
      model: models.Store,
      as: 'store',
      attributes: ['uid', 'storename'],
      required: false,
    }],
    where: {
      id: grouplessonids,
      courseDate: date,
    },
  }));

  return {
    allInfos: allInfos.map(info => ({
      ...info,
      createdAt: Moment(info.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: Moment(info.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
    })),
  };
};

// 约课
export const OrderCoach = async (data, userid) => {
  $required('storeid', data.storeid); // 场馆id
  $required('coachId', data.coachId); // 教练id
  $required('time', data.time); // 时间 时:分:秒
  $required('date', data.date); // 日期 年-月-日
  const storeid = data.storeid;
  const newData = { ...data };
  newData.uid = userid;
  const ret = await OrderCoach1.orderCoach(newData, data.authorization, storeid);

  return ret;
};

// 课程状态
export const QueryMyCourseStatus = async (data, uid) => {
  const type = parseInt(data.type, 10) || 1;
  const pageCount = data.pageCount === undefined ? 10 : parseInt(data.pageCount, 10);
  const curPage = data.curPage === undefined ? 1 : parseInt(data.curPage, 10);

  let sql = 'SELECT SQL_CALC_FOUND_ROWS(t.`uid`), t.`ctype`, t.`state`, t.`score`, t.`createdAt`, t.`grouplessonid` FROM(\n' +
  'SELECT c.`id` AS uid, \'1\' AS ctype, c.`orderStatus` AS state, c.`userScore` AS score, c.`createdAt`, \'\' AS grouplessonid FROM `PDMembers` a\n' +
  'LEFT JOIN `Members` b ON a.`uid` = b.`pdmemberid`\n' +
  'LEFT JOIN `SignPrivateLessons` c ON b.`uid` = c.`memberId`\n' +
  'WHERE a.`uid` = ? AND c.`memberId` IS NOT NULL\n' +
  'UNION ALL\n' +
  'SELECT c.`id` AS uid, \'2\' AS ctype, c.`status` AS state, c.`userScore` AS score, c.`createdAt`, c.`groupLessonId` AS grouplessonid FROM `PDMembers` a\n' +
  'LEFT JOIN `Members` b ON a.`uid` = b.`pdmemberid`\n' +
  'LEFT JOIN `OrderGroups` c ON b.`uid` = c.`memberId`\n' +
  'WHERE a.`uid` = ? AND c.`memberId` IS NOT NULL) AS t';
  switch (type) {
    case COURSETYPE.total:
      sql += ' WHERE t.`state` > \'0\'';
      break;
    case COURSETYPE.waitclass:
      sql += ' WHERE t.`state` = \'1\'';
      break;
    case COURSETYPE.waitevaluate:
      sql += ' WHERE t.`state` = \'2\' AND t.`score` = \'0\'';
      break;
    case COURSETYPE.evaluate:
      sql += ' WHERE t.`state` = \'2\' AND t.`score` > \'0\'';
      break;
    default:
      break;
  }
  sql += ' ORDER BY t.`createdAt` DESC LIMIT ? OFFSET ?';
  const allInfos = await Sequelize.query(sql, { replacements: [uid, uid, pageCount, (curPage - 1) * pageCount], type: sequelize.QueryTypes.SELECT });
  const sql1 = 'SELECT FOUND_ROWS() as count';
  const count = await Sequelize.query(sql1, { replacements: [], type: sequelize.QueryTypes.SELECT });
  const vec = [];
  for (let i = 0; i < allInfos.length; i += 1) {
    const id = allInfos[i].uid;
    const ctype = parseInt(allInfos[i].ctype, 10) || 0; // 1 私教课 2 团课
    const state = allInfos[i].state;
    const score = allInfos[i].score;
    const grouplessonid = allInfos[i].grouplessonid;
    let courseid = '';
    let coursename = '';
    let coachid = '';
    let coachname = '';
    let storeid = '';
    let storename = '';
    let orderdate = '';
    let ordertime = '';
    if (ctype === 1) {
      const info = await models.SignPrivateLesson.findOne({
        where: {
          id,
        },
      });
      const pInfo = await models.PrivateMap.findOne({
        include: {
          model: models.Private,
          as: 'privates',
          attributes: ['uid', 'privatename'],
        },
        where: {
          uid: info.privateId,
        },
      });
      const coachInfo = await models.Coach.findOne({
        where: {
          id: info.coachId,
        },
      });
      const storeInfo = await models.Store.findOne({
        where: {
          uid: info.storeid,
        },
      });
      courseid = info.privateId;
      coursename = pInfo.privates.privatename;
      if (coachInfo) {
        coachid = coachInfo.id;
        coachname = coachInfo.name;
      }
      storeid = storeInfo.uid;
      storename = storeInfo.storename;
      orderdate = info.orderDate;
      ordertime = info.orderTime;
    } else if (ctype === 2) {
      const info = await models.OrderGroup.findOne({
        where: {
          id,
        },
      });
      const glInfo = await models.GroupLesson.findOne({
        include: [{
          model: models.Course,
          as: 'course',
          attributes: ['uid', 'coursename'],
          required: false,
        }, {
          model: models.Coach,
          as: 'coach',
          attributes: ['id', 'name'],
          required: false,
        }, {
          model: models.Store,
          as: 'store',
          attributes: ['uid', 'storename'],
          required: false,
        }],
        where: {
          id: info.groupLessonId,
        },
      });
      courseid = glInfo.course.uid;
      coursename = glInfo.course.coursename;
      coachid = glInfo.coach.id;
      coachname = glInfo.coach.name;
      storeid = glInfo.store.uid;
      storename = glInfo.store.storename;
      orderdate = glInfo.courseDate;
      ordertime = glInfo.beginTime;
    }
    let orderstatus = 0;
    if (state === 1) {
      orderstatus = RETCOURSETYPE.waitclass;
    } else if (state === 2 && score === 0) {
      orderstatus = RETCOURSETYPE.waitevaluate;
    } else if (state === 2 && score !== 0) {
      orderstatus = RETCOURSETYPE.evaluate;
    } else if (state === 3) {
      orderstatus = RETCOURSETYPE.cancel;
    }
    vec.push({
      id,
      type: ctype,
      courseid,
      coursename,
      orderdate,
      ordertime,
      orderstatus,
      storeid,
      storename,
      coachid,
      coachname,
      grouplessonid,
    });
  }

  return {
    count: count[0].count,
    allInfos: vec,
  };
};

// 取消约课 私教课
export const DeleteOrderCoach = async (data) => {
  const ids = [];
  ids.push(data.id);
  const newData = {};
  newData.ids = ids;
  const ret = await OrderCoach1.deleteOrderCoach(newData, data.storeid);
  return ret;
};

// 取消约课 团课
export const DeleteLeague = async (data, uid) => {
  const newData = {};
  newData.groupLessonId = data.id;
  const mInfo = await models.Member.findOne({
    where: {
      pdmemberid: uid,
      storeid: data.storeid,
    },
  });
  newData.uid = mInfo.uid;
  const ret = await OrderGroup1.deleteR(newData, data.storeid);
  return ret;
};

// 评价
export const Evaluate = async (data) => {
  $required('id', data.id);
  $required('type', data.type);
  const id = data.id; // 课程id
  const type = parseInt(data.type, 10); // 课程类型
  const userScore = data.userScore; // 用户评分
  const userReview = data.userReview; // 用户评价

  let info = null;
  if (type === CTYPE.private) {
    info = await models.SignPrivateLesson.findOne({
      where: {
        id,
      },
    });
  } else if (type === CTYPE.League) {
    info = await models.OrderGroup.findOne({
      where: {
        id,
      },
    });
  }
  if (!info) {
    return ERROR.QueryDataError();
  }

  if (info.userScore > 0) {
    return ERROR.UserScoreError();
  }

  const res = await info.update({
    userScore, userReview, scoretime: Moment().format('YYYY-MM-DD HH:mm:ss'),
  });
  if (!res) {
    return ERROR.UpdataDataError();
  }
  return true;
};

export const QueryEvaluate = async (data) => {
  $required('id', data.id);
  $required('type', data.type);
  const id = data.id; // 课程id
  const type = parseInt(data.type, 10); // 课程类型

  let info = null;
  if (type === CTYPE.private) {
    info = await models.SignPrivateLesson.findOne({
      where: {
        id,
      },
    });
  } else if (type === CTYPE.League) {
    info = await models.OrderGroup.findOne({
      where: {
        id,
      },
    });
  }
  if (!info) {
    return ERROR.QueryDataError();
  }
  return {
    userscore: info.userScore,
    userreview: info.userReview,
    scoretime: info.scoretime,
  };
};
