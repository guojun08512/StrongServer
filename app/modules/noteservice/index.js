/**
 * 云通信基础能力业务短信发送、查询详情以及消费消息示例，供参考。
 * Created on 2017-07-31
 */
import config from 'modules/config';
import SMSClient from './sms';

// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
const accessKeyId = config.get('NOTE_KEY');
const secretAccessKey = config.get('NOTE_SECRET');

//在云通信页面开通相应业务消息后，就能在页面上获得对应的queueName,不用填最后面一段
const queueName = 'Alicom-Queue-1092397003988387-';

//初始化sms_client
const smsClient = new SMSClient({accessKeyId, secretAccessKey});

export function receiveMsg(index, queueName) {
  const myIndex = index || 0;
  return new Promise((resolve, reject) => {
    //短信回执报告
    smsClient.receiveMsg(myIndex, queueName).then((res) => {
      //消息体需要base64解码
      let {code, body}=res
      if (code === 200) {
          //处理消息体,messagebody
          resolve(body)
      }
    }, (err) => {
      reject(err)
    })
  })
}

//短信上行报告
export function queryDetail(options) {
  const { PhoneNumber, SendDate } = options;
  let resInfo = [];
  if (PhoneNumber && SendDate) {
    const PageSize = options.PageSize || 10;
    const CurrentPage = options.CurrentPage || 1;
    resInfo = new Promise((reslove, reject) => {
      //查询短信发送详情
      smsClient.queryDetail({
        PhoneNumber,
        SendDate,
        PageSize,
        CurrentPage,
      }).then(function (res) {
        const { Code, SmsSendDetailDTOs } = res;
        if (Code === 'OK') {
            //处理发送详情内容
          reslove(SmsSendDetailDTOs)
        }
      }, function (err) {
        //处理错误
        reject(err)
      })
    });
  }
  return resInfo;
}

//发送短信
export function sendSMS(options) {
  const { PhoneNumbers, TemplateParam } = options;
  let res = null;
  if (PhoneNumbers && TemplateParam) {
    const SignName = options.SignName || '北京星超万创科技有限公司';
    const TemplateCode = options.TemplateCode || 'SMS_152440813';
    res = new Promise((resolve, reject) => {
      smsClient.sendSMS({
        PhoneNumbers,
        SignName,
        TemplateCode,
        TemplateParam,
      }).then(function (res) {
        const { Code } = res;
        if (Code === 'OK') {
          //处理返回参数
          resolve(res);
        }
      }, function (err) {
        reject(err);
      });
    });
  }
  return res;
}
