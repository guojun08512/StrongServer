
import Router from 'koa-router';
import BuyCard from './buycard';
import Expect from './expect';
import Member from './member';
import MemberAnalysis from './memberanalysis';
import MemberCard from './membercard';
import Pursue from './pursue';
import Sign from './sign';

const router = Router();
router.use('/buycard', BuyCard.routes(), BuyCard.allowedMethods());
router.use('/expect', Expect.routes(), Expect.allowedMethods());
router.use('/member', Member.routes(), Member.allowedMethods());
router.use('/memberanalysis', MemberAnalysis.routes(), MemberAnalysis.allowedMethods());
router.use('/membercard', MemberCard.routes(), MemberCard.allowedMethods());
router.use('/pursue', Pursue.routes(), Pursue.allowedMethods());
router.use('/sign', Sign.routes(), Sign.allowedMethods());

export default router;
