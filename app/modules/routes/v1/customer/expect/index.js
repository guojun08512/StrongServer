

import Router from 'koa-router';
import Expect from './experience';

const router = Router();
router.use('/expect', Expect.routes(), Expect.allowedMethods());

export default router;
