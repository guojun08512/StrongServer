
import models from 'modules/db/models';
import ERROR, { $required } from 'modules/utils';
import * as redisModels from 'modules/redisdb';

export const addCourse = async (data) => {
  $required('coursename', data.coursename);
  // $required('coursetime', data.coursetime);
  $required('mincoursemember', data.mincoursemember);
  $required('mincoursemember', data.mincoursemember);
  $required('coverUrl', data.coverUrl);
  // $required('images', data.images);
  const params = data;
  if (params.images) {
    const images = JSON.stringify(params.images);
    params.images = images;
  }
  const courseInfo = await models.Course.create(params);
  if (courseInfo) {
    redisModels.Add(redisModels.tableIndex.base, 'Course', courseInfo.uid, JSON.stringify(courseInfo));
    return true;
  }
  return false;
};

export const updateCourse = async (courseId, storeid, data) => {
  $required('courseId', courseId);
  const courseInfo = await models.Course.findOne({
    where: {
      uid: courseId,
      storeid,
    },
  });
  if (!courseInfo) {
    return false;
  }
  const params = data;
  if (params.images) {
    const images = JSON.stringify(params.images);
    params.images = images;
  }
  const updateStatus = await courseInfo.update(params);
  if (updateStatus) {
    redisModels.Update(redisModels.tableIndex.base, 'Course', courseId, JSON.stringify(courseInfo));
    return true;
  }
  return false;
};

export const deleteCourse = async (courseIds, storeid) => {
  $required('courseIds', courseIds);
  const cnt = await models.GroupLesson.count({
    where: {
      courseId: courseIds,
      storeid,
    },
  });
  if (cnt > 0) {
    return ERROR.courseInvalid(' 已存在团课，不可删除 .');
  }

  const res = await models.Course.update({ deleted: true }, {
    where: {
      uid: courseIds,
      storeid,
    },
  });

  redisModels.MutilDelete(redisModels.tableIndex.base, 'Course', courseIds);
  if (res) return true;
  return true;
};

export const queryCourseInfo = async (courseId, storeid) => {
  $required('courseId', courseId);
  const courseInfo = await models.Course.findOne({
    where: {
      uid: courseId,
      storeid,
    },
  });
  if (courseInfo) {
    const info = courseInfo.toJSON();
    info.images = (courseInfo.images && JSON.parse(courseInfo.images)) || [];
    return info;
  }
  return false;
};

export const getAllCourse = async (options, storeid) => {
  const coursename = options.coursename;
  const pageCount = options.pageCount || 10;
  const curPage = options.curPage || 1;

  const where = { storeid };
  if (coursename) {
    where.coursename = {
      $like: `%${coursename}%`,
    };
  }

  const courseCount = await models.Course.count({ where });
  const allCourse = await models.Course.findAll({
    where,
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
  });
  const infos = [];
  if (allCourse) {
    for (let i = 0; i < allCourse.length; i += 1) {
      const item = allCourse[i].toJSON();
      if (item.images) {
        item.images = JSON.parse(item.images);
      } else item.images = [];
      infos.push(item);
    }
  }
  return {
    allCourse: infos,
    courseCount,
  };
};

export const getAllCourseName = async (storeid) => {
  const allCourseName = await models.Course.findAll({
    attributes: ['coursename', 'iid', 'uid', 'mincoursemember', 'maxcoursemember'],
    where: { storeid },
  });
  return allCourseName;
};
