import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { AuthConfig } from '../auth.config';

@Injectable()
export class JwtStrategyCognito extends PassportStrategy(Strategy) {
  constructor(
    private authConfig: AuthConfig,
    private usersService: UsersService,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${authConfig.authority}/.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: authConfig.clientId,
      issuer: authConfig.authority,
      algorithms: ['RS256'],
    });
  }

  public async validate(payload: any) {
    console.log('JwtStrategyCognito.validate() payload:', payload);
    if (payload.email) {
      const userData = await this.usersService.getByEmail(payload.email);
      if (userData) {
        return {
          username: payload.email,
          id: userData.id,
        };
      } else return false;
    } else {
      return false;
    }

    // return !!payload.sub;
  }
}
