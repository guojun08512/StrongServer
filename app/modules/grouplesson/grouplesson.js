import models from 'modules/db/models';
import ERROR, { $required } from 'modules/utils';
import * as redisModels from 'modules/redisdb';
import Moment from 'moment';

/*
function MMoment(datestr) {
  if (datestr && datestr.length > 0) {
    return Moment(datestr, ['YYYY-MM-DD', 'YYYY-M-D', 'YYYY-MM-D', 'YYYY-M-DD']);
  }
  return Moment(datestr);
}
*/

export const add = async (data, storeid) => {
  $required('courseId', data.courseId);
  $required('coachId', data.coachId);
  $required('roomId', data.roomId);
  // $required('allowCards', data.allowCards);
  $required('minNum', data.minNum);
  $required('maxNum', data.maxNum);
  $required('dates', data.dates);
  $required('data.dates is array', data.dates instanceof Array);
  $required('storeid', storeid);
  $required('beginDate', data.beginDate);
  $required('endDate', data.endDate);

  const allowCards = data.allowCards || [];
  const courseId = data.courseId;
  const coachId = data.coachId;
  const roomId = data.roomId;
  const minNum = data.minNum;
  const maxNum = data.maxNum;

  if (allowCards && allowCards.length > 0) {
    const retCardIds = await models.VipCard.findAll({ attributes: ['uid'], where: { uid: allowCards, storeid } });
    if (!retCardIds || retCardIds.length < 1) {
      return ERROR.groupLessonInvalid(' 卡无效 ');
    }
  }

  // 课程
  const course = await models.Course.findOne({ where: { uid: courseId, storeid } });
  if (!course) {
    return ERROR.groupLessonInvalid(' 课程无效 ');
  }

  // 教练
  const coach = await models.Coach.findOne({ where: { id: coachId, storeid } });
  if (!coach) {
    return ERROR.groupLessonInvalid(' 教练无效 ');
  }

  // room
  const room = await models.Room.findOne({ where: { uid: roomId, storeid } });
  if (!room) {
    return ERROR.groupLessonInvalid(' 教室无效 ');
  }

  // const dates = data.dates;
  // 检查时间
  if (data.endDate < data.beginDate) return ERROR.groupLessonInvalid(` 日期无效 beginDate:${data.beginDate} endDate:${data.endDate}`);

  const existtimemap = new Map();
  const tmpDates = data.dates;
  for (let i = 0; i < tmpDates.length; i += 1) {
    const weeks = tmpDates[i].weeks;
    const beginTime = tmpDates[i].beginTime;
    const endTime = tmpDates[i].endTime;
    $required('beginTime', beginTime);
    $required('endTime', endTime);
    if (endTime.length > 5 || beginTime.length > 5) {
      return ERROR.groupLessonInvalid(` 时间无效. HH:MM. begintime:${beginTime}   endtime: ${endTime}`);
    }
    if (endTime.split(':').length !== 2 || beginTime.split(':').length !== 2) {
      return ERROR.groupLessonInvalid(` 时间无效. HH:MM. begintime:${beginTime}   endtime: ${endTime}`);
    }

    if (endTime <= beginTime) return ERROR.groupLessonInvalid(` 时间无效. beginTime:${beginTime} endTime:${endTime}`);

    for (let j = 0; j < weeks.length; j += 1) {
      const week = weeks[j];
      if (week < 0 || week > 6) {
        return ERROR.groupLessonInvalid(` 星期无效. weeks:${week}`);
      }
      if (!existtimemap.has(week)) {
        existtimemap.set(week, []);
      }
      const times = existtimemap.get(week);
      for (let k = 0; k < times.length; k += 1) {
        const tt = times[0];
        if (tt[0] <= beginTime && endTime <= tt[1]) {
          return ERROR.groupLessonInvalid(' 时间重复 ');
        }
        if (beginTime <= tt[0] && tt[0] <= endTime) {
          return ERROR.groupLessonInvalid(' 时间重复 ');
        }
        if (beginTime <= tt[1] && tt[1] <= endTime) {
          return ERROR.groupLessonInvalid(' 时间重复 ');
        }
      }
      times.push([beginTime, endTime]);
    }
  }
  // console.log('existtimemap', existtimemap);
  // console.log('data.dates', data.dates);

  const dates = [];
  const bmoment = Moment(data.beginDate);
  const emoment = Moment(data.endDate);
  let days = emoment.diff(bmoment, 'days');
  while (days >= 0) {
    const bdate = bmoment.format('YYYY-MM-DD');
    const week = bmoment.weekday();
    let edate = bdate;
    if (week === 0) {
      edate = bdate;
    } else {
      const leftdays = emoment.diff(bmoment, 'days');
      const n = Math.min(leftdays, 7 - week);
      edate = bmoment.add(n, 'days').format('YYYY-MM-DD');
    }

    for (let k = 0; k < data.dates.length; k += 1) {
      const tmp = data.dates[k];
      const handweeks = new Map();
      tmp.weeks.forEach((w) => {
        handweeks.set(+w, true);
      });
      const tbmoment = Moment(bdate);
      const temoment = Moment(edate);
      while (temoment.diff(tbmoment) >= 0) {
        const wk = tbmoment.weekday();
        if (handweeks.has(wk)) {
          const item = Object.assign({}, tmp);
          item.courseDate = tbmoment.format('YYYY-MM-DD');
          dates.push(item);
        }
        tbmoment.add(1, 'days');
      }
    }
    const mom = bmoment.add(1, 'days');
    days = emoment.diff(mom, 'days');
  }

  for (let i = 0; i < dates.length; i += 1) {
    const item = dates[i];

    const beginTime = item.beginTime;
    const endTime = item.endTime;

    const infos = await models.GroupLesson.findAll({
      where: {
        courseDate: item.courseDate,
        roomId,
        storeid,
      },
    });
    if (infos) {
      for (let j = 0; j < infos.length; j += 1) {
        const info = infos[j];
        if (info.beginTime <= beginTime && endTime <= info.endTime) {
          return ERROR.groupLessonInvalid(' 场地时间占用 ');
        }
        if (beginTime <= info.beginTime && info.beginTime <= endTime) {
          return ERROR.groupLessonInvalid(' 场地时间占用 ');
        }
        if (beginTime <= info.endTime && info.endTime <= endTime) {
          return ERROR.groupLessonInvalid(' 场地时间占用 ');
        }
      }
    }

    const cinfos = await models.GroupLesson.findAll({
      where: {
        courseDate: item.courseDate,
        coachId,
        storeid,
      },
    });
    if (cinfos) {
      for (let j = 0; j < cinfos.length; j += 1) {
        const info = cinfos[j];
        if (info.beginTime <= beginTime && endTime <= info.endTime) {
          return ERROR.groupLessonInvalid(' 教练时间占用 ');
        }
        if (beginTime <= info.beginTime && info.beginTime <= endTime) {
          return ERROR.groupLessonInvalid(' 教练时间占用 ');
        }
        if (beginTime <= info.endTime && info.endTime <= endTime) {
          return ERROR.groupLessonInvalid(' 教练时间占用 ');
        }
      }
    }
  }

  /* */
  let addcount = 0;
  for (let i = 0; i < dates.length; i += 1) {
    const item = dates[i];
    const beginTime = item.beginTime;
    const endTime = item.endTime;

    const retdata = await models.GroupLesson.create({
      courseId,
      coachId,
      courseDate: item.courseDate,
      beginTime,
      endTime,
      roomId,
      allowCards: allowCards.join(','),
      minNum,
      maxNum,
      storeid,
    });
    if (!retdata) { return ERROR.groupLessonInvalid(); }
    addcount += 1;
    redisModels.Add(redisModels.tableIndex.huizong, `GroupLesson_${storeid}`, retdata.id, JSON.stringify(retdata));
  }
  if (addcount < 1) return false;
  return true;
};

