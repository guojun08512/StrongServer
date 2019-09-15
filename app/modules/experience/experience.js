import models from 'modules/db/models';
import ERROR, { $required } from 'modules/utils';
import Moment from 'moment';
import * as redisModels from 'modules/redisdb';

const NameLengthMin = 2;
const NameLengthMax = 24;
// 手机号正则
const phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;

/* **************** 预约 ***************** */
export const add = async (data, storeid) => {
  $required('name', data.name);
  $required('phone', data.phone);
  $required('employeeId', data.employeeId);
  $required('ordertime', data.ordertime);
  // $required('storeid', storeid);
  // $required('remark', data.remark);

  const name = data.name;
  const phone = data.phone;
  const employeeId = data.employeeId;
  const ordertime = Moment(data.ordertime).format('YYYY-MM-DD');
  const remark = data.remark;

  // let ret = 0;
  if (name.length < NameLengthMin || NameLengthMax < name.length) {
    return ERROR.nameInvalid(' 长度限制');
  }

  if (!phoneReg.test(phone)) {
    return ERROR.phoneInvalid();
  }

  const ret = await models.Employee.count({ where: { id: data.employeeId } });

  if (ret < 1) {
    return ERROR.employeeInvalid();
  }

  const retdata = await models.Experience.create({
    name, phone, employeeId, ordertime, remark, storeid,
  });
  if (!retdata) {
    return false;
  }

  redisModels.Add(redisModels.tableIndex.huizong, `Experience_${storeid}`, retdata.id, JSON.stringify(retdata));

  return true;
};

export const update = async (id, data, storeid) => {
  $required('name', data.name);
  $required('phone', data.phone);
  $required('employeeId', data.employeeId);

  const name = data.name;
  const phone = data.phone;
  const employeeId = data.employeeId;
  const remark = data.remark;

  // let ret = 0;
  if (name.length < NameLengthMin || NameLengthMax < name.length) {
    return ERROR.nameInvalid(' 长度限制');
  }

  if (!phoneReg.test(phone)) {
    return ERROR.phoneInvalid();
  }

  const retcnt = await models.Employee.count({ where: { id: data.employeeId, storeid } });

  if (retcnt < 1) {
    return ERROR.employeeInvalid();
  }

  const ret = await models.Experience.update({
    name, phone, employeeId, remark,
  }, { where: { id, storeid } });
  if (!ret || ret[0] < 1) {
    return false;
  }

  const row = await models.Experience.findOne({ where: { id, storeid } });
  redisModels.Update(redisModels.tableIndex.huizong, `Experience_${storeid}`, row.id, JSON.stringify(row));

  return true;
};

export const deleteRecord = async (id, storeid) => {
  let ret = 0;
  ret = await models.Experience.destroy({ where: { id, storeid } });
  if (!ret) {
    return false;
  }

  redisModels.Delete(redisModels.tableIndex.huizong, `Experience_${storeid}`, id);
  return true;
};

export const getAllData = async (data, storeid) => {
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;

  const where = { storeid };
  if (data.name) {
    where.name = data.name;
  }

  if (data.employeeId) {
    where.employeeId = data.employeeId;
  }

  if (data.ordertime) {
    where.ordertime = Moment(data.ordertime).endOf('day').format('YYYY-MM-DD');
  }

  const alldata = await models.Experience.findAll({
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
    where,
    include: {
      attributes: ['id', 'name'],
      model: models.Employee,
      as: 'employee',
      required: false,
    },
    // logging: console.log,
  });

  const totalCount = await models.Experience.count({ where });

  return { count: totalCount, result: alldata };
};

export const getTodayCount = async (storeid) => {
  // Moment().format('YYYY-MM-DD');
  const dayStart = Moment().startOf('day').format('YYYY-MM-DD');
  const dayEnd = Moment().endOf('day').format('YYYY-MM-DD');

  const where = { enterTime: { gte: dayStart, lte: dayEnd }, storeid };
  const totalCount = await models.Experience.count({ where });
  return totalCount;
};

/* **************** 体验 ***************** */
export const enter = async (data, storeid) => {
  $required('id', data.id);
  // const flag = data.flag;
  // if (!flag) {
  //   return false;
  // }

  const day = Moment().format('YYYY-MM-DD');

  const retdata = await models.Experience.update({
    remark: data.remark, operaFlag: true, enterTime: day,
  }, { where: { id: data.id, storeid } });

  if (!retdata || retdata[0] < 1) {
    return false;
  }

  const row = await models.Experience.findOne({ where: { id: data.id, storeid } });
  await redisModels.Update(redisModels.tableIndex.huizong, `Experience_${storeid}`, row.id, JSON.stringify(row));

  return true;
};

export const leave = async (data, storeid) => {
  $required('id', data.id);
  $required('leavetime', data.leavetime);

  const retdata = await models.Experience.update({
    leavetime: Moment(data.leavetime).format('YYYY-MM-DD'), remark: data.remark,
  }, { where: { id: data.id, storeid } });

  if (!retdata) {
    return false;
  }
  return true;
};

export const cancel = async (data, storeid) => {
  $required('id', data.id);
  // $required('flag', data.flag);
  // const flag = data.flag;
  // if (flag) {
  //  return false;
  // }
  const retdata = await models.Experience.update({
    type: 0, operaFlag: false, leavetime: '',
  }, { where: { id: data.id, storeid } });

  if (!retdata || retdata[0] < 1) {
    return false;
  }

  const row = await models.Experience.findOne({ where: { id: data.id, storeid } });
  redisModels.Update(redisModels.tableIndex.huizong, `Experience_${storeid}`, row.id, JSON.stringify(row));

  return true;
};

