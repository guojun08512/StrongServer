
class CCError {
  constructor(code, errMsg, message, data = {}) {
    this.code = code;
    this.errMsg = errMsg;
    this.message = message;
    this.data = data;
  }
}

export const isCCError = err => err instanceof CCError;
export const throwCCError = (code, errMsg, message = errMsg, data = {}) => { throw new CCError(code, errMsg, message, data); };
export const invalidToken = () => throwCCError(1001, 'Access token 无效.', 'Authentication Error');
export const accessDenied = () => throwCCError(1002, '拒绝访问.', 'Authentication Error');
export const userNotFound = () => throwCCError(1003, '用户不存在.', 'Authentication Error');
export const invalidPwd = () => throwCCError(1004, '密码无效.', 'Authentication Error');
export const mainGroupLimit = () => throwCCError(1005, '主组唯一.', '团组错误');
export const groupNameExist = () => throwCCError(1006, '名字已存在.', '团组错误');
export const groupCreatFail = () => throwCCError(1007, '创建失败.', '团组错误');
export const groupUpdateFail = () => throwCCError(1008, '团组更新失败.', '团组错误');
export const groupDeleteFail = (msg = '') => throwCCError(1009, `团组错误. ${msg}`, '团组错误');
export const nameInvalid = (msg = '') => throwCCError(1010, `名字无效. ${msg}`, '名字错误');
export const sexInvalid = () => throwCCError(1011, '性别无效. ', '性别错误');
export const phoneInvalid = () => throwCCError(1012, '手机号无效. ', '手机号错误');
export const groupInvalid = () => throwCCError(1013, '组错误. ', '组错误');
export const positionInvalid = () => throwCCError(1014, '职位无效. ', '职位错误');
export const employeeCreateFail = () => throwCCError(1015, '创建失败. ', '工作人员错误');
export const employeePosition = (msg = '') => throwCCError(1016, `职位错误.${msg}`, '工作人员错误');
export const coachTypeInvalid = (msg = '') => throwCCError(1017, `教练类型错误.${msg}`, '教练错误');
export const courseInvalid = (msg = '') => throwCCError(1018, `课程无效.${msg}`, '课程错误');
export const coachInvalid = (msg = '') => throwCCError(1019, `教练无效.${msg}`, '教练错误');
export const groupLessonInvalid = (msg = '') => throwCCError(1020, `团课无效.${msg}`, '团课错误');
export const orderGroupLessonInvalid = (msg = '') => throwCCError(1021, `约团课无效. ${msg}`, '团课错误');
export const orderCoachLessonInvalid = (msg = '') => throwCCError(1022, `私教无效. ${msg}`, '私教错误');
export const paramsExpect = msg => throwCCError(1023, `Expect to have ${msg} property.`);
export const roomInvalid = (msg = '') => throwCCError(1024, `教室无效.${msg}`, 'room Error');
export const employeeInvalid = (msg = '') => throwCCError(1025, `员工无效.${msg}`, '工作人员错误');
export const groupTreeTypeFail = () => throwCCError(1024, '组错误.', 'Group Error');
export const dateInvalid = (msg = '') => throwCCError(1025, `日期无效.${msg}`, 'date Error');
export const entitycardInvalid = (msg = '') => throwCCError(1026, `实体卡无效.${msg}`, 'EntityCard Error');
export const deleteVipCardInvalid = (msg = '') => throwCCError(1027, `删除卡无效.${msg}`, 'DeleteVipCard Error');
export const phoneExist = () => throwCCError(1028, '号码已存在', 'Phone Error');
export const MemberExist = () => throwCCError(1029, '会员已存在 ', 'member Error');
export const VipCardNameExist = () => throwCCError(1030, '卡名字已存在', 'vipcardname Error');
export const wxbindexpire = () => throwCCError(1031, '绑定超时', 'bind phone Error');
export const wxbindDup = () => throwCCError(1032, '绑定号码已被占用', 'bind phone occupy');
export const roleInvalid = (msg = '') => throwCCError(1033, `角色错误 ${msg}`, '角色错误');
export const employeeError = (msg = '') => throwCCError(1034, `工作人员错误.${msg}`, '工作人员错误');
export const commonError = (msg = '') => throwCCError(1035, `${msg}`, ' Error');

// GetCode
export const sendSMSError = () => throwCCError(1101, '发送验证码失败', 'GetCode Error');
export const notRepeat = () => throwCCError(1102, '不能重复申请', 'GetCode Error');
export const authCodeError = () => throwCCError(1103, '验证码错误', 'GetCode Error');
export const codeOverTime = () => throwCCError(1104, '验证码超时', 'GetCode Error');
export const WxLoingError = () => throwCCError(1105, '微信登陆失败', 'GetCode Error');
export const WxIdError = () => throwCCError(1106, '微信uid已被绑定', 'GetCode Error');

// buyvipcard
export const EntityCardExist = () => throwCCError(1201, '实体卡号存在', 'buyvipcard Error');
export const OpenTimeError = () => throwCCError(1202, '不能修改开卡时间', 'buyvipcard Error');
export const CardTypeError = () => throwCCError(1203, '卡类型不相同', 'buyvipcard Error');
export const GenerateError = () => throwCCError(1204, '生成失败', 'buyvipcard Error');
export const OnsoleError = () => throwCCError(1205, '会员卡停用', 'buyvipcard Error');

// mymessage
export const QueryDataError = () => throwCCError(1301, '查询数据失败', 'mymessage Error');
export const UpdataDataError = () => throwCCError(1302, '更新数据失败', 'mymessage Error');
export const MemberLengthError = () => throwCCError(1303, '会员数量为空', 'mymessage Error');
export const UserScoreError = () => throwCCError(1304, '已评价过', 'mymessage Error');

// user
export const CellPhoneError = () => throwCCError(1401, '注册电话号码已存在', 'user Error');
export const CreateUserError = () => throwCCError(1402, '创建用户失败', 'user Error');
export const UpdateUserError = () => throwCCError(1403, '修改密码失败', 'user Error');

// storemanager
export const ParamsError = (func, msg) => throwCCError(1501, `${func} params(${msg}) is mismach`, 'storemanager');

// member
export const BalanceError = () => throwCCError(1601, '余额不够', 'member Error');
export const UpdatePhoneError = () => throwCCError(1602, '更改电话号码已存在', 'member Error');

// manage
export const ArrayError = () => throwCCError(1701, '类型不是数组', 'manage Error');
export const AddStoreError = err => throwCCError(1702, '添加场馆失败', err);

// import
export const ImportError = () => throwCCError(1801, '数据导入失败', 'import Error');
