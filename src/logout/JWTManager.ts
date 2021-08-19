import * as JWT from 'jsonwebtoken';
import EMessages from '../enums/EMessages';
import { HttpStatus } from '@nestjs/common';

const JWTManager = {
  revokedJWTs: [],

  isValid: function (jwt) {
    const decoded: any = JWT.verify(jwt, 'topSecret');
    const { iat, exp, user_ } = decoded;
    const { email } = user_;
    const now = Date.now();
    const duration = Math.floor(now / 1000);
    return exp == undefined || false || duration < exp;
  },

  revoke: async function (jwtToken: string) {
    if (
      JWTManager.isValid(jwtToken) &&
      !JWTManager.revokedJWTs.includes(jwtToken)
    ) {
      JWTManager.revokedJWTs.push(jwtToken);
      return {
        message: EMessages.SUCCESS,
        code: HttpStatus.OK,
      };
    } else {
      return {
        message: EMessages.INVALID_AUTHENTICATION_TOKEN,
        code: HttpStatus.BAD_REQUEST,
      };
    }
  },
};

export default JWTManager;
