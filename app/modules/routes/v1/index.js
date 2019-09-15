
import Router from 'koa-router';
import { checkRole } from 'modules/middleware/checkpermission';

import userApi from './user';
import staffApi from './staff';
import customerApi from './customer';
import storageApi from './storage';
import searchApi from './search';
import homePageApi from './homepage';
import uploadApi from './upload/upload';
import appApi from './app';
import reportApi from './report';
import importApi from './import';
// import hardDriverApi from './harddriver';

const router = Router();
router.use('/users', checkRole(), userApi.routes(), userApi.allowedMethods());

// router.use('/members', checkRole(), memberApi.routes(), memberApi.allowedMethods());
// router.use('/vipcard', checkRole(), vipCardApi.routes(), vipCardApi.allowedMethods());
// router.use('/signin', checkRole(), signinApi.routes(), signinApi.allowedMethods());
// router.use('/experience', checkRole(), experienceApi.routes(), experienceApi.allowedMethods());
// router.use('/buyvipcard', checkRole(), buyvipcardApi.routes(), buyvipcardApi.allowedMethods());
// router.use('/memberanalysis', checkRole(), memberAnalysis.routes(), memberAnalysis.allowedMethods());
// router.use('/follow', checkRole(), follow.routes(), follow.allowedMethods());
// router.use('/course', checkRole(), CourseApi.routes(), CourseApi.allowedMethods());
// router.use('/employee', checkRole(), employeeApi.routes(), employeeApi.allowedMethods());
// router.use('/employeegroup', checkRole(), employeeGroupApi.routes(), employeeGroupApi.allowedMethods());
// router.use('/coachgroup', checkRole(), coachGroupApi.routes(), coachGroupApi.allowedMethods());
// router.use('/coach', checkRole(), coachApi.routes(), coachApi.allowedMethods());
// router.use('/grouplesson', checkRole(), groupLessonApi.routes(), groupLessonApi.allowedMethods());
// router.use('/ordergroup', checkRole(), orderGroupApi.routes(), orderGroupApi.allowedMethods());
// router.use('/permission', checkRole(), permission.routes(), permission.allowedMethods());
// router.use('/order', checkRole(), order.routes(), order.allowedMethods());

router.use('/customer', customerApi.routes(), customerApi.allowedMethods());
router.use('/staff', staffApi.routes(), staffApi.allowedMethods());

router.use('/storage', storageApi.routes(), storageApi.allowedMethods());
router.use('/search', searchApi.routes(), searchApi.allowedMethods());
router.use('/homepage', checkRole(), homePageApi.routes(), homePageApi.allowedMethods());

router.use('/app', appApi.routes(), appApi.allowedMethods());
router.use('/upload', checkRole(), uploadApi.routes(), uploadApi.allowedMethods());
router.use('/report', checkRole(), reportApi.routes(), reportApi.allowedMethods());
router.use('/import', checkRole(), importApi.routes(), importApi.allowedMethods());
// router.use('/harddriver', hardDriverApi.routes(), hardDriverApi.allowedMethods());

export default router;
