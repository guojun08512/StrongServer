import models from 'modules/db/models';
import ERROR, { $required } from 'modules/utils';
import lodash from 'lodash';
import * as Search from 'modules/search';
import moment from 'moment';

export const add = async (data, storeid) => {
  $required('groupLessonId', data.groupLessonId);
  // $required('memberId', data.memberId);
  // $required('vipcardmapid', data.vipcardmapid);
  // const vipCardMapId = data.vipcardmapid;

  if (!data.memberId && !data.uid) {
    $required('memberId', null);
  }

  let memberId = data.memberId;
  const userwhere = { storeid };
  if (memberId) userwhere.uid = memberId;
  else { userwhere.pdmemberid = data.uid; }
  const member = await models.Member.findOne({
    where: userwhere,
  });

  if (!member) {
    return ERROR.groupLessonInvalid(' 会员不存在 ');
  }
  memberId = member.uid;

  const groupLesson = await models.GroupLesson.findOne({
    where: {
      id: data.groupLessonId,
      storeid,
    },
  });

  if (!groupLesson) {
    return ERROR.groupLessonInvalid();
  }

  const courseMon = moment(`${groupLesson.courseDate} ${groupLesson.beginTime}`);
  if (courseMon.diff(moment()) < 0) {
    return ERROR.groupLessonInvalid(' 课程已过期 ');
  }

  const timeLimitInfo = await models.CommonConf.findOne({
    attributes: ['groupLessonOrderTimeLimit', 'groupLessonCancelOrderTimeLimit'],
    where: {
      id: 1, storeid,
    },
  });
  if (timeLimitInfo && timeLimitInfo.groupLessonOrderTimeLimit) {
    if (courseMon.diff(moment()) < 0) {
      return ERROR.dateInvalid(` 预约时间错误.限制预约，提前 ${timeLimitInfo.groupLessonOrderTimeLimit} 分钟预约`);
    }
    const diffsec = Math.floor(courseMon.diff(moment()) / 1000);
    const limitSec = timeLimitInfo.groupLessonOrderTimeLimit * 60;
    if (diffsec < limitSec) {
      return ERROR.dateInvalid(` 预约时间错误.限制预约，提前 ${timeLimitInfo.groupLessonOrderTimeLimit} 分钟预约`);
    }
  }

  let vipCardMapId = '';
  const allowCards = groupLesson.allowCards.split(',');
  if (allowCards.length > 0) {
    const vipCards = await models.VipCardMap.findAll({
      attributes: ['vipcardid'],
      where: {
        memberid: memberId,
      },
    });

    if (!vipCards) {
      return ERROR.groupLessonInvalid(' 卡不存在 ');
    }

    const vipcardIds = [];
    for (let i = 0; i < vipCards.length; i += 1) {
      vipcardIds.push(vipCards[i].vipcardid);
    }
    const interCardIds = lodash.intersection(allowCards, vipcardIds);
    if (interCardIds.length < 1) {
      return ERROR.groupLessonInvalid(' 卡不允许 ');
    }
    vipCardMapId = interCardIds[0];
  }

  const course = await models.Course.findOne({ // 必须有
    where: {
      uid: groupLesson.courseId,
    },
  });

  if (course) {
    const maxcoursemember = course.get('maxcoursemember');
    const result = await models.OrderGroup.findAll({
      where: {
        groupLessonId: data.groupLessonId,
        status: 1,
        storeid,
      },
    });

    if (maxcoursemember <= result.length) {
      return ERROR.orderGroupLessonInvalid(' 今日课程已达上限 ');
    }
  }

  const result = await models.OrderGroup.findOne({
    where: {
      memberId,
      groupLessonId: data.groupLessonId,
      storeid,
    },
  });

  if (result) { // 更新已有的
    return ERROR.commonError('已预约');
  }

  const retdata = await models.OrderGroup.create({
    memberId,
    groupLessonId: data.groupLessonId,
    status: 1,
    vipCardMapId,
    storeid,
    orderdate: moment().format('YYYY-MM-DD'),
  });

  if (!retdata) { return false; }

  return true;
};

