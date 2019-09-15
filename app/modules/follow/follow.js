import models from 'modules/db/models';
import { $required } from 'modules/utils';

export const add = async (data) => {
  $required('memberid', data.memberid);
  $required('personnel', data.personnel);
  $required('mode', data.mode);
  const memberid = data.memberid;
  const personnel = data.personnel;
  const mode = data.mode;
  const remark = data.remark;

  const ret = await models.Follow.create({
    memberid, personnel, mode, remark,
  });

  if (!ret) {
    return false;
  }
  return true;
};

export const deleteF = async (data) => {
  $required('uid', data.uid);
  const uid = data.uid;

  const ret = await models.Follow.update({
    deleted: 1,
  }, {
    where: {
      uid,
    },
  });

  if (!ret) {
    return false;
  }
  return true;
};
