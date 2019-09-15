import Sequelize from 'sequelize';

import sequelize from 'modules/db/sequelize';
import { create as createUserModel } from './user';
import { create as createMemberModel } from './member';
import { create as createNotifyMsgModel } from './notifymsg';
import { create as createStoreModel } from './store';
import { create as createVipCardModel } from './vipcard';
import { create as createEmployeeGroup } from './employeegroup';
import { create as createCabinetModel } from './cabinet';
import { create as createDepositModel } from './deposit';
import { create as createEarnestModel } from './earnest';
import { create as createIntegralModel } from './integral';
import { create as createmSigninModel } from './msignin';
import { create as createVipCardMapModel } from './vipcardmap';
import { create as CreateCourseModel } from './course';
import { create as CreateCoachGroupModel } from './coachgroup';
import { create as CreateCoachModel } from './coach';
import { create as createEmployee } from './employee';
import { create as createEmployeePosition } from './employeeposition';
import { create as createCoachPosition } from './coachposition';
import { create as createGrouplesson } from './grouplesson';
import { create as createOrderGroup } from './ordergroup';
import { create as createRoom } from './room';
import { create as createExperience } from './experience';
import { create as createSignPrivateLesson } from './signPrivateLesson';
import { create as createRoleMap } from './rolemap';
import { create as createFollow } from './follow';
import { create as createVipCardMapLog } from './vipcardmaplog';
import { create as createArea } from './area';
import { create as createPDMember } from './pdmember';
import { create as createUserMap } from './usermap';
import { create as createPrivate } from './private';
import { create as createPrivateMap } from './privatemap';
import { create as createVeriCode } from './vericode';
import { create as createPrivateMapLog } from './privatemaplog';
import { create as createCoachScore } from './coachscore';
import { create as createCommonConf } from './commonconf';
import { create as createOrder } from './order';
import { create as createStatistic } from './statistic';
import { create as createInterCabinet } from './intelcabinet';
import { create as createShower } from './shower';
import { create as createShowerLog } from './showerlog';
import { create as createInterCabinetLog } from './intelcabinetlog';
import { create as createHardWare } from './hardware';

const User = createUserModel(sequelize, Sequelize);
const Member = createMemberModel(sequelize, Sequelize);
const NotifyMsg = createNotifyMsgModel(sequelize, Sequelize);
const Store = createStoreModel(sequelize, Sequelize);
const VipCard = createVipCardModel(sequelize, Sequelize);
const EmployeeGroup = createEmployeeGroup(sequelize, Sequelize);
const Cabinet = createCabinetModel(sequelize, Sequelize);
const Deposit = createDepositModel(sequelize, Sequelize);
const Earnest = createEarnestModel(sequelize, Sequelize);
const Integral = createIntegralModel(sequelize, Sequelize);
const mSignin = createmSigninModel(sequelize, Sequelize);
const VipCardMap = createVipCardMapModel(sequelize, Sequelize);
const Course = CreateCourseModel(sequelize, Sequelize);
const coachGroup = CreateCoachGroupModel(sequelize, Sequelize);
const coach = CreateCoachModel(sequelize, Sequelize);
const employee = createEmployee(sequelize, Sequelize);
const employeeposition = createEmployeePosition(sequelize, Sequelize);
const coachposition = createCoachPosition(sequelize, Sequelize);
const grouplesson = createGrouplesson(sequelize, Sequelize);
const ordergroup = createOrderGroup(sequelize, Sequelize);
const room = createRoom(sequelize, Sequelize);
const experience = createExperience(sequelize, Sequelize);
const signPrivateLessson = createSignPrivateLesson(sequelize, Sequelize);
const roleMap = createRoleMap(sequelize, Sequelize);
const follow = createFollow(sequelize, Sequelize);
const vipcardmaplog = createVipCardMapLog(sequelize, Sequelize);
const area = createArea(sequelize, Sequelize);
const pdmember = createPDMember(sequelize, Sequelize);
const usermap = createUserMap(sequelize, Sequelize);
const private1 = createPrivate(sequelize, Sequelize);
const privatemap = createPrivateMap(sequelize, Sequelize);
const vericode = createVeriCode(sequelize, Sequelize);
const privatemaplog = createPrivateMapLog(sequelize, Sequelize);
const coachscore = createCoachScore(sequelize, Sequelize);
const CommonConf = createCommonConf(sequelize, Sequelize);
const Order = createOrder(sequelize, Sequelize);
const Statistic = createStatistic(sequelize, Sequelize);
const InterCabinet = createInterCabinet(sequelize, Sequelize);
const Shower = createShower(sequelize, Sequelize);
const ShowerLog = createShowerLog(sequelize, Sequelize);
const InterCabinetLog = createInterCabinetLog(sequelize, Sequelize);
const HardWare = createHardWare(sequelize, Sequelize);

const models = sequelize.models;

User.associate(models);
Member.associate(models);
NotifyMsg.associate(models);
Store.associate(models);
VipCard.associate(models);
EmployeeGroup.associate(models);
Cabinet.associate(models);
Deposit.associate(models);
Earnest.associate(models);
Integral.associate(models);
mSignin.associate(models);
VipCardMap.associate(models);
Course.associate(models);
coachGroup.associate(models);
coach.associate(models);
coachposition.associate(models);
employee.associate(models);
employeeposition.associate(models);
grouplesson.associate(models);
ordergroup.associate(models);
room.associate(models);
experience.associate(models);
signPrivateLessson.associate(models);
roleMap.associate(models);
follow.associate(models);
vipcardmaplog.associate(models);
area.associate(models);
pdmember.associate(models);
usermap.associate(models);
private1.associate(models);
privatemap.associate(models);
vericode.associate(models);
privatemaplog.associate(models);
coachscore.associate(models);
CommonConf.associate(models);
Order.associate(models);
Statistic.associate(models);
InterCabinet.associate(models);
Shower.associate(models);
ShowerLog.associate(models);
InterCabinetLog.associate(models);
HardWare.associate(models);

export default models;