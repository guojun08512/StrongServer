import models from 'modules/db/models';
import ERROR, { $required } from 'modules/utils';
import Moment from 'moment';
import * as redisModels from 'modules/redisdb';
import { register } from 'modules/users/user';
import * as SignPrivate from './signprivatelesson';


const NameLengthMin = 1;
const NameLengthMax = 24;
const coachPsition = 'jiaolian';
const defaultWorkTime = '09:00-18:00';
const defaultdailyLessonNumLimit = 8;
const defaultWeeks = '0,1,2,3,4,5,6';
const dailyLessonMaxNum = 8;


// 手机号正则
const phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;

export const add = async (data, storeid) => {
  $required('name', data.name);
  $required('sex', data.sex);
  $required('cellphone', data.cellphone);
  // $required('groupId', data.groupId);
  $required('coachType', data.coachType);
  // $required('allowCourse', data.allowCourse);
  // $required('feature', data.feature);
  // $required('position', data.position);
  // $required('honor', data.honor);
  // $required('description', data.description);
  $required('storeid', storeid);


  const name = data.name;
  const sex = parseInt(data.sex, 10);
  const cellphone = data.cellphone;
  // const groupId = data.groupId;
  const coachType = parseInt(data.coachType, 10) || 1;
  const feature = data.feature;
  const position = coachPsition;
  const allowCourse = data.allowCourse || [];
  const honor = data.honor;
  const descript = data.description;
  const course = data.course;
  const isOpenCoach = data.isOpenCoach;
  const weight = data.weight || 0;

  if (name.length < NameLengthMin || NameLengthMax < name.length) {
    return ERROR.nameInvalid(' 长度限制.');
  }

  if (sex !== 1 && sex !== 2) {
    return ERROR.sexInvalid();
  }

  if (coachType !== 1 && coachType !== 2) {
    return ERROR.coachTypeInvalid();
  }

  if (!phoneReg.test(cellphone)) {
    return ERROR.phoneInvalid();
  }

  const pdmembers = await models.PDMember.findOrCreate({
    where: {
      cellphone,
    },
    defaults: {
      username: name,
      cellphone,
      sex,
      idcard: '',
      birthday: '',
    },
  });
  if (!pdmembers || !pdmembers[0]) return false;
  const pdmember = pdmembers[0];

  let user = await models.User.findOne({
    where: {
      username: name,
    },
  });

  if (!user) {
    const uinfo =
    {
      username: name,
      password: '123456',
      role: position,
    };

    user = await register({ info: uinfo, roles: [position] });
  }

  // 课程
  const coachCourseStr = allowCourse.join(',');

  // 图片
  let images = null;
  if (data.images) {
    images = data.images;
    if (typeof (images) === 'string') {
      images = images.split(',');
    }
    images = JSON.stringify(images);
  }

  const retdata = await models.Coach.create({
    name,
    sex,
    cellphone,
    // groupId,
    coachType,
    allowCourse: coachCourseStr,
    position,
    feature,
    honor,
    descript,
    storeid,
    course,
    isOpenCoach,
    images,
    weight,
    pdmemberid: pdmember.uid,
    userid: user.uid,
    workTime: defaultWorkTime,
    dailyLessonNumLimit: defaultdailyLessonNumLimit,
    weeks: defaultWeeks,
  });

  if (!retdata) {
    return false;
  }

  redisModels.Add(redisModels.tableIndex.base, `Coach_${storeid}`, retdata.id, JSON.stringify(retdata));

  return true;
};

