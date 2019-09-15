import ERROR, { $required } from 'modules/utils';
import { sendSMS } from 'modules/noteservice';
import models from 'modules/db/models';
import Moment from 'moment';
import { createToken } from 'modules/users/auth';
import config from '../../../config/config';

const GetCellPhoneMap = async () => {
  const myMap = new Map();
  const cellphones = config.get('Cellphones').split(',');
  for (let i = 0; i < cellphones.length; i += 1) {
    myMap[cellphones[i]] = config.get('PassWord');
  }
  console.log(myMap);
  return myMap;
};

// 获取验证码
export const GetCode = async (data) => {
  $required('cellphone', data.cellphone);
  const cellphone = data.cellphone;

  let code = '';
  for (let i = 0; i < 4; i += 1) {
    code += Math.floor(Math.random() * 10);
  }
  const json = {};
  json.code = code;
  json.product = 'jsf';
  console.log(JSON.stringify(json));

  const coInfo = await models.VeriCode.findOne({
    where: {
      cellphone,
    },
  });
  let ret = null;
  if (coInfo) {
    const uTime = Moment(coInfo.updatedAt).format('YYYY-MM-DD HH:mm:ss');
    const sec = Moment().diff(uTime, 'seconds');
    console.log(sec);
    if (sec <= 60) {
      return ERROR.notRepeat();
    }
    ret = coInfo.update({
      code,
    });
  } else {
    ret = await models.VeriCode.create({
      cellphone, code,
    });
  }
  if (!ret) {
    return false;
  }
  const options = {
    PhoneNumbers: cellphone,
    TemplateParam: JSON.stringify(json),
  };
  try {
    sendSMS(options);
  } catch (e) {
    console.log(e);
    return ERROR.sendSMSError();
  }
  return true;
};

// 登陆
export const Connect = async (data) => {
  $required('cellphone', data.cellphone);
  $required('code', data.code);
  const cellphone = data.cellphone;
  const code = data.code;

  const myMap = await GetCellPhoneMap();
  const decode = myMap[cellphone];
  if (decode === code) {
    const timestamp = Moment().valueOf();
    let username = '健身用户';
    username += timestamp.toString();
    const [rs] = await models.PDMember.findOrCreate({
      where: {
        cellphone,
      },
      defaults: {
        cellphone,
        username,
        birthday: '1970-01-01',
      },
    });
    const user = rs.dataValues;
    const info = { uid: user.uid };
    return {
      token: createToken(info),
    };
  }

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
  console.log(sec);
  if (sec > 60 * 5) {
    return ERROR.codeOverTime();
  }

  const timestamp = Moment().valueOf();
  let username = '健身用户';
  username += timestamp.toString();
  const [rs] = await models.PDMember.findOrCreate({
    where: {
      cellphone,
    },
    defaults: {
      cellphone,
      username,
      birthday: '1970-01-01',
    },
  });
  const user = rs.dataValues;
  const info = { uid: user.uid };
  return {
    token: createToken(info),
  };
};

// 微信登陆
export const WxLogin = async (data) => {
  $required('uid', data.uid);
  const wxunionid = data.uid;
  const pdInfo = await models.PDMember.findOne({
    where: {
      wxunionid,
    },
  });
  if (!pdInfo) {
    return {
      isExist: 0,
    };
  }
  const info = { uid: pdInfo.uid };
  return {
    token: createToken(info),
    isExist: 1,
    cellphone: pdInfo.cellphone,
  };
};

// 微信绑定手机
export const WxBindPhone = async (data) => {
  $required('cellphone', data.cellphone);
  $required('code', data.code);
  $required('uid', data.uid);
  $required('cellphone', data.cellphone);
  $required('code', data.code);
  $required('name', data.name);
  $required('icon', data.icon);
  $required('sex', data.sex);
  const wxunionid = data.uid;
  const cellphone = data.cellphone;
  const code = data.code;
  const username = data.name;
  const avatar = data.icon;
  const sex = data.sex === '男' ? 1 : 2;

  // 默认验证码
  const myMap = await GetCellPhoneMap();
  const decode = myMap[cellphone];
  if (decode === code) {
    const [rs] = await models.PDMember.findOrCreate({
      where: {
        cellphone,
      },
      defaults: {
        cellphone,
        username,
        birthday: '1970-01-01',
        sex,
        avatar,
        wxunionid,
      },
    });
    const user = rs.dataValues;
    const info = { uid: user.uid };
    return {
      token: createToken(info),
    };
  }

  // 检查验证码有效性
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
  console.log(sec);
  if (sec > 60 * 5) {
    return ERROR.codeOverTime();
  }

  const wxInfo = await models.PDMember.findOne({
    where: {
      wxunionid,
    },
  });
  if (wxInfo) {
    return ERROR.WxIdError();
  }

  const pdmInfo = await models.PDMember.findOne({
    where: {
      cellphone,
    },
  });
  let rs = [];
  if (pdmInfo) {
    // 如果手机号绑定了会员
    rs = await pdmInfo.update({
      wxunionid,
    });
  } else {
    // 如果手机号未绑定会员
    rs = await models.PDMember.create({
      wxunionid, cellphone, username, avatar, sex, birthday: '1970-01-01',
    });
  }
  if (!rs) {
    return ERROR.WxLoingError();
  }
  const user = rs.dataValues;
  const info = { uid: user.uid };
  return {
    token: createToken(info),
  };
};
