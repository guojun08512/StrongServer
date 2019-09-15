import models from 'modules/db/models';
import ERROR, { $required } from 'modules/utils';

const NameLengthMin = 1;
const NameLengthMax = 10;

export const add = async (data, storeid) => {
  $required('parentid', data.parentid);
  $required('name', data.name);
  $required('gtype', data.gtype);
  $required('treetype', data.treetype);

  const parentid = parseInt(data.parentid, 10);
  const name = data.name;
  const gtype = data.gtype;
  const treetype = parseInt(data.treetype, 10);

  const db = models.EmployeeGroup;
  let ret = 0;

  // 只有一个主组
  if (parentid === 0) {
    ret = await db.count({ where: { parentid: 0, treetype, storeid } });

    if (ret > 0) {
      return ERROR.mainGroupLimit(); // eslint-disable-line
    }
  }

  if (name.length < NameLengthMin || NameLengthMax < name.length) {
    return ERROR.nameInvalid('长度限制');
  }

  // 名字唯一
  ret = await db.count({
    where: {
      parentid, name, storeid, treetype,
    },
  });
  if (ret > 0) {
    return ERROR.groupNameExist();
  }
  // 类型必须等于1
  if (treetype !== 1) {
    return ERROR.groupTreeTypeFail();
  }
  ret = await db.create({
    parentid, name, gtype, treetype, storeid,
  });
  if (!ret) {
    return ERROR.groupCreatFail();
  }
  return true;
};

export const update = async (data, storeid) => {
  $required('id', data.id);
  $required('name', data.name);
  $required('gtype', data.gtype);
  const id = data.id;
  const name = data.name;
  // const gtype = data.gtype;

  const db = models.EmployeeGroup;
  let ret = 0;

  ret = await db.count({ where: { name, storeid } });

  if (ret > 0) {
    return ERROR.groupNameExist();
  }

  ret = await db.update({ name }, { where: { id, storeid } });
  if (!ret) {
    ERROR.groupUpdateFail();
  }
  return true;
};

export const deleteR = async (data, storeid) => {
  $required('id', data.id);
  const id = data.id;

  const db = models.EmployeeGroup;
  let ret = 0;

  ret = await db.count({ where: { parentId: id, storeid } });

  if (ret > 0) {
    return ERROR.groupDeleteFail('子节点大于1.');
  }

  const row = await db.findOne({ where: { id, storeid } });
  if (!row) {
    return ERROR.groupDeleteFail(' 不存在.');
  }

  const parentId = row.get('parentId');
  ret = await db.destroy({ where: { id, storeid } });
  if (!ret) {
    return ERROR.groupDeleteFail();
  }

  // 工作人员的组id更新为 parentId。
  ret = await models.Employee.update({ groupId: parentId }, { where: { groupId: id, storeid } });

  return true;
};

export const query = async storeid => models.EmployeeGroup.findAll({ where: { storeid } });
