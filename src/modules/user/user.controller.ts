import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guard';
import { DeleteUserDto, GetListUserDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/get-list-user')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(200)
  async getListUser(@Query() query: GetListUserDto) {
    return this.userService.getListUser(query);
  }

  @Delete('/delete-user')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async deleteUser(@Query() query: DeleteUserDto) {
    return this.userService.deleteUser(query);
  }
}
