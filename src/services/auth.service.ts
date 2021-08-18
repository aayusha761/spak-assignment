import { Injectable } from '@nestjs/common';
import UserEntity from '../db/entities/user.entity';
import * as JWT from 'jsonwebtoken';

@Injectable()
export default class AuthService {
  private mySecret = 'topSecret';

  public async generateJWTToken(user: UserEntity) {
    const expiresIn = 60 * 60;
    const payload = {
      user_: user,
    };
    const token = JWT.sign(payload, this.mySecret, { expiresIn });

    return { expires_in: expiresIn, access_token: token };
  }

  public async validateJWTToken(jwtToken: string): Promise<boolean> {
    try {
      const decoded: any = JWT.verify(jwtToken, this.mySecret);
      const { user_ } = decoded;
      const { email } = user_;
      const user = await UserEntity.getUserByEmail(email);
      if (!user) {
        return false;
      }
      return Boolean(user);
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
