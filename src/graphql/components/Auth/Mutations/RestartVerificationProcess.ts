import { join } from 'path';
import { extendType, stringArg } from '@nexus/schema';
import { createTransport } from 'nodemailer';
import { renderFile } from 'ejs';
import { format } from 'url';
import uuid = require('uuid/v1');

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('restartVerificationProcess', {
      type: 'Auth',
      args: {
        email: stringArg({ required: true }),
      },
      async resolve(_root, { email }, ctx) {
        const verificationToken = uuid();

        const auth = await ctx.db.auth.update({
          include: { user: true },
          data: {
            verificationToken,
          },
          where: {
            email,
          },
        });

        const transporter = createTransport({
          host: 'smtp.strato.de',
          port: 465,
          secure: true,
          auth: {
            user: 'noreply@ewert-online.com', // FIXME: Add real E-Mail Account
            pass: '#q6q6OucQx*7S@qA2WLX',
          },
        });

        const verificationUrl = format({
          protocol: ctx.request.protocol,
          host: ctx.request.hostname,
          pathname: 'verify',
          search: `?token=${auth.verificationToken}`,
        });

        transporter.sendMail(
          {
            from: '"Solar System" noreply@ewert-online.com', // FIXME: Add real E-Mail Account
            to: auth.email,
            subject: 'Verify your E-Mail',
            html: await renderFile(
              join(process.env.ROOT_DIR, 'templates', 'mail.ejs'),
              {
                title: 'Verify your E-Mail',
                content: `
                  Hey${
                    auth.user.firstname ? ' ' + auth.user.firstname : ''
                  }, <br />
                  <br />
                  We are sorry, you had problems with your first verification link. <br />
                  <br />
                  Here is a new one:
                  <br />
                  <a href="${verificationUrl}">Verify email</a> <br />
                  <br />
                  Good luck!
                `,
              },
            ),
          },
          (err, info) => {
            if (err) {
              console.log(err);
            } else {
              console.log('Message sent: ' + info.response);
            }
          },
        );

        return auth;
      },
    });
  },
});