export const update = async (data, storeid) => {
  $required('id', data.id);
  $required('crouseId', data.courseId);
  $required('date', data.courseDate);
  $required('beginTime', data.beginTime);
  $required('endTime', data.endTime);
  $required('coachId', data.coachId);
  $required('roomId', data.roomId);
  // $required('allowCards', data.allowCards);
  $required('minNum', data.minNum);
  $required('maxNum', data.maxNum);
  const minNum = data.minNum;
  const maxNum = data.maxNum;

  const allowCards = data.allowCards || [];
  const courseId = data.courseId;
  const coachId = data.coachId;
  const roomId = data.roomId;
  const courseDate = Moment(data.courseDate).format('YYYY-MM-DD');
  const beginTime = data.beginTime;
  const endTime = data.endTime;

  // cards
  if (allowCards && allowCards.length > 0) {
    const retCardIds = await models.VipCard.findAll({ attributes: ['uid'], where: { uid: allowCards, storeid } });
    if (!retCardIds || retCardIds.length < 1) {
      return ERROR.groupLessonInvalid(' 卡无效 ');
    }
  }

  // 课程
  const course = await models.Course.findOne({ where: { uid: courseId } });
  if (!course) { return ERROR.groupLessonInvalid(' 课程无效 '); }

  // 时间比较
  if (endTime <= beginTime) { return ERROR.groupLessonInvalid(' 时间无效 '); }

  const cnt = await models.GroupLesson.count({
    where: {
      courseDate,
      beginTime,
      endTime,
      roomId,
      storeid,
    },
  });
  if (cnt > 0) {
    return ERROR.groupLessonInvalid(' 时间无效，已被占用 ');
  }

  // 教练
  const coach = await models.Coach.findOne({ where: { id: coachId } });
  if (!coach) { return ERROR.groupLessonInvalid(' 教练无效 '); }


  // room
  const room = await models.Room.findOne({ where: { uid: roomId, storeid } });
  if (!room) { return ERROR.groupLessonInvalid(' 教室无效 '); }

  const retdata = await models.GroupLesson.update({
    courseId,
    coachId,
    courseDate,
    beginTime,
    endTime,
    roomId,
    allowCards: allowCards.join(','),
    minNum,
    maxNum,
  }, { where: { id: data.id, storeid } });
  if (!retdata || retdata[0] < 1) {
    return ERROR.groupLessonInvalid();
  }

  const row = await models.GroupLesson.findOne({ where: { id: data.id, storeid } });
  redisModels.Add(redisModels.tableIndex.huizong, `GroupLesson_${storeid}`, row.id, JSON.stringify(row));

  return true;
};

