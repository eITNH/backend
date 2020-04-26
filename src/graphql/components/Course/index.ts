import { objectType } from '@nexus/schema';

import CourseById from './Queries/CourseById';
import Courses from './Queries/Courses';

import CreateCourse from './Mutations/CreateCourse';
import AddFavorite from './Mutations/AddFavorite';
import RemoveFavorite from './Mutations/RemoveFavorite';

const Course = objectType({
  name: 'Course',
  definition(t) {
    t.model.id();
    t.model.title();
    t.model.teaser();
    t.model.description();
    t.model.start();
    t.model.end();
    t.model.public();
    t.model.pendingMembers();
    t.model.acceptedMembers();
    t.model.professors();
    t.model.files();
    t.model.categories();
    t.model.createdAt();
    t.model.updatedAt();
    t.boolean('isFavorite', {
      async resolve(course, _args, ctx) {
        const users = await ctx.db.user.findMany({
          where: {
            favoriteCourses: {
              some: {
                id: course.id,
              },
            },
          },
        });

        if (users && users.length) {
          return true;
        }

        return false;
      },
    });
  },
});

export {
  Course,
  // Queries
  CourseById,
  Courses,
  // Mutations
  CreateCourse,
  AddFavorite,
  RemoveFavorite,
};
