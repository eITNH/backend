import { scalarType } from '@nexus/schema';
import { parse, format } from 'date-fns';

export default scalarType({
  name: 'DateTime',
  asNexusMethod: 'date',
  description: 'Date in format: yyyy-MM-dd HH:mm:ss',
  parseValue(value: string) {
    return parse(value, 'yyyy-MM-dd HH:mm:ss', new Date());
  },
  serialize(value) {
    return format(value, 'yyyy-MM-dd HH:mm:ss');
  },
});
