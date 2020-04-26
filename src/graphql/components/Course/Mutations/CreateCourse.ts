import { extendType, inputObjectType } from '@nexus/schema';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('createCourse', {
      type: 'Course',
      args: {
        data: inputObjectType({
          name: 'CreateCourseInput',
          definition(t) {
            t.string('title', { required: true });
            t.string('teaser');
            t.string('description');
            t.date('start');
            t.date('end');
            t.boolean('public', { default: false });
            t.list.int('members', { required: false });
          },
        }),
      },
      async resolve(_root, { data }, ctx) {
        const {
          title,
          teaser,
          description,
          start,
          end,
          public: public_,
          members,
        } = data;

        return ctx.db.course.create({
          data: {
            title,
            description,
            teaser,
            start,
            end,
            public: public_,
            acceptedMembers: {
              connect: members
                ? members.map((id) => ({
                    id,
                  }))
                : [],
            },
            professors: {
              connect: {
                id: ctx.viewer.id,
              },
            },
          },
        });
      },
    });
  },
});
