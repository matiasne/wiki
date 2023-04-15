import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthRegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  username: string;
}

export class AuthCredentialsDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  username: string;
}

export class AuthLogoutDto {
  @IsNotEmpty()
  username: string;
}

export class AuthForgotPasswordDto {
  @IsNotEmpty()
  username: string;
}

export class AuthVarifyEmailDto {
  @IsNotEmpty()
  username: string;
}

export class AuthConfirmNewPasswordDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  password: string;
}

export class AuthConfirmCodeDto {
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  username: string;
}

export class IAuthUser {
  uasername: string;
  id: string;
}
