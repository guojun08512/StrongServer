import * as redisdb from 'modules/redisdb';

export const Add = async (dbIndex, tableName, id, value) => redisdb.multiCmds(dbIndex, [['HSET', tableName, id, value]]);

export const Update = async (dbIndex, tableName, id, value) => redisdb.multiCmds(dbIndex, [['HSET', tableName, id, value]]);

export const Get = async (dbIndex, tableName, id) => {
  const retdata = await redisdb.multiCmds(dbIndex, [['HGET', tableName, id]]);
  return retdata;
};

export const GetAll = async (dbIndex, tableName) => {
  const retdata = await redisdb.multiCmds(dbIndex, [['HGETALL', tableName]]);
  return retdata;
};

export const Delete = async (dbIndex, tableName, id) => redisdb.multiCmds(dbIndex, [['HDEL', tableName, id]]);

export const MutilDelete = async (dbIndex, tableName, ids) => {
  for (let i = 0; i < ids.length; i += 1) { await redisdb.multiCmds(dbIndex, [['HDEL', tableName, ids[i]]]); }
};

export const Expire = async (dbIndex, tableName, id, value) => redisdb.multiCmds(dbIndex, [['EXPIRE', tableName, id, value]]);

export const AddX = async (dbIndex, tableName, id, value, duration) => {
  const result = await Add(dbIndex, tableName, id, value);
  await Expire(dbIndex, tableName, id, duration);
  return result;
};

