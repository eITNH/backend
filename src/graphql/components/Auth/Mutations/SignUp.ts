import { createHmac, randomBytes } from 'crypto';
import { join } from 'path';
import { extendType, stringArg } from '@nexus/schema';
import { createTransport } from 'nodemailer';
import { renderFile } from 'ejs';
import { format } from 'url';
import uuid = require('uuid/v1');

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('signUp', {
      type: 'Auth',
      args: {
        email: stringArg({ required: true }),
        username: stringArg({ required: true }),
        password: stringArg({ required: true }),
        firstname: stringArg({ required: true }),
        lastname: stringArg({ required: true }),
      },
      async resolve(
        _root,
        { email, username, password, firstname, lastname },
        ctx,
      ) {
        // Generate a random salt
        const salt = createHmac(
          'sha512',
          randomBytes(64).toString('hex'),
        ).digest('hex');
        // Create a password with the hash and the salt
        const hashedPassword = createHmac('sha512', password + salt).digest(
          'hex',
        );

        const verificationToken = uuid();

        const auth = await ctx.db.auth.create({
          data: {
            email,
            username,
            password: hashedPassword,
            salt,
            activated: true, // FIXME: Set to false
            verificationToken,
            user: {
              create: {
                firstname,
                lastname,
              },
            },
          },
          include: { user: true },
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
                  We are excited that you have chosen to join Solar System! <br />
                  <br />
                  While we get everything ready for you, please verify your email address so we know it's really you. <br />
                  <br />
                  <a href="${verificationUrl}">Verify email</a> <br />
                  <br />
                  Have a great launch!
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
