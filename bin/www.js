
import config from 'modules/config';
import app from 'server';
import cluster from 'cluster';
import logger from 'modules/logger';
import fs from 'fs';
import { ensureDBConnection } from 'modules/db';
import { userSetup } from 'modules/users';
import { initRedis } from 'modules/redisdb';
import { initSchedule } from 'modules/schedule';

const createWorkerHasDB = () => {
  if (cluster.isMaster) {
    ensureDBConnection()
      .then(() => {
        userSetup();
        initRedis();
        initSchedule();
        if (!fs.existsSync(config.get('UPLOAD'))) {
          fs.mkdirSync(config.get('UPLOAD'));
        }
        const uploader = config.get('WOKER_COUNT');
        for (let i = 0; i < uploader; i += 1) {
          const uploadWoker = cluster.fork();
          uploadWoker.env = 'normal';
          uploadWoker.send({ msgtype: 'normal' });
        }

        cluster.on('exit', (worker, code, signal) => {
          logger.error(`${worker.env}: ${worker.process.pid} died, signal: ${signal}|| code: ${code}`);
          if (worker.env === 'normal') {
            const uploadWoker = cluster.fork();
            uploadWoker.env = 'normal';
            uploadWoker.send({ msgtype: 'normal' });
          }
        });
      });
  } else {
    process.on('message', (msg) => {
      if (msg && msg.msgtype === 'normal') {
        app.listen(config.get('NODE_PORT'));
        logger.debug(`worker(${cluster.worker.id}) Listening on ${config.get('NODE_PORT')}`);
      }
    });
  }
};

createWorkerHasDB();
