
import Router from 'koa-router';
import MemberCard from './vipcard';

const router = Router();
router.use('/', MemberCard.routes(), MemberCard.allowedMethods());

export default router;
