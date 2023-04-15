import { Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { AuthConfig } from './auth.config';
import {
  AuthConfirmCodeDto,
  AuthConfirmNewPasswordDto,
  AuthCredentialsDto,
  AuthForgotPasswordDto,
  AuthLogoutDto,
  AuthRegisterDto,
} from './interfaces/auth.interfaces';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;
  constructor(
    // @Inject('AuthConfig')
    private readonly authConfig: AuthConfig,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
  }

  async register(authRegisterRequest: AuthRegisterDto) {
    const { email, password } = authRegisterRequest;
    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        email,
        password,
        [new CognitoUserAttribute({ Name: 'email', Value: email })],
        null,
        (err, result) => {
          if (!result) {
            reject(err);
          } else {
            resolve(result.user);
          }
        },
      );
    });
  }

  async logoutUser(user: AuthLogoutDto) {
    const { username } = user;
    const userData = {
      Username: username,
      Pool: this.userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      return cognitoUser.signOut(() => {
        resolve('User successfully logged out');
      });
    });
  }

  getCognitoUser(email: string) {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: this.userPool,
    });
    return cognitoUser;
  }

  authenticateUser(user: AuthCredentialsDto) {
    const { username, password } = user;

    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    const userData = {
      Username: username,
      Pool: this.userPool,
    };

    const newUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  forgotPassword(user: AuthForgotPasswordDto) {
    const { username } = user;
    const cognitoUser = this.getCognitoUser(username);
    this.sendVerificationCode(cognitoUser);
  }

  async sendVerificationCode(user: CognitoUser) {
    return new Promise((resolve, reject) => {
      user.forgotPassword({
        onSuccess(result) {
          resolve(result);
        },
        onFailure(err) {
          reject(err);
        },
      });
    });
  }

  confirmNewPassword(user: AuthConfirmNewPasswordDto) {
    const { username, code, password } = user;

    const userData = {
      Username: username,
      Pool: this.userPool,
    };

    const cognitoUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      return cognitoUser.confirmPassword(code, password, {
        onSuccess: () => {
          resolve('Password changed successfully');
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  confirmEmailCode(authCode: AuthConfirmCodeDto) {
    const { username, code } = authCode;

    const userData = {
      Username: username,
      Pool: this.userPool,
    };

    const newUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      newUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve('Email verified successfully');
        }
      });
    });
  }

  googleLogin(req) {
    if (!req.user) {
      return 'No user form google';
    } else {
      return {
        message: 'User Info from Google',
        user: req.user,
      };
    }
  }
}
