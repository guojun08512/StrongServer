/**
 * 云通信基础能力业务短信发送、查询详情以及消费消息示例，供参考。
 * Created on 2017-07-31
 */
import { sendSMS } from 'modules/noteservice';

const options = {
  PhoneNumbers: '18610108413',
  TemplateParam: '{"code": "1234", "product": "jsf"}',
}

sendSMS(options).catch(console.log)