export const update = async (data, storeid) => {
  $required('id', data.id);
  $required('name', data.name);
  $required('sex', data.sex);
  // $required('groupId', data.groupId);
  // $required('type', data.type);
  $required('coachType', data.coachType);
  // $required('allowCourse', data.allowCourse);
  $required('cellphone', data.cellphone);
  // $required('feature', data.feature);
  // $required('position', data.position);
  // $required('honor', data.honor);
  // $required('description', data.description);
  const id = data.id;
  const name = data.name;
  const sex = parseInt(data.sex, 10);
  const phone = data.cellphone;
  // const groupId = data.groupId;
  const coachType = parseInt(data.coachType, 10);
  const feature = data.feature;
  const position = coachPsition; // array
  const allowCourse = data.allowCourse || [];
  const honor = data.honor;
  const descript = data.description;
  const course = data.course;
  const isOpenCoach = data.isOpenCoach;
  const weight = data.weight || 0;

  if (name.length < NameLengthMin || NameLengthMax < name.length) {
    return ERROR.nameInvalid(' 长度限制 .');
  }

  if (sex !== 1 && sex !== 2) {
    return ERROR.sexInvalid();
  }

  if (coachType !== 1 && coachType !== 2) {
    return ERROR.coachTypeInvalid();
  }

  if (!phoneReg.test(phone)) {
    return ERROR.phoneInvalid();
  }

  // 课程
  const coachCourseStr = allowCourse.join(',');

  let images = null;
  if (data.images) {
    images = data.images;
    if (typeof (images) === 'string') {
      images = images.split(',');
    }
    images = JSON.stringify(images);
  }

  const retdata = await models.Coach.update({
    name,
    sex,
    phone,
    coachType,
    allowCourse: coachCourseStr,
    position,
    feature,
    honor,
    descript,
    course,
    isOpenCoach,
    images,
    weight,
  }, { where: { id, storeid } });
  if (!retdata || retdata[0] < 1) {
    return false;
  }

  const row = await models.Coach.findOne({ where: { id, storeid } });
  redisModels.Update(redisModels.tableIndex.base, `Coach_${storeid}`, id, JSON.stringify(row));

  return true;
};

export const deleteR = async (data, storeid) => {
  $required('id', data.id);
  const id = data.id;

  let ret = 0;
  ret = await models.Coach.update({ deleted: true }, { where: { id, storeid } });
  if (!ret || ret[0] < 1) {
    return false;
  }

  const signInfos = await models.SignPrivateLesson.findAll({
    where: { orderCoachId: id, status: { lt: 1 }, storeid },
  });
  console.log(' signInfos.length', signInfos.length);
  for (let i = 0; i < signInfos.length; i += 1) {
    const item = signInfos[i];
    await SignPrivate.CancelSignPrivateLesson({ id: item.id }, storeid, 1);
  }

  redisModels.Delete(redisModels.tableIndex.base, `Coach_${storeid}`, id);

  return true;
};

export const resumeOffice = async (data, storeid) => {
  $required('id', data.id);
  const id = data.id;

  const ret = await models.Coach.scope({ method: ['scopeFunction', { id, storeid }] }).update({ deleted: false });
  if (!ret || ret[0] < 1) {
    return false;
  }

  const row = await models.Coach.findOne({ where: { id, storeid } });
  redisModels.Update(redisModels.tableIndex.base, `Coach_${storeid}`, id, JSON.stringify(row));

  return true;
};

