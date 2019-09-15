

import Router from 'koa-router';
import Coach from './coach';
import CoachGroup from './coachgroup';

const router = Router();
router.use('/single', Coach.routes(), Coach.allowedMethods());
router.use('/group', CoachGroup.routes(), CoachGroup.allowedMethods());

export default router;
