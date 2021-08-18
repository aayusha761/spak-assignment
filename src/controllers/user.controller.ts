import { Body, Controller, HttpStatus, Post, Req, Response } from '@nestjs/common';
import { UserService } from '../services/user.service';
import LoginDTO from '../schema/LoginDTO';
import CreateUserDTO from '../schema/CreateUserDTO';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  async login(@Body() loginCredentials: LoginDTO, @Req() req, @Response() res) {
    return await this.userService.login(loginCredentials, res);
  }

  @Post('/signup')
  async createUser(@Body() createUserDTO: CreateUserDTO, @Req() req, @Response() res) {
    if (await this.userService.createUser(createUserDTO)) {
      res.status(HttpStatus.OK).json("You have been successfully signed up with email: ");
    }
    else {
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'Email already exists' });
    }
  }
}