export const deleteR = async (data, storeid) => {
  $required('groupLessonId', data.groupLessonId);
  $required('uid', data.uid);

  const orderData = await models.OrderGroup.findOne({
    where: {
      memberId: data.uid,
      groupLessonId: data.groupLessonId,
      storeid,
    },
    // logging: console.log,
  });

  if (!orderData) {
    return ERROR.orderGroupLessonInvalid(' 约课不存在。');
  }

  const groupLesson = await models.GroupLesson.findOne({
    where: {
      id: data.groupLessonId,
      storeid,
    },
  });

  if (!groupLesson) {
    return ERROR.groupLessonInvalid();
  }

  const courseMon = moment(`${groupLesson.courseDate} ${groupLesson.beginTime}`);
  const timeLimitInfo = await models.CommonConf.findOne({
    attributes: ['groupLessonOrderTimeLimit', 'groupLessonCancelOrderTimeLimit'],
    where: {
      id: 1, storeid,
    },
  });
  if (timeLimitInfo && timeLimitInfo.groupLessonCancelOrderTimeLimit) {
    if (courseMon.diff(moment()) < 0) {
      return ERROR.dateInvalid(` 预约时间错误.限制取消预约，提前 ${timeLimitInfo.groupLessonCancelOrderTimeLimit} 分钟取消预约`);
    }
    const diffsec = Math.floor(courseMon.diff(moment()) / 1000);
    const limitSec = timeLimitInfo.groupLessonCancelOrderTimeLimit * 60;
    if (diffsec < limitSec) {
      return ERROR.dateInvalid(` 预约时间错误.限制取消预约，提前 ${timeLimitInfo.groupLessonCancelOrderTimeLimit} 分钟取消预约`);
    }
  }

  let ret = 0;
  ret = await models.OrderGroup.update({ status: 3 }, {
    where: {
      id: orderData.id,
      storeid,
    },
  });
  if (!ret) {
    return false;
  }

  return true;
};

export const sign = async (data, storeid) => {
  $required('ids', data.ids);
  const ids = data.ids;

  const ret = await models.OrderGroup.update({ status: 2, signdate: moment().format('YYYY-MM-DD') }, {
    where: {
      id: ids,
      storeid,
      status: 1,
    },
    // logging: console.log,
  });
  // console.log(ret);
  if (!ret && ret[0] < 1) {
    return false;
  }

  return true;
};

export const query = async (data, storeid, authorization) => {
  const pageCount = data.pageCount || 50;
  const curPage = data.curPage || 1;

  const params = {};
  params.limit = pageCount;
  params.offset = (curPage - 1) * pageCount;

  const where = {
    storeid,
  };
  params.where = where;

  const uid = data.uid;
  if (uid) {
    const memberInfo = await models.Member.findOne({
      where: {
        pdmemberid: uid,
        storeid,
      },
    });
    if (!memberInfo) {
      return ERROR.commonError('会员不存在!');
    }
    where.memberId = memberInfo.uid;
  } else if (data.membername || data.phone) {
    const searchAllInfo = await Search.searchAllData(data.membername || data.phone, authorization);
    if (searchAllInfo === null) {
      return ERROR.commonError('会员不存在!');
    }
    const hitInfo = searchAllInfo.hitInfo;
    const mInfo = await models.Member.findAll({
      where: {
        pdmemberid: {
          $in: hitInfo,
        },
        storeid,
      },
    });
    if (!mInfo || mInfo.length < 1) {
      return ERROR.commonError('会员不存在!');
    }
    where.memberId = mInfo[0].uid;
  }

  if (data.groupLessonId) {
    where.groupLessonId = data.groupLessonId;
  }

  if (data.date) {
    where.orderdate = moment(data.date).format('YYYY-MM-DD');
  }

  const totalCount = await models.OrderGroup.count({
    where,
  });
  const result = await models.OrderGroup.findAll(params);

  if (result) {
    const retdata = [];
    for (let i = 0; i < result.length; i += 1) {
      const item = result[i].toJSON();
      const member = await models.Member.findOne({
        where: { uid: item.memberId, storeid },
        include: {
          model: models.PDMember,
          as: 'pdmembers',
        },
      });
      if (member) {
        item.membername = member.pdmembers.username;
      }

      const lesson = await models.GroupLesson.findOne({
        where: { id: item.groupLessonId, storeid },
        include: {
          model: models.Course,
          as: 'course',
        },
      });
      if (lesson) {
        item.coursename = lesson.course.coursename;
        item.coursetime = lesson.beginTime;
      }
      retdata.push(item);
    }
    return { count: totalCount, retdata };
  }

  return { count: 0, result };
};

