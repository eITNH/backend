import { objectType } from '@nexus/schema';

import IsLoggedIn from './Queries/IsLoggedIn';

import Login from './Mutations/Login';
import RestartVerificationProcess from './Mutations/RestartVerificationProcess';
import SignUp from './Mutations/SignUp';
import VerifyAccount from './Mutations/VerifyAccount';

const Auth = objectType({
  name: 'Auth',
  definition(t) {
    t.model.id();
    t.model.email();
    t.model.username();
    t.model.user();
    t.model.activated();
    t.string('token', { nullable: true });
  },
});

export {
  Auth,
  // Queries
  IsLoggedIn,
  // Mutations
  Login,
  RestartVerificationProcess,
  SignUp,
  VerifyAccount,
};
