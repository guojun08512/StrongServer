
import Router from 'koa-router';
import * as Course from 'modules/course';

async function addCourse(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  data.storeid = storeid;
  const resStatus = await Course.addCourse(data);
  ctx.success({ resStatus }, 'add Course success!');
}

async function updateCourse(ctx) {
  const courseId = ctx.params.courseId;
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const resStatus = await Course.updateCourse(courseId, storeid, data);
  ctx.success({ resStatus }, 'Update Course success!');
}

async function deleteCourse(ctx) {
  const courseIds = ctx.request.body.courseIds;
  const storeid = ctx.headers.storeid;
  const resStatus = await Course.deleteCourse(courseIds, storeid);
  ctx.success({ resStatus }, 'delete Course success!');
}

async function queryCourseInfo(ctx) {
  const courseId = ctx.params.courseId;
  const storeid = ctx.headers.storeid;
  if (courseId) {
    const oneCourseInfo = await Course.queryCourseInfo(courseId, storeid);
    ctx.success({ oneCourseInfo }, 'query Course success!');
    return // eslint-disable-line
  }
  const data = ctx.request.body;
  const coursesInfo = await Course.getAllCourse({ ...data }, storeid);
  ctx.success({ coursesInfo }, 'query Course success!');
}

async function getAllCourseName(ctx) {
  const storeid = ctx.headers.storeid;
  const coursesNameInfo = await Course.getAllCourseName(storeid);
  ctx.success({ coursesNameInfo }, 'query Course success!');
}

const router = Router();
const routers = router
  .post('/', addCourse)
  .put('/:courseId', updateCourse)
  .delete('/', deleteCourse)
  .get('/:courseId', queryCourseInfo)
  .get('/coursename', getAllCourseName);

module.exports = routers;
