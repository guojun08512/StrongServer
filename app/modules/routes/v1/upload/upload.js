
import Router from 'koa-router';
import multer from 'koa-multer';
import config from 'modules/config';
import * as Upload from 'modules/upload';

const storage = multer.diskStorage({
  // 文件保存路径
  destination: (req, file, cb) => cb(null, config.get('UPLOAD')),
  // 修改文件名称
  filename: (req, file, cb) => {
    const fileFormat = file.originalname; // 以点分割成数组，数组的最后一项就是后缀名
    cb(null, fileFormat);
  },
});


const uploadSetting = multer({ storage });

async function uploadFile(ctx) {
  const filename = ctx.req.file.filename;
  const fileurl = await Upload.uploadFile(filename, ctx.userInfo);
  ctx.success({ fileurl }, 'upload file success!');
}

const router = Router();
const routers = router
  .post('/', uploadSetting.single('file'), uploadFile);

module.exports = routers;
