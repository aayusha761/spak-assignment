import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import EMessages from '../enums/EMessages';
import EAccess from '../enums/access.enum';

@Injectable()
class RolesGuard implements CanActivate {
  constructor(private readonly access: EAccess[]) {}

  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const index = this.access.indexOf(user.access);
    console.log(index);
    if (index !== -1) {
      return true;
    } else {
      throw new HttpException(EMessages.PERMISSION_DENIED, 403);
    }
  }
}

export default RolesGuard;
