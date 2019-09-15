
import Router from 'koa-router';
import Member from './member';
import MemberAnalysis from './memberanalysis';

const router = Router();
router.use('/member', Member.routes(), Member.allowedMethods());
router.use('/memberAnalysis', MemberAnalysis.routes(), MemberAnalysis.allowedMethods());

export default router;
