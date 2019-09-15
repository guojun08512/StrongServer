import models from 'modules/db/models';
import Moment from 'moment';
import * as OrderGroup1 from 'modules/ordergroup';

// 查询团课
export const queryGroupLessonInfo = async (data, userID) => {
  const storeid = data.storeid;
  const courseId = data.courseId;

  const grouplessonwhere = {
    storeid,
    $or: [
      {
        courseDate: Moment().format('YYYY-MM-DD'),
        beginTime: { gte: Moment().format('HH:mm') },
      },
      { courseDate: { gt: Moment().format('YYYY-MM-DD'), lte: Moment().add(7, 'days').format('YYYY-MM-DD') } },
    ],
  };

  if (courseId) {
    grouplessonwhere.courseId = courseId;
  }

  const ordergroupwhere = {};
  if (userID) {
    const memberInfo = await models.Member.findOne({ where: { pdmemberid: userID, storeid } });
    if (!memberInfo) {
      ordergroupwhere.memberId = memberInfo.uid;
    }
  }

  let infos = await models.Course.findOne({
    attributes: ['uid', 'coursename', 'mincoursemember', 'coverUrl', 'images', 'remark', 'maxcoursemember'],
    include: [
      {
        attributes: ['id', 'courseDate', 'beginTime', 'endTime', 'remark', 'storeid'],
        model: models.GroupLesson,
        as: 'grouplesson',
        include: [
          {
            attributes: ['id', 'name', 'descript'],
            model: models.Coach,
            as: 'coach',
            required: false,
          },
          {
            attributes: ['uid', 'name'],
            model: models.Room,
            as: 'room',
            required: false,
          },
          {
            attributes: ['id'],
            model: models.OrderGroup,
            as: 'ordergroup',
            required: false,
            where: ordergroupwhere,
          },
        ],
        where: grouplessonwhere,
      },
      {
        model: models.Store,
        as: 'store',
      },
    ],
    where: { storeid, uid: courseId },
  });

  if (!infos) return [];
  infos = infos.toJSON();
  const grouplesson = infos.grouplesson;
  const grouplessons = [];
  for (let i = 0; i < grouplesson.length; i += 1) {
    const info = grouplesson[i];
    const cnt = await models.OrderGroup.count({
      where: {
        groupLessonId: info.id,
        storeid,
      },
    });

    info.order_flag = false;
    if (info.ordergroup && info.ordergroup.length >= 1) {
      info.order_flag = true;
    }
    info.ordergroup = null;
    if (!cnt || cnt < infos.maxcoursemember) { // 可约的课程
      grouplessons.push(info);
    }
  }
  infos.grouplesson = grouplessons;
  infos.images = (infos.images && JSON.parse(infos.images)) || [];
  infos.store.images = (infos.store && infos.store.pictureurl && JSON.parse(infos.store.pictureurl)) || [];
  if (infos.store && infos.store.pictureurl) {
    delete infos.store.pictureurl;
  }
  return infos;
};

  // 预约团课
export const subscribeGroupLesson = async (data) => {
  const uid = data.uid;
  const lessonid = data.id;
  const storeid = data.storeid;

  const memberInfo = await models.Member.findOne({ where: { pdmemberid: uid, storeid } });
  if (!memberInfo) return {};
  const memberid = memberInfo.uid;

  const lessonInfo = await models.GroupLesson.findOne({ where: { id: lessonid } });
  if (!lessonInfo) return {};
  if (lessonInfo.allowCards && lessonInfo.allowCards.length > 0) {
    let cnt = models.VipCardMap.count({
      where: {
        vipcardid: lessonInfo.allowCards,
        memberid,
      },
    });
    if (cnt < 1) {
      cnt = models.PrivateMap.count({
        where: {
          privateid: lessonInfo.allowCards,
          memberid,
        },
      });
    }
    if (cnt < 1) return {};
  }

  const params = {
    groupLessonId: data.id,
    memberId: memberid,
    uid,
  };
  const ret = await OrderGroup1.add(params, storeid);
  return ret;
};


// 查询团课list
export const queryGroupLessonList = async (data) => {
  const pageCount = parseInt(data.pageCount, 10) || 10;
  let curPage = parseInt(data.curPage, 10) || 1;
  const storeid = data.storeid;
  if (curPage < 1) curPage = 1;

  const includes = [
    {
      attributes: ['id', 'recommendWeight', 'courseId', 'courseDate', 'beginTime'],
      model: models.GroupLesson,
      as: 'grouplesson',
      required: true,
      order: [['recommendWeight', 'asc']],
      where: {
        $or: [
          {
            courseDate: { gte: Moment().format('YYYY-MM-DD') },
            beginTime: { gte: Moment().format('HH:mm') },
          },
          { courseDate: { gt: Moment().format('YYYY-MM-DD') } },
        ],
      },
    },
  ];

  const where = { storeid };
  const count = await models.Course.count({
    include: includes,
    where,
  });
  const hasmore = (curPage * pageCount) < count;
  const cardInfos = await models.Course.findAll({
    include: includes,
    where,
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
    // logging: console.log,
  });
  if (!cardInfos) return { data: [], hasmore: false };
  const infos = [];
  for (let i = 0; i < cardInfos.length; i += 1) {
    const info = cardInfos[i].toJSON();
    info.images = (info.images && JSON.parse(info.images)) || [];
    info.grouplesson = null;
    infos.push(info);
  }

  return { data: infos, hasmore };
};
