import { extendType, intArg } from '@nexus/schema';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.field('fileById', {
      type: 'File',
      nullable: true,
      args: { id: intArg({ required: true }) },
      resolve(_file, { id }, ctx) {
        return ctx.db.file.findOne({
          where: { id },
        });
      },
    });
  },
});
