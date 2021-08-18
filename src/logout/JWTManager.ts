import * as JWT from 'jsonwebtoken';

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
    if (JWTManager.isValid(jwtToken)) {
      JWTManager.revokedJWTs.push(jwtToken);
    }
  },
};

export default JWTManager;
