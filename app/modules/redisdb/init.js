import * as redisdb from 'modules/redisdb';
import models from 'modules/db/models';

const logger = require('modules/logger').default;

const delay = ms => new Promise(res => setTimeout(res, ms));
async function initRedis() {
  try {
    // 教练
    const allCoachs = await models.Coach.findAll();
    for (let i = 0; i < allCoachs.length; i += 1) {
      const item = allCoachs[i];
      await redisdb.Update(redisdb.tableIndex.base, 'Coach', item.id, JSON.stringify(item));
    }

    // 课程
    const allCourse = await models.Course.findAll();
    for (let i = 0; i < allCourse.length; i += 1) {
      const item = allCourse[i];
      await redisdb.Update(redisdb.tableIndex.base, 'Course', item.uid, JSON.stringify(item));
    }

    // 体验
    const allExperience = await models.Experience.findAll();
    for (let i = 0; i < allExperience.length; i += 1) {
      const item = allExperience[i];
      await redisdb.Update(redisdb.tableIndex.huizong, `Experience_${item.storeid}`, item.id, JSON.stringify(item));
    }

    // 团课
    const allGroupLesson = await models.GroupLesson.findAll();
    for (let i = 0; i < allGroupLesson.length; i += 1) {
      const item = allGroupLesson[i];
      await redisdb.Update(redisdb.tableIndex.huizong, `GroupLesson_${item.storeid}`, item.id, JSON.stringify(item));
    }

    // 私课签到
    const allSignPrivateLesson = await models.SignPrivateLesson.findAll();
    for (let i = 0; i < allSignPrivateLesson.length; i += 1) {
      const item = allSignPrivateLesson[i];
      await redisdb.Update(redisdb.tableIndex.huizong, `SignPrivateLesson_${item.sotreid}`, item.id, JSON.stringify(item));
    }

    // 私课预约
    const allOrderCoach = await models.SignPrivateLesson.findAll({ where: { orderStatus: { gt: 0 } } });
    for (let i = 0; i < allOrderCoach.length; i += 1) {
      const item = allOrderCoach[i];
      await redisdb.Update(redisdb.tableIndex.huizong, `OrderCoach_${item.storeid}`, item.id, JSON.stringify(item));
    }

    return true;
  } catch (e) {
    logger.debug(`initRedis failed: ${e.message}`);
    await delay(1000);
    return initRedis();
  }
}

export { initRedis };
