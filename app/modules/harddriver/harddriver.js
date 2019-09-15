import models from 'modules/db/models';
import Sequelize from 'modules/db/sequelize';
import sequelize from 'sequelize';

const logger = require('modules/logger').default;

const FeeFlag = {
  NoArrears: 1, // 未欠费
  Arrears: 2, // 欠费
};

export const pwDoor = async (data) => {
  console.log(data);

  logger.msg(`harddriver::pwDoor data : ${JSON.stringify(data)}`);

  return {
    retcode: 1,
    errmsg: 'sucess',
  };
};

export const RfidDoor = async (data) => {
  // const devid = data.devid;
  const RFID = data.rfid;

  logger.msg(`harddriver::RfidDoor data : ${JSON.stringify(data)}`);

  const mInfo = await models.Member.findOne({
    // include: {
    //   model: models.Store,
    //   as: 'stores',
    //   attributes: ['uid'],
    //   where: {
    //     devid,
    //   },
    // },
    where: {
      RFID,
    },
  });
  if (!mInfo) {
    return {
      retcode: 0,
      errmsg: 'failed',
    };
  }

  return {
    retcode: 1,
    errmsg: 'sucess',
  };
};

export const cabinet = async (data) => {
  // const devid = data.devid;
  // const rfid = data.rfid;
  // const number = data.number;
  // const type = data.type;
  console.log(data);

  logger.msg(`harddriver::cabinet data : ${JSON.stringify(data)}`);

  return {
    retcode: 1,
    errmsg: 'sucess',
  };
};

export const showerAc = async (data) => {
  const devid = data.devid;
  const RFID = data.rfid;
  const sex = data.sex;

  const mInfo = await models.Member.findOne({
    include: [{
      model: models.Store,
      as: 'stores',
      attributes: ['uid'],
      where: {
        devid,
      },
    }, {
      model: models.PDMember,
      as: 'pdmembers',
      attributes: ['uid'],
      where: {
        sex,
      },
    }],
    where: {
      RFID,
    },
  });
  if (!mInfo) {
    return {
      retcode: 0,
      errmsg: 'failed',
    };
  }

  return {
    retcode: 1,
    errmsg: '',
  };
};

export const showerAuth = async (data) => {
  const devid = data.devid;
  const RFID = data.rfid;
  const sex = data.sex;
  const sql = 'SELECT * FROM `Showers` a\n' +
  'LEFT JOIN `Members` b ON a.`memberid` = b.`uid`\n' +
  'LEFT JOIN `PDMembers` c ON b.`pdmemberid` = c.`uid`\n' +
  'LEFT JOIN `Stores` d ON b.`storeid` = d.`uid`\n' +
  'LEFT JOIN `HardWare` e ON d.`uid` = e.`storeid`\n' +
  'LEFT JOIN `Showers` f ON f.`memberid` = b.`uid`\n' +
  'WHERE c.`sex` = ? AND b.`RFID` = ? AND e.`devid` = ?';
  const allInfos = await Sequelize.query(sql, { replacements: [sex, RFID, devid], type: sequelize.QueryTypes.SELECT });
  if (allInfos.length !== 1) {
    console.log(allInfos.length);
    return {
      retcode: 0,
      errmsg: 'failed',
    };
  }
  return {
    retcode: 1,
    errmsg: 'sucess',
    usedtime: allInfos[0].totaldate < allInfos[0].singledate ? allInfos[0].totaldate : allInfos[0].singledate,
    lasttime: allInfos[0].totaldate,
    arrflag: allInfos[0].totaldate <= 0 ? FeeFlag.Arrears : FeeFlag.NoArrears,
  };
};

export const showerReport = async (data) => {
  const devid = data.devid;
  const RFID = data.rfid;
  const lof = data.lof;
  const timestamp = data.timestamp;
  const sInfo = await models.Shower.findOne({
    include: {
      model: models.Member,
      as: 'members',
      attributes: ['uid'],
      include: {
        model: models.Store,
        as: 'stores',
        attributes: ['uid'],
        include: {
          model: models.HardWare,
          as: 'HardWares',
          attributes: ['uid'],
          where: {
            devid,
          },
        },
      },
      where: {
        RFID,
      },
    },
  });
  const curlof = parseInt(sInfo.totaldate - lof, 10) >= 0 ? parseInt(sInfo.totaldate - lof, 10) : 0;
  const ret = await Sequelize.transaction(t => sInfo.update({
    totaldate: curlof,
  }, {
    transaction: t,
  }).then((pmInfo) => {
    if (!pmInfo) throw new Error();
    return models.ShowerLog.create({
      lof,
      etime: timestamp,
      showerid: sInfo.uid,
    }, {
      transaction: t,
    });
  })).then((result) => {
    if (!result) throw new Error();
    return true;
  }).catch((err) => {
    console.log(err);
    return false;
  });
  if (!ret) {
    return {
      retcode: 0,
      errmsg: 'faild',
    };
  }
  return {
    retcode: 1,
    errmsg: 'sucess',
  };
};
