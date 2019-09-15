
import Router from 'koa-router';
import Order from './order';
import OrderGroup from './ordergroup';

const router = Router();
router.use('/single', Order.routes(), Order.allowedMethods());
router.use('/group', OrderGroup.routes(), OrderGroup.allowedMethods());

export default router;