export const copy = async (data, storeid) => {
  $required('sourceDate', data.sourceDate);
  $required('targetDate', data.targetDate);

  // 查询这周课程
  const mom = Moment(data.sourceDate);
  const sMonday = mom.startOf('isoWeek').format('YYYY-MM-DD');
  const sSunDay = mom.endOf('isoWeek').format('YYYY-MM-DD');

  const result = await models.GroupLesson.findAll({
    where: {
      courseDate: {
        gte: sMonday,
        lte: sSunDay,
      },
      storeid,
    },
    order: [['courseDate', 'asc']], // 升序
  });

  if (!result || result.length < 1) {
    return ERROR.groupLessonInvalid(' 日期无效，无数据. ');
  }

  const targets = data.targetDate;
  for (let i = 0; i < targets.length; i += 1) {
    const endDate = targets[i].endDate;
    const beginDate = targets[i].beginDate;
    if (endDate < beginDate) {
      return ERROR.groupLessonInvalid(' 日期无效 ');
    }
    if (sMonday <= beginDate && beginDate <= sSunDay) {
      return ERROR.groupLessonInvalid(' 开始日期无效.  ');
    }
    if (sMonday <= endDate && endDate <= sSunDay) {
      return ERROR.groupLessonInvalid(' 结束日期无效 ');
    }
  }

  for (let i = 0; i < result.length; i += 1) {
    const row = result[i];
    const item = {
      allowCards: row.allowCards.split(','),
      minNum: row.minNum,
      maxNum: row.maxNum,
      storeid,
      courseId: row.courseId,
      coachId: row.coachId,
      roomId: row.roomId,
      beginTime: row.beginTime,
      endTime: row.endTime,
    };
    const weeks = [Moment(row.courseDate).weekday()];
    item.dates = [];
    for (let j = 0; j < targets.length; j += 1) {
      item.beginDate = targets[j].beginDate;
      item.endDate = targets[j].endDate;
      item.dates.push({
        beginDate: targets[j].beginDate,
        endDate: targets[j].endDate,
        beginTime: item.beginTime,
        endTime: item.endTime,
        weeks,
      });
    }
    await add(item, storeid);
  }
  return true;
};

export const deleteR = async (data, storeid) => {
  $required('id', data.id);

  const id = data.id;
  let ret = 0;
  ret = await models.GroupLesson.destroy({ where: { id, storeid } });
  if (!ret) {
    return false;
  }

  redisModels.Delete(redisModels.tableIndex.huizong, `GroupLesson_${storeid}`, id);

  return true;
};

export const clear = async (data, storeid) => {
  $required('date', data.date);

  const mom = Moment(data.date);
  const Monday = mom.startOf('isoWeek').format('YYYY-MM-DD');
  const SunDay = mom.endOf('isoWeek').format('YYYY-MM-DD');

  const grouplessons = await models.GroupLesson.findAll({
    where: {
      courseDate: {
        gte: Monday,
        lte: SunDay,
      },
      storeid,
    },
  });

  const ret = await models.GroupLesson.destroy({
    where: {
      courseDate: {
        gte: Monday,
        lte: SunDay,
      },
      storeid,
    },
  });
  if (!ret) {
    return false;
  }

  for (let i = 0; i < grouplessons.length; i += 1) {
    const item = grouplessons[i];
    redisModels.Delete(redisModels.tableIndex.huizong, `GroupLesson_${storeid}`, item.id);
  }

  return true;
};

