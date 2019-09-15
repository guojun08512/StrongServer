
import fs from 'fs';
import path from 'path';
import requestPromise from 'request-promise';
import logger from 'modules/logger';
import { formList } from 'modules/uploadsdk';
import * as Calc from './md5sum';

const createBatch = async (route, token, dicomCount) => {
  const fr = await requestPromise.post({
    uri: `${route}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: {
      dicomCount,
    },
    json: true,
  });
  if (fr.code !== 200) {
    throw new Error(fr.errMsg);
  }
  return fr.data.uploadBatch;
};

const readAllfile = (localpath, allfiles) => {
  const tmppath = localpath;
  const files = fs.statSync(localpath);
  if (files.isDirectory()) {
    const ffs = fs.readdirSync(tmppath);
    ffs.map((f) => {
      const fpath = path.join(tmppath, f);
      const ff = fs.statSync(fpath);
      if (ff.isDirectory()) {
        readAllfile(fpath, allfiles);
      } else {
        allfiles.push(fpath);
      }
      return true;
    });
  }
};

const getToken = async (route, username, password) => {
  const fr = await requestPromise.post({
    uri: `${route}`,
    body: {
      username,
      password,
    },
    json: true,
  });
  if (fr.code !== 200) {
    throw new Error(fr.errMsg);
  }
  return fr.data.token;
};

const createReport = async (host, batchToken, token, fileIdArr) => {
  const reports = [];
  const obj = {
    StudyInstanceUID: '1.2.840.113564.118796721496052.25948.636295754604415940.491',
    src: { fileId: fileIdArr[0] },
  };
  reports.push(obj);
  console.log('--reports---', reports);
  console.log(`${host}/v2/batch/report`);
  const fr = await requestPromise.post({
    uri: `${host}/v2/batch/report`,
    body: {
      reports,
    },
    headers: {
      Authorization: `Bearer ${token}`,
      'x-meta-content-batchtoken': batchToken,
    },
    json: true,
  });
  if (fr.code !== 200) {
    throw new Error(fr.errMsg);
  }
  return fr.data;
};

const completedBatch = async (host, batchToken, token) => {
  const fp = await path.join('test/utils', 'mailinfo');
  let data = await fs.readFileSync(fp);
  data = JSON.parse(data);
  const fr = await requestPromise.post({
    uri: `${host}/v2/batch/completed`,
    body: {
      emailInfo: data.emailInfo,
    },
    headers: {
      Authorization: `Bearer ${token}`,
      'x-meta-content-batchtoken': batchToken,
    },
    json: true,
  });
  if (fr.code !== 200) {
    throw new Error(fr.errMsg);
  }
  return fr.data;
};

const main = async () => {
  let host = 'http://127.0.0.1:7001';
  let route = `${host}/v1/users/login`;
  const token = await getToken(route, 'jung', 'guojun08512');
  route = `${host}/v1/batch/`;
  const batchToken = await createBatch(route, token, 10);
  // const selfpath = '/Users/guojun/Documents/LCAZ/CTA/BQGL/BQGL';
  const selfpath = '/Users/guojun/Documents/LCAZ/CTA/HLSH/HLSH';
  let fileList = [];
  readAllfile(selfpath, fileList);
  fileList = fileList.filter(f => (f.indexOf('.DS_Store') === -1));
  let checkpoint = null;
  const onProgress = async (param1, cp) => {
    checkpoint = cp;
  };
  // route = 'http://10.10.2.233:5000/v2';
  route = 'http://10.10.0.187:5000/v2';
  const uploader = formList(fileList, token, route, { timeout: 60000, retryCount: 0, isCheckMd5: true });
  const delay = ms => new Promise(res => setTimeout(res, ms));
  try {
    let begin = null;
    const onStarted = async (param) => {
      begin = new Date();
      console.log('onStarted ===', param);
    };
    const onPaused = async (param) => {
      console.log('onPaused ===', param);
    };
    const onResumed = async (param) => {
      console.log('onResumed ===', param);
    };
    const onFinished = async (param) => {
      console.log('onFinished ===', param);
      host = 'http://127.0.0.1:7001';
      const fileIdArr = (fileIds) => {
        let idArr = [];
        for (let key in fileIds) { // eslint-disable-line
          idArr.push(key);
        }
        return idArr;
      };
      host = 'http://127.0.0.1:7001';
      await createReport(host, batchToken, token, fileIdArr(checkpoint.fileIds));
      await completedBatch(host, batchToken, token);
    };
    const onError = async (param) => {
      console.log('onError ====', JSON.stringify(param));
    }

    await uploader.setListener({ onStarted, onProgress, onPaused, onResumed, onFinished, onError });
    uploader.start(batchToken);
    // await delay(11500);
    // await uploader.pause();
    // await delay(6000);
    // console.log('checkpoint ===', checkpoint);
    // await uploader.resume(checkpoint);
    // await delay(6000);
    // await uploader.pause();
    // await delay(6000);
    // console.log('checkpoint ===', checkpoint);
    // await uploader.resume(checkpoint);
    // await delay(6000);
    // await uploader.pause();
    // await delay(6000);
    // console.log('checkpoint ===', checkpoint);
    // await uploader.resume(checkpoint);    
    // await uploader.resume(checkpoint);
  } catch (e) {
    console.log('sssssss====', e); // eslint-disable-line
  }
};

main();
