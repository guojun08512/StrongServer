
import _ from 'lodash';
import acl from 'modules/acl';
import logger from 'modules/logger';
import ERROR from 'modules/utils';
import url from 'url';
// import * as Permission from 'modules/permissions';
import { OPSRole } from 'modules/users';

export const toArray = (val) => {
  if (val) {
    if (typeof val === 'string') {
      return [val];
    } else if (_.isArray(val)) {
      return val;
    }
  }
  return [];
};

// const doCheckPermission = async (uid, resource, requiredPermissions) => acl.createAcl().isAllowed(uid, resource, requiredPermissions);

export function checkRole() {
  return async (ctx, next) => {
    const routeInfos = url.parse(ctx.href).pathname.split('/');
    if (routeInfos.includes('app')) {
      return next();
    }
    if (routeInfos.includes('login')) {
      return next();
    }
    // if (ctx.userInfo) {
    //   const roles = await acl.createAcl().userRoles(ctx.userInfo.uid);
    //   if (roles.length <= 0) {
    //     logger.error(`User(${ctx.userInfo.username}) ${ctx.method} ${ctx.href} denied.`);
    //     return ERROR.accessDenied();
    //   }
    //   if (roles.includes(OPSRole.SuperAdmin)) {
    //     return next();
    //   }
    //   let isAllowed = false;
    //   const roleInfo = await Permission.queryRoleByName(roles[0]);
    //   if (roleInfo) {
    //     const resource = routeInfos[routeInfos.length - 1];
    //     const checkStatus = await doCheckPermission(ctx.userInfo.uid, resource, ctx.method);
    //     if (checkStatus) {
    //       isAllowed = true;
    //     }
    //   }
    //   if (isAllowed) {
    //     return next();
    //   }
    //   logger.error(`User(${ctx.userInfo.username}) ${ctx.method} ${ctx.href} denied.`);
    // }
    // return ERROR.accessDenied();
    return next();
  };
}

export function checkSuperAdmin() {
  return async (ctx, next) => {
    if (ctx.userInfo) {
      const roles = await acl.createAcl().userRoles(ctx.userInfo.uid);
      if (roles.length <= 0) {
        logger.error(`User(${ctx.userInfo.username}) ${ctx.method} ${ctx.href} denied.`);
        return ERROR.accessDenied();
      }
      if (roles.includes(OPSRole.SuperAdmin)) {
        return next();
      }
      logger.error(`User(${ctx.userInfo.username}) ${ctx.method} ${ctx.href} denied.`);
    }
    return ERROR.accessDenied();
  };
}
