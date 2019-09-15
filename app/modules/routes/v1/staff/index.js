
import Router from 'koa-router';
import Coach from './coach';
import Course from './course';
import Employeer from './employeer';
import Order from './order';
import Permission from './permission';


const router = Router();
router.use('/coach', Coach.routes(), Coach.allowedMethods());
router.use('/course', Course.routes(), Course.allowedMethods());
router.use('/employeer', Employeer.routes(), Employeer.allowedMethods());
router.use('/order', Order.routes(), Order.allowedMethods());
router.use('/permission', Permission.routes(), Permission.allowedMethods());

export default router;
