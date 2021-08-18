import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import UserEntity from '../db/entities/user.entity';
import * as JWT from 'jsonwebtoken';

@Injectable()
class AuthenticationGuard implements CanActivate {
  private mySecret = 'topSecret';

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwtToken = await request.headers.jwttoken;
    const user: UserEntity = await this.validateJWTToken(jwtToken);
    if (user) {
      request.user = user;
      request.jwtToken = jwtToken;
      return true;
    } else {
      return false;
    }
  }

  public async validateJWTToken(jwtToken: string): Promise<UserEntity> {
    try {
      const decoded: any = JWT.verify(jwtToken, this.mySecret);
      const { user_ } = decoded;
      const { email } = user_;
      const user = await UserEntity.getUserByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Unauthorised');
      }
      return user;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('Unauthorised');
    }
  }
}

export default AuthenticationGuard;
