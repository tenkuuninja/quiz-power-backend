import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  ForgotPasswordVerifyDto,
  LoginDto,
  RegisterDto,
  UpdateProfileDto,
} from './dto';
import { User } from '../../common/decorators/user.decorator';
import { AuthGuard } from '../../common/guard';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
export class AppUserController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  // @UseGuards(AuthGuard)
  @HttpCode(200)
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('/register')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(200)
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('/forgot-password')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(200)
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body);
  }

  @Post('/forgot-password-verify')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(200)
  async forgotPasswordVerify(@Body() body: ForgotPasswordVerifyDto) {
    return this.authService.forgotPasswordVerify(body);
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async getProfile(@User('id') userId: number) {
    return this.authService.getProfile({ id: userId });
  }

  @Patch('/profile')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(200)
  async updateProfile(
    @Body() body: UpdateProfileDto,
    @User('id') userId: number,
  ) {
    return this.authService.updateProfile({ ...body, id: userId });
  }

  @Post('/change-password')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(200)
  async changePasswordProfile(
    @Body() body: ChangePasswordDto,
    @User('id') userId: number,
  ) {
    return this.authService.changePasswordProfile({ ...body, id: userId });
  }
}
