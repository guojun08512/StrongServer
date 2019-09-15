
import config from 'modules/config';
import fs from 'fs';
import uuid from 'uuid';

export const uploadFile = (filename, userinfo) => {
  const UUid = uuid.v4();
  const dir = `${config.get('UPLOAD')}/${UUid}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const srcdir = `${config.get('UPLOAD')}/${filename}`;
  const destdir = `${dir}/${filename}`;
  fs.copyFileSync(srcdir, destdir);
  fs.unlinkSync(srcdir);
  return `${config.get('HOST_URL')}/${UUid}/${filename}`;
}
