import { IsEmail, IsNotEmpty } from 'class-validator';

class LoginDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
export default LoginDTO;
