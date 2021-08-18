import { IsEmail, IsNotEmpty } from 'class-validator';

class CreateUserDTO {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  contact: string;

  @IsNotEmpty()
  gender: string;
}

export default CreateUserDTO;
