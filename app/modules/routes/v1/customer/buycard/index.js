
import Router from 'koa-router';
import BuyVipCard from './buyvipcard';

const router = Router();
router.use('/', BuyVipCard.routes(), BuyVipCard.allowedMethods());

export default router;
