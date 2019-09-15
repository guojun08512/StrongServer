
import { requestApi } from 'modules/request';
import config from 'modules/config';
import models from 'modules/db/models';

export const searchData = async (search, authorization, storeid) => {
  const route = `${config.get('SEARCH_SERVER')}/searchs/searchsuggestion`;
  const params = {
    headers: {
      Authorization: authorization,
    },
    body: {
      search,
    },
  };
  console.log(route);
  console.log(params);
  const fr = await requestApi(route, 'POST', params);
  const datas = fr.suggestions;
  const suggestions = [];
  for (let i = 0; i < datas.length; i += 1) {
    const mInfo = await models.Member.findOne({
      include: [{
        model: models.PDMember,
        as: 'pdmembers',
        attributes: [],
        where: {
          uid: datas[i].uid,
        },
      }],
      attributes: [],
      where: {
        storeid,
      },
    });
    if (mInfo) {
      suggestions.push(datas[i]);
    }
  }

  return {
    data: {
      suggestions,
    },
  };
};

export const searchAllData = async (search, authorization) => {
  const route = `${config.get('SEARCH_SERVER')}/searchs/searchall`;
  const fr = await requestApi(route, 'POST', {
    headers: {
      Authorization: authorization,
    },
    body: {
      search,
    },
  });
  return fr;
};

export const searchMemberId = async (pdmemberid, storeid) => {
  const pdMemberInfo = await models.Member.findOne({
    where: {
      pdmemberid,
      storeid,
    },
  });
  if (!pdMemberInfo) {
    return '';
  }
  return pdMemberInfo.uid;
};
