import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import AuthService from '../services/auth.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, AuthService],
})
export class UserModule {}
