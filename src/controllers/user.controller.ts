import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Response,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import LoginDTO from '../schema/LoginDTO';
import CreateUserDTO from '../schema/CreateUserDTO';
import UserEntity from '../db/entities/user.entity';
import EAccess from '../enums/access.enum';
import AuthenticationGuard from '../guards/authentication.guard';
import RolesGuard from '../guards/roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  async login(@Body() loginCredentials: LoginDTO, @Req() req, @Response() res) {
    return await this.userService.login(loginCredentials, res);
  }

  @Post('/signup')
  async createUser(
    @Body() createUserDTO: CreateUserDTO,
    @Req() req,
    @Response() res,
  ) {
    if (await this.userService.createUser(createUserDTO)) {
      res
        .status(HttpStatus.OK)
        .json('You have been successfully signed up with email: ');
    } else {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Email already exists' });
    }
  }

  @Post('/logout')
  async logout() {
    return await this.userService.logout();
  }

  @Get('/get')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.ADMIN]))
  async findUserByEmail(@Body('email') email: string): Promise<UserEntity> {
    return await this.userService.findUserByEmail(email);
  }
}
