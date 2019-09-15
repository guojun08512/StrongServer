import { base as BaseConfig } from 'modules/config';
import { register, OPSRole } from '.';

const uploaders = [
  {
    username: 'admin',
    password: '123456',
    role: OPSRole.SuperAdmin,
  },
];

const debuguploaders = [
  {
    username: 'admin',
    password: '123456',
    role: OPSRole.SuperAdmin,
  },
  {
    username: 'permission',
    password: '123456',
    role: OPSRole.SuperAdmin,
  },
];

const registerUsers = () => Promise.all(uploaders.map(a => register({
  ...a,
})));

const debugregisterUsers = () => Promise.all(debuguploaders.map(a => register({
  ...a,
})));

export const userSetup = async () => {
  if (BaseConfig.debug) {
    await debugregisterUsers();
  } else {
    await registerUsers();
  }
};
