import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import {
  AuthConfirmCodeDto,
  AuthConfirmNewPasswordDto,
  AuthCredentialsDto,
  AuthForgotPasswordDto,
  AuthLogoutDto,
  AuthRegisterDto,
  AuthVarifyEmailDto,
} from './interfaces/auth.interfaces';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService, //  private readonly usersService: UsersService,
    private userService: UsersService,
  ) {}

  @Post('register')
  async register(
    @Body() authRegisterDto: AuthRegisterDto,
    @Res() response: any,
  ) {
    let newUser: CreateUserDto = new CreateUserDto();
    newUser.email = authRegisterDto.email;
    newUser.name = authRegisterDto.username;

    try {
      let resp = await this.authService.register(authRegisterDto);

      try {
        await this.userService.create(newUser);
      } catch (e) {
        throw new BadRequestException(e.message);
      }

      return response.status(HttpStatus.OK).send({
        message: `User has been registered`,
      });
    } catch (e) {
      if (e.code === 'UsernameExistsException') {
        let user = await this.userService.getByEmail(authRegisterDto.email);
        if (!user) {
          await this.userService.create(newUser);
        }
      }

      return response.status(HttpStatus.CONFLICT).send({
        message: e.message,
      });
    }
  }

  @Post('login')
  async login(@Body() authenticateRequest: AuthCredentialsDto) {
    try {
      let resp = await this.authService.authenticateUser(authenticateRequest);

      let user = await this.userService.getByEmail(
        authenticateRequest.username,
      );
      if (!user) {
        let newUser: CreateUserDto = new CreateUserDto();
        newUser.email = authenticateRequest.username;
        newUser.name = authenticateRequest.username;
        await this.userService.create(newUser);
      }
      return resp;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Body() authenticateRequest: AuthLogoutDto) {
    try {
      return await this.authService.logoutUser(authenticateRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() authenticateRequest: AuthForgotPasswordDto) {
    try {
      return await this.authService.forgotPassword(authenticateRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() authenticateRequest: AuthForgotPasswordDto) {
    try {
      return await this.authService.forgotPassword(authenticateRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('confirm-new-password-code')
  async confirmNewPassword(
    @Body() authenticateRequest: AuthConfirmNewPasswordDto,
  ) {
    try {
      return await this.authService.confirmNewPassword(authenticateRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('confirm-email-code')
  async confirmCode(@Body() req: AuthConfirmCodeDto) {
    try {
      return await this.authService.confirmEmailCode(req);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('verify-email')
  async verifyEmail(@Body('email') req: AuthVarifyEmailDto) {
    try {
      const cognitoUser = await this.authService.getCognitoUser(req.username);
      await this.authService.sendVerificationCode(cognitoUser);
      return 'Verification Code has been sent';
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Get('google/login')
  async googleAuth(@Req() req, @Res() res) {
    res.redirect(
      'https://' +
        process.env.COGNITO_DOMAIN +
        '/oauth2/authorize?identity_provider=Google&redirect_uri=' +
        process.env.COGNITO_REDIRECT_CB +
        '&response_type=TOKEN&client_id=' +
        process.env.COGNITO_CLIENT_ID +
        '&scope=openid',
    );
  }

  @Get('github/login')
  async githubAuth(@Req() req, @Res() res) {
    res.redirect(
      'https://' +
        process.env.COGNITO_DOMAIN +
        '/oauth2/authorize?identity_provider=Github&redirect_uri=' +
        process.env.COGNITO_REDIRECT_CB +
        '&response_type=TOKEN&client_id=' +
        process.env.COGNITO_CLIENT_ID +
        '&scope=openid',
    );
  }

  @Get('facebook/login')
  async faceboojAuth(@Req() req, @Res() res) {
    res.redirect(
      'https://' +
        process.env.COGNITO_DOMAIN +
        '/oauth2/authorize?identity_provider=Facebook&redirect_uri=' +
        process.env.COGNITO_REDIRECT_CB +
        '&response_type=TOKEN&client_id=' +
        process.env.COGNITO_CLIENT_ID +
        '&scope=openid',
    );
  }

  @Get('cb')
  async AuthRedirect(@Req() req) {
    return 'Try the token in the url over other endpoints';
    //this.authService.googleLogin(req);
  }
}