export const query = async (data, storeid) => {
  const pageCount = parseInt(data.pageCount, 10) || 10;
  const curPage = parseInt(data.curPage, 10) || 1;
  const groupId = parseInt(data.groupId, 10) || 0;
  const coachId = parseInt(data.coachId, 10) || 0; // 教练id
  const courseId = parseInt(data.courseId, 10) || 0; // 课程id
  const date = data.date; // date 年-月-日
  const position = data.position;
  const coachType = parseInt(data.coachType, 10) || 0;
  const isOpenCoach = parseInt(data.isOpenCoach, 10) || -1;
  const name = data.name;
  const workType = data.workType || parseInt(data.workType, 10); // 1工作、2请假、3可约
  let leaveOffice = data.leaveOffice || false;
  if (!leaveOffice) leaveOffice = false;
  if (leaveOffice) leaveOffice = true;

  const where = { storeid, deleted: leaveOffice };
  if (name) {
    where.name = { like: `%${name}%` };
  }
  if (position) {
    where.position = position;
  }

  if (groupId > 0) {
    where.groupId = groupId;
  }

  if (isOpenCoach > -1) {
    where.isOpenCoach = isOpenCoach;
  }

  if (coachType > 0) {
    where.coachType = coachType;
  }

  if (coachId > 0) { where.id = coachId; }

  // let totalCount = await models.Coach.count({ where });
  let totalCount = await models.Coach.scope({ method: ['scopeFunction', where] }).count();

  const allCoach = await models.Coach.scope({ method: ['scopeFunction', where] }).findAll({
    limit: pageCount + 0,
    offset: (curPage - 1) * pageCount,
  });

  const dayStart = Moment(date).format('YYYY-MM-DD');
  const now = Moment().format('YYYY-MM-DD HH:mm:ss');

  let subCnt = 0;
  const retdata = [];
  for (let i = 0; i < allCoach.length; i += 1) {
    const element = allCoach[i];
    const item = element.toJSON();

    const ordercnt = await models.SignPrivateLesson.count({
      where: {
        orderDate: dayStart,
        orderCoachId: element.id,
        storeid,
      },
    });

    const coachOrderedTime = [];
    // 教练课程已满
    const orderCoach = await models.SignPrivateLesson.findAll({
      where: {
        orderDate: dayStart,
        orderCoachId: coachId,
        storeid,
        orderStatus: { lt: 2, gt: 0 },
      },
    });

    for (let j = 0; j < orderCoach.length; j += 1) {
      coachOrderedTime.push(orderCoach[i].orderTime);
    }

    item.orderStatus = 0; // 可约
    if (element.dailyLessonNumLimit <= ordercnt) {
      item.orderStatus = 1; // 课满
    }

    if (element.pauseWorkBeginDate <= now && now <= element.pauseWorkEndDate) {
      item.orderStatus = 2; // 请假
    }

    let bInsert = true;

    if (workType) {
      if (workType === 1 && item.orderStatus === 2) {
        bInsert = false;
      } else if (workType === 2 && item.orderStatus !== 2) {
        bInsert = false;
      } else if (workType === 3 && item.orderStatus !== 0) {
        bInsert = false;
      }
    }

    if (element.allowCourse && courseId > 0) {
      bInsert = false;
      const courses = element.allowCourse.split(',');
      for (let j = 0; j < courses.length; j += 1) {
        if (parseInt(courses[j], 10) === courseId) {
          bInsert = true;
          break;
        }
      }
      // if (courses.length < 1) bInsert = true;
    }

    const posinfo = await models.RoleMap.findOne({ where: { uid: item.position } });
    if (posinfo) {
      item.positionname = posinfo.name;
    }

    item.allowCourseList = item.allowCourse;
    item.description = item.descript;
    item.images = (item.images && JSON.parse(item.images)) || [];
    item.orderedCnt = ordercnt;
    item.coachOrderedTime = coachOrderedTime;
    if (bInsert) { retdata.push(item); } else subCnt += 1;
  }
  totalCount -= subCnt;
  return { count: totalCount, coachs: retdata };
};

/** ****************************** Position ****************************** */
export const positionAdd = async (data, storeid) => {
  $required('name', data.name);
  const name = data.name;

  let ret = 0;

  if (name.length < NameLengthMin || NameLengthMax < name.length) { return ERROR.nameInvalid('长度限制.'); }

  ret = await models.CoachPosition.count({ where: { name, storeid } });
  if (ret > 0) {
    return ERROR.nameInvalid('名字已存在.');
  }

  const retdata = await models.CoachPosition.create({ name, storeid });
  if (!retdata) {
    return false;
  }
  return true;
};

export const positionUpdate = async (data, storeid) => {
  $required('id', data.id);
  $required('name', data.name);
  const id = data.id;
  const name = data.name;

  let ret = 0;

  if (name.length < NameLengthMin || NameLengthMax < name.length) { return ERROR.nameInvalid(' 长度限制.'); }

  ret = await models.CoachPosition.count({ where: { name, storeid } });
  if (ret > 0) {
    return ERROR.nameInvalid(' 名字已存在.');
  }

  const retdata = await models.CoachPosition.update({ name }, { where: { id, storeid } });
  if (!retdata) {
    return false;
  }

  return true;
};

