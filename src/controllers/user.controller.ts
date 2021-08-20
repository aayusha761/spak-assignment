import { Body, Controller, Get, HttpStatus, Post, Req, Res, Response, UseGuards, ValidationPipe } from '@nestjs/common';
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
  async login(
    @Body(new ValidationPipe()) loginCredentials: LoginDTO,
    @Req() req,
    @Response() res,
  ): Promise<any> {
    const res1 = await this.userService.login(loginCredentials);
    res.status(HttpStatus.UNAUTHORIZED).json(res1);
  }

  @Post('/signup')
  async createUser(
    @Body(new ValidationPipe()) createUserDTO: CreateUserDTO,
    @Req() req,
    @Response() res,
  ): Promise<any> {
    const msg = await this.userService.createUser(createUserDTO);
    if (msg.code === HttpStatus.BAD_REQUEST) {
      res.status(HttpStatus.BAD_REQUEST).json(msg);
    } else {
      res.status(HttpStatus.OK).json(msg);
    }
  }

  @Post('/logout')
  async logout(@Body('access_token') accessToken: string, @Req() req, @Res() res): Promise<any> {
    const msg = await this.userService.logout(accessToken);
    if (msg.code === HttpStatus.BAD_REQUEST) {
      res.status(HttpStatus.BAD_REQUEST).json(msg);
    } else {
      res.status(HttpStatus.OK).json(msg);
    }
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
