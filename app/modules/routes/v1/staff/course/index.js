

import Router from 'koa-router';
import Course from './course';
import CourseGroupLesson from './grouplesson';

const router = Router();
router.use('/single', Course.routes(), Course.allowedMethods());
router.use('/group', CourseGroupLesson.routes(), CourseGroupLesson.allowedMethods());

export default router;
