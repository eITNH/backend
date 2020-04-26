import { sign } from 'jsonwebtoken';
import { createHmac } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';
import { extendType, stringArg } from '@nexus/schema';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('login', {
      type: 'Auth',
      nullable: true,
      args: {
        login: stringArg({ required: true }),
        password: stringArg({ required: true }),
      },
      async resolve(_root, { login, password }, ctx) {
        const authArray = await ctx.db.auth.findMany({
          first: 1,
          where: {
            AND: [
              {
                OR: [
                  {
                    username: login,
                  },
                  {
                    email: login,
                  },
                ],
              },
              {
                activated: true,
              },
            ],
          },
          include: { user: true },
        });

        if (authArray && authArray.length > 0) {
          const auth = authArray[0];
          const enteredPassword = createHmac(
            'sha512',
            password + auth.salt,
          ).digest('hex');

          if (auth.password === enteredPassword) {
            const secretKey = readFileSync(
              join(__dirname, '../../../../auth/secret.key'),
            );

            const token = sign(
              {
                authId: auth.id,
                id: auth.user.id,
                username: auth.username,
                email: auth.email,
              },
              secretKey,
              {
                expiresIn: '7 days',
              },
            );

            return {
              ...auth,
              token,
            };
          }
        }

        return null;
      },
    });
  },
});
