import moment from 'moment';
import config from 'modules/config';
import { requestApi } from 'modules/request';
import * as Search from 'modules/search';
import models from 'modules/db/models';
import * as Employee from 'modules/employee';

export const queryPayOrder = async (data, authorization) => {
  const route = `${config.get('PAY_SERVER')}/pay/queryOrderList`;
  const params = {
    headers: {
      Authorization: authorization,
    },
    body: data,
  };
  const fr = await requestApi(route, 'POST', params);
  return fr;
};

export const coachAchievement = async (data, authorization) => {
  const route = `${config.get('PAY_SERVER')}/pay/coachAchievement`;
  const params = {
    headers: {
      Authorization: authorization,
    },
    body: data,
  };
  const fr = await requestApi(route, 'POST', params);
  return fr;
};

export const employeeAchievement = async (data, authorization) => {
  const route = `${config.get('PAY_SERVER')}/pay/employeeAchievement`;
  const params = {
    headers: {
      Authorization: authorization,
    },
    body: data,
  };
  const fr = await requestApi(route, 'POST', params);
  return fr;
};

export const queryOrderList = async (data, authorization, storeid) => {
  const param = data.param; // 姓名/电话
  const paytype = data.paytype; // 支付形式
  const vipcardid = data.vipcardid; // 会员卡id
  const ascription = data.ascription; // 业绩归属
  const operation = data.operation; // 消费类型
  let startDate = data.startDate; // 开始时间
  let endDate = data.endDate; // 结束时间
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;

  const json = {};
  if (startDate === undefined && endDate === undefined) {
    startDate = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
    endDate = moment().format('YYYY-MM-DD HH:mm:ss');
  }
  json.startDate = startDate;
  json.endDate = endDate;

  if (param !== undefined) {
    const ret = await Search.searchData(param, authorization);
    const suggestions = ret.data.suggestions;
    const memberids = [];
    for (let i = 0; i < suggestions.length; i += 1) {
      memberids.push(suggestions[i].uid);
    }
    json.memberids = memberids;
  }

  json.paytype = paytype;
  json.vipcardid = vipcardid;
  json.ascription = ascription;
  json.operation = operation;
  json.storeid = storeid;
  json.pageCount = pageCount;
  json.curPage = curPage;

  const ret2 = await queryPayOrder(json, authorization);
  const count = ret2.ret.count;
  const total = ret2.ret.total;
  const orderInfo = ret2.ret.orderVec;
  const orderVec = [];
  for (let i = 0; i < orderInfo.length; i += 1) {
    const mInfo = await models.Member.findOne({
      include: [{
        model: models.PDMember,
        as: 'pdmembers',
        attributes: ['username'],
      }],
      where: {
        uid: orderInfo[i].memberid,
      },
    });
    const vcInfo = await models.VipCard.findOne({ where: { uid: orderInfo[i].vipcardid } });
    const ecInfo = await Employee.querySingleEmpAndCoach(orderInfo[i].ascription, storeid);
    const json1 = {
      createdAt: orderInfo[i].createdAt,
      username: mInfo.pdmembers.username,
      vipcardname: vcInfo.cardname,
      money: orderInfo[i].money,
      operation: orderInfo[i].operation,
      paytype: orderInfo[i].paytype,
      name: ecInfo.name,
      remark: orderInfo[i].remark,
    };
    orderVec.push(json1);
  }

  return {
    count,
    total,
    orderVec,
  };
};

export const queryCoachAchi = async (data, authorization, storeid) => {
  const startDate = data.startDate || moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'); // 开始日期
  const endDate = data.endDate || moment().endOf('month').format('YYYY-MM-DD HH:mm:ss'); // 结束日期
  const pageCount = data.pageCount || 2;
  const curPage = data.curPage || 1;

  const json = {
    startDate,
    endDate,
    storeid,
    pageCount,
    curPage,
  };
  const ret = await coachAchievement(json, authorization);
  const count = ret.ret.count;
  const achievementInfo = ret.ret.orderVec;
  const achVec = [];
  for (let i = 0; i < achievementInfo.length; i += 1) {
    const ascription = achievementInfo[i].ascription;
    const ecInfo = await Employee.querySingleEmpAndCoach(ascription, storeid);
    const json1 = {
      id: ascription,
      name: ecInfo.name,
      cellphone: ecInfo.cellphone,
      position: ecInfo.position,
      achievement: achievementInfo[i].total,
    };
    achVec.push(json1);
  }

  return {
    count,
    achVec,
  };
};

export const queryEmployeeAchi = async (data, authorization, storeid) => {
  const startDate = data.startDate || moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'); // 开始日期
  const endDate = data.endDate || moment().endOf('month').format('YYYY-MM-DD HH:mm:ss'); // 结束日期
  const pageCount = data.pageCount || 2;
  const curPage = data.curPage || 1;

  const json = {
    startDate,
    endDate,
    storeid,
    pageCount,
    curPage,
  };
  const ret = await employeeAchievement(json, authorization);
  const count = ret.ret.count;
  const achievementInfo = ret.ret.orderVec;
  const achVec = [];
  for (let i = 0; i < achievementInfo.length; i += 1) {
    const ascription = achievementInfo[i].ascription;
    const ecInfo = await Employee.querySingleEmpAndCoach(ascription, storeid);
    const json1 = {
      id: ascription,
      name: ecInfo.name,
      cellphone: ecInfo.cellphone,
      position: ecInfo.position,
      achievement: achievementInfo[i].total,
    };
    achVec.push(json1);
  }

  return {
    count,
    achVec,
  };
};