export const query = async (data, storeid) => {
  // $required('date', data.date);

  // if (!data.date || data.date.length < 1) return false;

  const pageCount = data.pageCount || 50;
  const curPage = data.curPage || 1;

  const where = {
    storeid,
  };
  if (data.weekdate) {
    const mom = Moment(data.weekdate);
    const Monday = mom.startOf('isoWeek').format('YYYY-MM-DD');
    const SunDay = mom.endOf('isoWeek').format('YYYY-MM-DD');
    where.courseDate = {
      gte: Monday,
      lte: SunDay,
    };
  }

  if (data.date) {
    const mom = Moment(data.date);
    where.courseDate = mom.format('YYYY-MM-DD');
  }

  if (data.coachId) {
    where.coachId = data.coachId;
  }

  if (data.courseId) {
    where.courseId = data.courseId;
  }

  if (data.roomId) {
    where.roomId = data.roomId;
  }

  const totalCount = await models.GroupLesson.count({ where });

  const lessonInfos = await models.GroupLesson.findAll({
    include: [
      {
        model: models.Course,
        as: 'course',
        required: false,
        where: { storeid },
      },
      {
        model: models.Coach,
        as: 'coach',
        required: false,
        where: { storeid },
      },
      {
        model: models.Room,
        as: 'room',
        required: false,
        where: { storeid },
      },
      {
        model: models.OrderGroup,
        as: 'ordergroup',
        required: false,
        where: { storeid, status: 1 },
      },
      {
        model: models.Employee,
        as: 'employee',
        required: false,
        where: { storeid },
      },
    ],
    where,
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
    order: [
      ['beginTime', 'ASC'],
    ],
  });

  const result = [];
  for (let i = 0; i < lessonInfos.length; i += 1) {
    const item = lessonInfos[i].toJSON();
    if (item.course) {
      item.courseName = item.course.coursename;
      item.course = null;
      // console.log(' item.courseName', item.courseName, item.course.coursename);
    }
    if (item.coach) {
      item.coachName = item.coach.name;
      item.coach = null;
    }
    if (item.room) {
      item.roomName = item.room.name;
      item.room = null;
      // console.log(' item.roomName', item.roomName);
    }

    if (item.ordergroup) {
      item.orderNumber = item.ordergroup.length;
      item.ordergroup = null;
    } else {
      item.orderNumber = 0;
    }
    if (item.employee) {
      item.recordPersonName = item.employee.name;
      item.employee = null;
    }

    item.device = item.haveDevice;

    result.push(item);
  }

  return { count: totalCount, result };
};

export const sign = async (data, storeid) => {
  $required('id', data.id);
  $required('currentNumber', data.currentNumber);
  $required('recordPersonId', data.recordPersonId);
  // $required('device', data.device);
  // $required('remark', data.remark);

  const id = data.id;
  let ret = 0;
  ret = await models.GroupLesson.update({
    status: 1,
    currentNumber: data.currentNumber,
    recordPersonId: data.recordPersonId,
    remark: data.remark,
    signDate: Moment().format('YYYY-MM-DD HH:mm:ss'),
    haveDevice: data.device,
  }, { where: { id, status: 0, storeid } });
  if (!ret) {
    return false;
  }

  return true;
};

export const cancelSign = async (data, storeid) => {
  $required('id', data.id);

  const id = data.id;
  let ret = 0;
  ret = await models.GroupLesson.update({
    status: 3, currentNumber: 0, recordPersonId: '', remark: '',
  }, { where: { id, storeid } });
  if (!ret) {
    return false;
  }

  return true;
};

export const signOk = async (data, storeid) => {
  $required('id', data.id);
  // $required('currentNumber', data.currentNumber);
  // $required('recordPersonId', data.recordPersonId);
  // $required('remark', data.remark);

  const id = data.id;
  let ret = 0;
  ret = await models.GroupLesson.update({
    status: 2,
    // currentNumber: data.currentNumber,
    // recordPersonId: data.recordPersonId,
    // remark: data.remark,
    signOkDate: Moment().format('YYYY-MM-DD HH:mm:ss'),
  }, { where: { id, status: 1, storeid } });
  if (!ret) {
    return false;
  }

  return true;
};

export const orderTimeSet = async (data, storeid) => {
  $required('orderTime', data.orderTime);
  $required('cancelTime', data.cancelTime);

  const ret = await models.CommonConf.upsert({
    id: 1,
    groupLessonOrderTimeLimit: data.orderTime,
    groupLessonCancelOrderTimeLimit: data.cancelTime,
    storeid,
  }, { where: { storeid, id: 1 } });

  if (!ret) {
    return false;
  }

  return true;
};

export const orderTimeSetQuery = async (data, storeid) => {
  const ret = await models.CommonConf.findOne({
    attributes: ['groupLessonOrderTimeLimit', 'groupLessonCancelOrderTimeLimit'],
    where: {
      id: 1, storeid,
    },
  });

  return ret;
};

