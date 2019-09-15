import models from 'modules/db/models';
import Xlsx from 'node-xlsx';
import ERROR, { $required } from 'modules/utils';
import Sequelize from 'modules/db/sequelize';
import Moment from 'moment';

async function importLimitCard(sheets, storeid) {
  const curdata = Moment().format('YYYY-MM-DD HH:mm:ss');
  for (let i = 2; i < sheets.length; i += 1) {
    const cardname = sheets[i][0];
    const entitycardid = sheets[i][1];
    const opencardtime = Moment(sheets[i][2]).format('YYYY-MM-DD HH:mm:ss');
    const expirytime = Moment(sheets[i][3]).format('YYYY-MM-DD HH:mm:ss');
    const price = parseFloat(sheets[i][4]).toFixed(2);
    const username = sheets[i][5];
    const sex = sheets[i][6] === '男' ? 1 : 2;
    const cellphone = sheets[i][7];
    const birthday = Moment(sheets[i][8]).format('YYYY-MM-DD');
    const RFID = sheets[i][9];
    const water = sheets[i][10];

    await Sequelize.transaction(t => models.PDMember.findOrCreate({
      where: {
        cellphone,
      },
      defaults: {
        username,
        cellphone,
        sex,
        birthday,
      },
      transaction: t,
    }).then((pdmInfo) => {
      if (!pdmInfo) throw new Error();
      const pdmemberid = pdmInfo[0].uid;
      return models.Member.findOrCreate({
        where: {
          pdmemberid,
          storeid,
        },
        defaults: {
          RFID,
          pdmemberid,
          storeid,
        },
        transaction: t,
      }).then((mInfo) => {
        if (!mInfo) throw new Error();
        return models.VipCard.findOrCreate({
          where: {
            cardname,
            storeid,
          },
          defaults: {
            cardname,
            cardtype: 1,
            cardsubtype: 1,
            price,
            storeid,
          },
          transaction: t,
        }).then((vcInfo) => {
          if (!vcInfo) throw new Error();
          if (!mInfo) throw new Error();
          const memberid = mInfo[0].uid;
          const vipcardid = vcInfo[0].uid;
          let cardstatus = 8;
          if (curdata < opencardtime) {
            cardstatus = 8;
          } else if (curdata >= opencardtime && curdata < expirytime) {
            cardstatus = 1;
          } else if (curdata >= expirytime) {
            cardstatus = 3;
          }
          return models.VipCardMap.findOrCreate({
            include: {
              model: models.Member,
              as: 'members',
              attributes: ['uid'],
              where: {
                storeid,
              },
            },
            where: {
              entitycardid,
            },
            defaults: {
              memberid,
              vipcardid,
              entitycardid,
              opencardtime,
              expirytime,
              totalbuy: Moment(expirytime).diff(Moment(opencardtime), 'days'),
              curbuy: Moment(expirytime).diff(Moment(), 'days') >= 0 ? Moment(expirytime).diff(Moment(), 'days') : 0,
              cardstatus,
            },
            transaction: t,
          }).then((vcmInfo) => {
            if (!vcmInfo) throw new Error();
            return models.VipCardMapLog.create({
              vipcardmapid: vcmInfo[0].uid,
              memberid: vcmInfo[0].memberid,
              vipcardid: vcmInfo[0].vipcardid,
              entitycardid: vcmInfo[0].entitycardid,
              opencardtime: vcmInfo[0].opencardtime,
              expirytime: vcmInfo[0].expirytime,
              totalbuy: vcmInfo[0].totalbuy,
              curbuy: vcmInfo[0].curbuy,
              cardstatus: vcmInfo[0].cardstatus,
              operation: 1,
            }, {
              transaction: t,
            }).then((vcmlInfo) => {
              if (!vcmlInfo) throw new Error();
              return models.Shower.create({
                memberid: vcmlInfo.memberid,
                singledate: 5,
                totaldate: water,
              }, {
                transaction: t,
              });
            });
          });
        });
      });
    })).then((result) => {
      if (!result) throw new Error();
      return true;
    }).catch((err) => {
      console.log(err);
      return false;
    });
  }

  return true;
}

// 定时导入目录下文件
export const importData = async (path, storeid) => {
  $required('storeid', storeid);
  $required('path', path);

  let ret = true;
  const file = Xlsx.parse(path);
  for (let i = 0; i < file.length; i += 1) {
    const name = file[i].name;
    const sheets = file[i].data;
    switch (name) {
      case '期限卡':
        ret = importLimitCard(sheets, storeid);
        break;
      default:
        break;
    }
  }

  if (!ret) {
    return ERROR.ImportError();
  }
  return ret;
};