export const positionDelete = async (data, storeid) => {
  $required('id', data.id);
  $required('name', data.name);
  const id = data.id;

  const ret = await models.CoachPosition.count({ where: { id, storeid } });
  if (ret <= 0) {
    return ERROR.employeePosition(` 职位 ${data.name} `);
  }

  const retdata = await models.CoachPosition.destroy({ where: { id, storeid } });
  if (!retdata) {
    return false;
  }
  return true;
};

export const positionQuery = async (storeid) => {
  const result = await models.CoachPosition.findAll({ where: { storeid } });
  return result;
};


export const getTodayCount = async (storeid) => {
  // Moment().format('YYYY-MM-DD');
  const dayStart = Moment().startOf('day').format('YYYY-MM-DD');
  const dayEnd = Moment().endOf('day').format('YYYY-MM-DD');

  const where = { signDate: { gte: dayStart, lte: dayEnd }, storeid };
  const signNumber = await models.SignPrivateLesson.sum('signNumber', { where });
  const signGiveNumber = await models.SignPrivateLesson.sum('signGiveNumber', { where });
  return signNumber + signGiveNumber;
};


export const workTimeUpdate = async (data, storeid) => {
  $required('id', data.id);
  $required('limit', data.limit);
  // $required('workBeginDate', data.workBeginDate);
  // $required('workEndDate', data.workEndDate);
  $required('weeks', data.weeks);
  $required('workTime', data.workTime); // hh-mm
  const id = data.id;
  const workTime = data.workTime;
  if (workTime.length < 1 || workTime.split('-').length < 2) {
    return ERROR.dateInvalid(`. workTime invalid ${workTime}.  hh:mm-hh:mm`);
  }
  let workBeginDate = null;
  if (!data.workBeginDate) {
    workBeginDate = Moment().format('YYYY-MM-DD');
  } else {
    workBeginDate = Moment(data.workBeginDate).format('YYYY-MM-DD');
  }
  let workEndDate = null;
  if (data.workEndDate) {
    workEndDate = Moment(data.workEndDate).format('YYYY-MM-DD');
  }
  const dailyLimit = Math.max(parseInt(data.limit, 10), 1);
  const dailyLessonNumLimit = dailyLimit > dailyLessonMaxNum ? dailyLessonMaxNum : dailyLimit;

  const weeks = data.weeks;
  for (let i = 0; i < weeks.length; i += 1) {
    const week = parseInt(weeks[i], 10);
    if (week < 0 || week > 6) {
      return ERROR.dateInvalid(`. weeks invalid ${week}`);
    }
  }

  const ret = await models.Coach.update({
    workTime, workBeginDate, workEndDate, dailyLessonNumLimit, weeks: weeks.join(','),
  }, { where: { id, storeid } });
  if (ret < 1) {
    return false;
  }

  return true;
};

export const pauseWorkTimeUpdate = async (data, storeid) => {
  $required('id', data.id);
  // $required('pauseWorkBeginDate', data.pauseWorkBeginDate);
  // $required('pauseWorkEndDate', data.pauseWorkEndDate);
  const id = data.id;
  const pauseWorkBeginDate = Moment(data.pauseWorkBeginDate).format('YYYY-MM-DD'); // data.pauseWorkBeginDate.split(' ')[0];
  const pauseWorkEndDate = Moment(data.pauseWorkEndDate).format('YYYY-MM-DD'); // data.pauseWorkEndDate.split(' ')[0];

  const d1 = Date.parse(`${pauseWorkBeginDate} 00:00:00`);
  const d2 = Date.parse(`${pauseWorkEndDate} 00:00:00`);
  if (d2 < d1) {
    return ERROR.dateInvalid(' pauseWorkTime date ');
  }

  const ret = await models.Coach.update(
    { pauseWorkBeginDate, pauseWorkEndDate },
    { where: { id, storeid } },
  );
  if (ret < 1) {
    return false;
  }

  return true;
};
