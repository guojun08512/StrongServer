
import Router from 'koa-router';
import Employee from './employee';
import EmployeeGroup from './employeegroup';

const router = Router();
router.use('/', Employee.routes(), Employee.allowedMethods());
router.use('/group', EmployeeGroup.routes(), EmployeeGroup.allowedMethods());

export default router;
