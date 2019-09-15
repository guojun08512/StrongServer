import acl from 'modules/acl';
import ERROR, { $required } from 'modules/utils';
import models from 'modules/db/models';

// 添加角色
export const addRole = async (data, storeid) => {
  $required('name', data.name);
  $required('storeid', storeid);
  $required('resources', data.resources); // resource 验证
  $required('permissions', data.permissions); // permissions 验证
  $required('owner', data.owner); // 1教练 2工作人员
  const roleName = data.name.trim();
  const isAdmin = data.isAdmin || 0;
  const owner = data.owner;

  if (roleName.length < 2 || roleName.length > 10) { return ERROR.nameInvalid(); }

  const rnData = await models.RoleMap.findOne({ where: { name: roleName, storeid } });
  if (rnData) return ERROR.nameInvalid(' 名字已存在 ');

  // 事务begin
  let ret = await models.RoleMap.create({
    name: roleName, isAdmin, owner, storeid,
  });
  if (!ret) return false;

  const role = `${ret.name}_${ret.uid}`;
  ret = acl.createAcl().allow(role, data.resources, data.permissions);
  if (!ret) return false;
  // 事务end
  return true;
};

export const updateRole = async (data, storeid) => {
  $required('roleId', data.roleId);
  const rnData = await models.RoleMap.findOne({
    where: {
      uid: data.roleId,
      storeid,
    },
  });
  if (!rnData) return ERROR.roleInvalid(' role not exist ');

  if (!data.resources && !data.permissions) return true;
  if (!data.resources || !data.permissions) return false;

  const roleName = rnData.rolename;
  const hadRes = await acl.createAcl().whatResources(roleName);
  if (!hadRes) return false;

  const resources = data.resources; // resource 验证
  const permissions = data.permissions; // permissions 验证

  acl.createAcl().removeAllow(roleName, Object.keys(hadRes));
  if (resources.length < 1) {
    return true;
  }

  if (permissions.length < 1) {
    return true;
  }

  const ret = acl.createAcl().allow(roleName, resources, permissions);
  if (!ret) return false;

  return true;
};

export const deleteRole = async (data, storeid) => {
  $required('roleId', data.roleId);
  const roleId = data.roleId;

  const rnData = await models.RoleMap.findOne({ where: { uid: roleId, storeid } });
  if (!rnData) return ERROR.roleInvalid(' role not exist ');

  // 事务begin
  let ret = await rnData.destroy();
  if (!ret) return false;

  const role = `${rnData.name}_${rnData.uid}`;
  ret = await acl.createAcl().removeRole(role);
  if (!ret) return false;
  // 事务end

  return true;
};

export const queryRole = async (data, storeid) => {
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;

  const where = { storeid, isAdmin: 0 };
  const totalCount = await models.RoleMap.count({ where });
  const allData = await models.RoleMap.findAll({
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
    where,
  });
  for (let i = 0; i < allData.length; i += 1) {
    const item = allData[i];
    const users = await acl.createAcl().roleUsers(item.uid);
    item.users = users;
  }

  return { count: totalCount, data: allData };
};

export const queryRoleByName = async (roleName) => {
  $required('roleName', roleName);
  const params = roleName.split('_');
  const role = await models.RoleMap.findOne({
    where: {
      uid: params[1],
      name: params[0],
    },
  });
  return role;
};

export const queryResource = async (data) => {
  $required('uid', data.uid);
  $required('name', data.name);

  const rolename = `${data.name}_${data.uid}`;
  const resources = await acl.createAcl().whatResources(rolename);
  const keys = Object.keys(resources);
  const res = [];
  keys.map(k => res.push(...resources[k])); // eslint-disable-line
  return res;
};

export const copy = async (data, storeid) => {
  $required('roleId', data.roleId);
  $required('name', data.name);

  const roleId = data.roleId;
  const role = await models.RoleMap.findOne({ where: { uid: roleId, storeid } });
  if (!role) return ERROR.roleInvalid(' role not exist ');

  const resources = await acl.createAcl().whatResources(roleId);
  if (!resources) {
    return ERROR.roleInvalid(' resources not exist ');
  }

  const permissions = await acl.createAcl().allowedPermissions(roleId, Object.keys(resources));
  if (!permissions) return ERROR.roleInvalid(' permissions not exist ');

  const params = {
    resources,
    permissions,
    name: data.name,
    owner: role.owner,
  };

  const ret = await addRole(params, storeid);

  return ret;
};

