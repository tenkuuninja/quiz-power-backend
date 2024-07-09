import {
  Controller,
  Get,
  HttpCode,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guard';
import { CategoryService } from './category.service';

@Controller('quiz')
@ApiTags('Quiz')
@ApiBearerAuth()
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('/get-list-category')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(200)
  async getListCategory() {
    return this.categoryService.getListCategory();
  }
}
