import { HttpStatus, Injectable } from '@nestjs/common';
import LoginDTO from '../schema/LoginDTO';
import CreateUserDTO from '../schema/CreateUserDTO';
import UserEntity from '../db/entities/user.entity';
import * as bcryprt from 'bcryptjs';
import AuthService from './auth.service';

@Injectable()
export class UserService {
  constructor(private readonly authService: AuthService) {}

  async login(loginCredentials: LoginDTO, res) {
    const { email, password } = loginCredentials;
    console.log('email', email);
    const user: UserEntity = await UserEntity.getUserByEmail(email);

    if (!user) {
      console.log('User does not exists');
      return false;
    }
    if (await bcryprt.compare(password, user.password)) {
      console.log('bcrypt compared');
      return res.status(HttpStatus.OK).json(await this.authService.generateJWTToken(user));
    } else {
      return { message: 'Username or password wrong!' };
    }
  }

  async createUser(createUserDTO: CreateUserDTO) {
    const { name, email, password, address, contact, gender } = createUserDTO;

    const user: UserEntity = await UserEntity.getUserByEmail(email);

    if (!user) {
      const newUser: UserEntity = await UserEntity.create(createUserDTO);
      const data = await UserEntity.save(newUser);
      return true;
    }
    return false;
  }
}
