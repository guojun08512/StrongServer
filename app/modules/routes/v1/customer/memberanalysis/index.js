import Router from 'koa-router';
import * as MemberAnalysis from 'modules/memberanalysis';

async function queryMemberSignInfo(ctx) {
  const data = ctx.request.body;
  const ret = await MemberAnalysis.queryMemberSignInfo(data);
  ctx.success(ret, 'query finish!');
}

async function queryOrderRecord(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await MemberAnalysis.queryOrderRecord(data, storeid);
  ctx.success(ret, 'query finish!');
}

async function querySignPrivateLessonRecord(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await MemberAnalysis.querySignPrivateLessonRecord(data, storeid);
  ctx.success(ret, 'query finish!');
}

async function queryMemberVipCard(ctx) {
  const data = ctx.request.body;
  const ret = await MemberAnalysis.queryMemberVipCard(data);
  ctx.success(ret, 'query finish!');
}

async function trainingRecordList(ctx) {
  const data = ctx.request.body;
  const ret = await MemberAnalysis.trainingRecordList(data);
  ctx.success(ret, 'query finish!');
}

async function contractList(ctx) {
  const data = ctx.request.body;
  const authorization = ctx.headers.authorization;
  const storeid = ctx.headers.storeid;
  const ret = await MemberAnalysis.contractList(data, authorization, storeid);
  ctx.success(ret, 'query finish!');
}

async function followList(ctx) {
  const data = ctx.request.body;
  const ret = await MemberAnalysis.followList(data);
  ctx.success(ret, 'query finish!');
}

const router = Router();
const routers = router
  .get('/sign', queryMemberSignInfo)
  .get('/order', queryOrderRecord)
  .get('/sign/private', querySignPrivateLessonRecord)
  .get('/memberVipCard', queryMemberVipCard)
  .get('/training', trainingRecordList)
  .get('/contract', contractList)
  .get('/follow', followList);

module.exports = routers;

/*
  memberanalysis/queryMemberSignInfo 会员分析  返回{ privateLessonRate:私课消课比率, privateLessonSignData:私课签到数据{date}, contract:合同统计 }
  $required('memberId', data.memberId); 会员uid
  dateStart   // 起始时间
  dateEnd     // 结束时间

  memberanalysis/orderRecord 约课记录  返回{ openDate:开课时间,courseName:课程名称,coachName:上课教练,cardName:预约用卡,orderNumber:预约人数, signType:签到方式(0未签到,1 前台, 2 扫码) }
  $required('memberId', data.memberId); 会员uid

  memberanalysis/signPrivateLessonRecord 私课消课记录  返回{ cardName：课程名称,coachName:上课教练, signDate:签到时间, signOkDate:签退时间，signType:签到类型(0未签退，1 前台), signOkType:签退类型(0未签退，1 前台), totalSignNumber:扣除次数，  }
  $required('memberId', data.memberId); 会员uid

*/
