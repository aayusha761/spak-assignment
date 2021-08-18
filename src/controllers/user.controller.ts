import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Response,
  UseGuards,
  ValidationPipe,
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
  async login(@Body(new ValidationPipe()) loginCredentials: LoginDTO, @Req() req, @Response() res) {
    const res1 = await this.userService.login(loginCredentials);
    res.status(HttpStatus.UNAUTHORIZED).json(res1);
  }

  @Post('/signup')
  async createUser(
    @Body(new ValidationPipe()) createUserDTO: CreateUserDTO,
    @Req() req,
    @Response() res,
  ) {
    const msg = await this.userService.createUser(createUserDTO);
    res.status(HttpStatus.OK).json(msg);
  }

  @Post('/logout')
  async logout() {
    return await this.userService.logout();
  }

  @Get('/getUserByEmail')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.ADMIN]))
  async findUserByEmail(@Body('email') email: string): Promise<UserEntity> {
    return await this.userService.findUserByEmail(email);
  }

  @Get('/getUserByContact')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.ADMIN]))
  async findUserByContact(
    @Body('contact') contact: string,
  ): Promise<UserEntity> {
    return await this.userService.findUserByContact(contact);
  }
}
