import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { TwoFactorAuthenticationService } from './2FA/twoFactorAuthentication.service';
import { JwtAuthGuard } from './jwt/jwt-auth.gaurd';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private twoFactorService: TwoFactorAuthenticationService
  ) { }

  @Post('/two')
  @UseGuards(JwtAuthGuard)
  async getTwoFactorJwt(@Request() req, @Response() res, @Body('code') code: string) {
    let user = await this.userService.getUserById(req.user.user.id);
    const isCodeValid = this.twoFactorService.isTwoFactorAuthenticationCodeValid(
      code, user
    );
    console.log(`twofactor code  :  ${isCodeValid}`);
    if (!isCodeValid) {
      console.log("fail");
      throw new UnauthorizedException('Wrong authentication code');
    }
    else
    {
      const payload = { id: user.id, isSecondFactorAuthenticated: true, sub: user.id };
      const jwt = await this.jwtService.sign(payload);
      res.setHeader('Authorization', 'Bearer ' + jwt);
      res.cookie('jwt', jwt, {
        maxAge: 60 * 60 * 1000
      });
      return res.send({
        message: 'success'
      });
    }
  }
}
