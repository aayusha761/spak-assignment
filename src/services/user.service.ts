import { Injectable } from '@nestjs/common';
import LoginDTO from '../schema/LoginDTO';
import CreateUserDTO from '../schema/CreateUserDTO';
import UserEntity from '../db/entities/user.entity';
import * as bcryprt from 'bcryptjs';
import AuthService from './auth.service';
import EMessages from '../enums/EMessages';
import JWTManager from '../logout/JWTManager';

@Injectable()
export class UserService {
  constructor(private readonly authService: AuthService) {}

  async login(loginCredentials: LoginDTO) {
    const { email, password } = loginCredentials;
    const user: UserEntity = await UserEntity.getUserByEmail(email);

    if (!user) {
      return { message: EMessages.UNAUTHORIZED_REQUEST, code: 401 };
    }
    if (await bcryprt.compare(password, user.password)) {
      return await this.authService.generateJWTToken(user);
    } else {
      return { message: EMessages.UNAUTHORIZED_REQUEST, code: 401 };
    }
  }

  async createUser(createUserDTO: CreateUserDTO) {
    const { email, contact } = createUserDTO;

    const user: UserEntity = await UserEntity.getUserByEmail(email);
    const user1: UserEntity = await UserEntity.getUserByContact(contact);

    if (!user && !user1) {
      const newUser: UserEntity = await UserEntity.create(createUserDTO);
      const data = await UserEntity.save(newUser);
      return { message: 'User Signed Up Successfully', code: 200 };
    } else {
      return { message: 'User Already Exists', code: 200 };
    }
  }

  async logout(accessToken: string) {
    await JWTManager.revoke(accessToken);
    return { message: EMessages.INVALID_AUTHENTICATION_TOKEN, code: 401 };
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    return await UserEntity.findOne({
      select: ['name', 'email', 'address', 'contact'],
      where: { email },
    });
  }

  async findUserByContact(contact: string): Promise<UserEntity> {
    return await UserEntity.getUserByContact(contact);
  }
}