/* #################################### new ################################################### */
// 添加角色 new
export const add = async (data, storeid) => {
  $required('name', data.name);
  $required('storeid', storeid);
  // $required('auths', data.auths);
  $required('owner', data.owner); // 1教练 2工作人员

  const roleName = data.name.trim();
  const isAdmin = data.isAdmin || 0;
  const owner = data.owner;

  if (roleName.length < 2 || roleName.length > 10) { return ERROR.nameInvalid(); }

  const rnData = await models.RoleMap.findOne({ where: { name: roleName, storeid } });
  if (rnData) return ERROR.nameInvalid(' 名字已存在 ');

  const ret = await models.RoleMap.create({
    name: roleName, isAdmin, owner, storeid,
  });
  if (!ret) return false;

  if (data.auths) {
    const roleId = ret[0].uid;
    const auths = data.auths;
    for (let i = 0; i < auths.length; i += 1) {
      const item = auths[i];
      if (!item) break;
      const resource = item.resource;
      const permissions = item.permissions;
      if (resource && permissions) {
        const result = await acl.createAcl().allow(roleId, resource, permissions);
        if (!result) return false;
      }
    }
  }
  return true;
};

function trimSpace(array) {
  for (let i = 0; i < array.length; i += 1) {
    if (array[i] === ' ' || array[i] === '' || array[i] == null || typeof (array[i]) === 'undefined') {
      array.splice(i, 1);
      i -= 1;
    }
  }
  return array;
}

// update new
export const update = async (data, storeid) => {
  $required('roleId', data.roleId);
  const roleId = data.roleId;
  const rnData = await models.RoleMap.findOne({
    where: {
      uid: roleId,
      storeid,
    },
  });
  if (!rnData) return ERROR.roleInvalid(' role not exist ');
  if (data.name) {
    const ret = await rnData.update({ name: data.name });
    if (!ret || ret[0] < 1) {
      return false;
    }
  }

  if (data.auths) {
    const auths = trimSpace(data.auths);
    if (auths.length > 0) {
      const resources = await acl.createAcl().whatResources(roleId);
      if (resources) {
        const keys = Object.keys(resources);
        for (let i = 0; i < keys.length; i += 1) {
          const key = keys[i];
          await acl.createAcl().removeAllow(roleId, key, resources[key]);
        }
      }

      for (let i = 0; i < auths.length; i += 1) {
        const item = auths[i];
        if (!item) break;
        const resource = item.resource;
        const permissions = item.permissions;
        const ret = await acl.createAcl().allow(roleId, resource, permissions);
        if (!ret) return false;
      }
    }
  }
  return true;
};

export const deleteR = async (data, storeid) => {
  $required('roleId', data.roleId);
  const roleId = data.roleId;

  const rnData = await models.RoleMap.findOne({ where: { uid: roleId, storeid } });
  if (!rnData) return ERROR.roleInvalid(' role not exist ');

  // 事务begin
  let ret = await rnData.destroy();
  if (!ret) return false;

  ret = await acl.createAcl().removeRole(roleId);
  if (!ret) return false;
  // 事务end

  return true;
};

export const query = async (data, storeid) => {
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;
  const isAdmin = data.isAdmin || 0;

  const where = { storeid, isAdmin };
  const totalCount = await models.RoleMap.count({ where });
  const allData = await models.RoleMap.findAll({
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
    where,
  });
  for (let i = 0; i < allData.length; i += 1) {
    const item = allData[i].toJSON();
    const auths = await acl.createAcl().whatResources(item.uid);
    item.auths = auths;
  }

  return { count: totalCount, data: allData };
};

export const copyX = async (data, storeid) => {
  $required('roleId', data.roleId);
  $required('name', data.name);

  const roleId = data.roleId;
  const role = await models.RoleMap.findOne({ where: { uid: roleId, storeid } });
  if (!role) return ERROR.roleInvalid(' role not exist ');

  const resources = await acl.createAcl().whatResources(roleId);
  if (!resources) {
    return ERROR.roleInvalid(' resources not exist ');
  }

  const auths = [];
  const keys = Object.keys(resources);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const item = {
      resource: key,
      permissions: resources[key],
    };
    auths.push(item);
  }

  const params = {
    name: data.name,
    owner: role.owner,
    auths,
  };

  const ret = await add(params, storeid);

  return ret;
};
