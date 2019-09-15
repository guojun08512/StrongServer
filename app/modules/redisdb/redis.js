import config from 'modules/config';
import redis from 'redis';
import logger from 'modules/logger';

export const tableIndex = {
  TEST: 10, // key--batchId  value--batch object
  huizong: 11, // 首页汇总
  base: 12, // 教练、工作人员
  cache: 13, // 缓存(每天购卡新会员)
  weixin: 14, // 微信
};

const client = redis.createClient(config.get('SERVER_REDIS_DB_URL'));

client.on('error', (error) => {
  logger.error(error);
});

const multiClient = async (job) => {
  // console.log(job);
  const multi = client.multi(job);
  return new Promise((resolve, reject) => {
    // const start = new Date();
    multi.exec((error, res) => {
      if (error) {
        reject(new Error(`Redis multiClient error:${error}`));
      } else {
        // logger.debug(`table ${job[0][1]}:${job[1][0]} ${job[1][1]} take ${(new Date()) - start} ms`);
        resolve(res[1]);
      }
    });
  });
};

export const multiCmds = async (dbIndex, cmds) => multiClient([['select', dbIndex], ...cmds]);
