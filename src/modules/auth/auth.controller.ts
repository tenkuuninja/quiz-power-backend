import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
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

  @Get('/profile')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async getProfile(@User('id') userId: number) {
    return this.authService.getProfile({ id: userId });
  }
}
