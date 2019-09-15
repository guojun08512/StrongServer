
import models from 'modules/db/models';
import ERROR, { $required } from 'modules/utils';
import acl from 'modules/acl';
import Moment from 'moment';
import { createToken } from './auth';

export const getUser = id => models.User.findById(id);
export const getUserByName = username => models.User.findOne({ where: { username } });

export const getUsers = () => models.User.findAll();

export const register = async (info) => {
  const [rs] = await models.User.findOrCreate({
    where: {
      username: info.username,
    },
    defaults: {
      ...info,
    },
  });
  const user = rs.dataValues;
  if (info.role) {
    const existed = await acl.createAcl().hasRole(user.uid, info.role);
    if (!existed) {
      await acl.createAcl().addUserRoles(user.uid, info.role);
    }
  }
  return user;
};

export const authenticate = async (username, password) => {
  const user = await models.User.findOne({
    where: { username, password },
  });
  if (!user) {
    ERROR.userNotFound();
  }
  const roles = await acl.createAcl().userRoles(user.uid);
  const info = { uid: user.uid, username, roles }; // eslint-disable-line
  const umInfo = await models.UserMap.findAll({
    where: {
      userid: user.uid,
    },
  });
  // 场馆信息
  const storesInfo = [];
  for (let i = 0; i < umInfo.length; i += 1) {
    const rolename = umInfo[i].rolename;
    const storeid = umInfo[i].storeid;
    const sInfo = await models.Store.findOne({
      where: {
        uid: storeid,
      },
    });
    if (sInfo) {
      const json = {};
      json.storeID = storeid;
      json.storeName = sInfo.storename;
      json.storePhone = sInfo.storephone;
      json.storeAddr = sInfo.storeaddr;
      json.weChat = sInfo.wechat;
      json.mail = sInfo.mail;
      json.rolename = rolename;
      storesInfo.push(json);
    }
  }
  return {
    token: createToken(info),
    storesInfo,
  };
};

export const updateUser = async (uid, info) => {
  const r = await models.User.update(info, { where: { uid } });
  if (r.length < 1) {
    ERROR.userNotFound();
  }
  await models.UserMap.update(info, {
    where: {
      userid: uid,
    },
  });
  return getUser(uid);
};

export const deleteUser = async (uid) => {
  const r = models.User.update({ deleted: true }, { where: { uid } });
  if (r.length < 1) {
    ERROR.userNotFound();
  }
  return true;
};

export const CellPhoneRegist = async (data) => {
  $required('username', data.username);
  $required('sex', data.sex);
  $required('cellphone', data.cellphone);
  $required('code', data.code);
  $required('password', data.password);
  const username = data.username; // 姓名
  const sex = data.sex; // 性别
  const cellphone = data.cellphone; // 电话号码
  const code = data.cade; // 验证码
  const password = data.password; // 密码

  const coInfo = await models.VeriCode.findOne({
    where: {
      cellphone, code,
    },
  });
  if (!coInfo) {
    return ERROR.authCodeError();
  }

  const uTime = Moment(coInfo.updatedAt).format('YYYY-MM-DD HH:mm:ss');
  const sec = Moment().diff(uTime, 'seconds');
  if (sec > 60 * 5) {
    return ERROR.codeOverTime();
  }

  const uInfo = await models.User.findOne({
    where: {
      cellphone,
    },
  });
  if (uInfo) {
    return ERROR.CellPhoneError();
  }

  const res = await models.User.create({
    username, sex, cellphone, password,
  });
  if (!res) {
    return ERROR.CreateUserError();
  }

  return true;
};

export const ForgetPassword = async (data) => {
  $required('cellphone', data.cellphone);
  $required('code', data.code);
  $required('password', data.password);
  const cellphone = data.cellphone;
  const code = data.code;
  const password = data.password;

  const coInfo = await models.VeriCode.findOne({
    where: {
      cellphone, code,
    },
  });
  if (!coInfo) {
    return ERROR.authCodeError();
  }

  const uTime = Moment(coInfo.updatedAt).format('YYYY-MM-DD HH:mm:ss');
  const sec = Moment().diff(uTime, 'seconds');
  if (sec > 60 * 5) {
    return ERROR.codeOverTime();
  }

  const res = await models.User.update({
    password,
  }, {
    where: {
      cellphone,
    },
  });
  if (!res) {
    return Error.UpdateUserError();
  }
  return true;
};
