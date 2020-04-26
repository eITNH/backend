import { objectType } from '@nexus/schema';

export const Category = objectType({
  name: 'Category',
  definition(t) {
    t.model.id();
    t.model.title();
    t.model.color();
    t.model.createdAt();
    t.model.updatedAt();
    t.model.files();
    t.model.courses();
  },
});
