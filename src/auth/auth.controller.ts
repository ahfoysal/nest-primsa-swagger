import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignUpDto } from './dto/auth.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // SignUp
  @Post('signup')
  signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  // SignIn
  @Post('signin')
  signIn(@Body() body: SigninDto) {
    return this.authService.signIn(body);
  }
  // check  me user
  @Get('me')
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  me(@Req() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.authService.me(req.userId);
  }
}
