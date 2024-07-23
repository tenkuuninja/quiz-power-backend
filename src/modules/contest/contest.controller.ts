import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '../../common/decorators/user.decorator';
import { AuthGuard } from '../../common/guard';
import { ContestService } from './contest.service';
import {
  CreateContestDto,
  EndContestDto,
  FindContestDto,
  GetDetailContestDto,
  GetListContestDto,
  StartContestDto,
} from './dto';
import { JoinContestDto } from './dto/join-contest.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

@Controller('contest')
@ApiTags('Contest')
@ApiBearerAuth()
export class ContestController {
  constructor(private contestService: ContestService) {}

  @Get('/get-list-contest')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(200)
  async getListContest(
    @Query() query: GetListContestDto,
    @User('id') userId: number,
  ) {
    return this.contestService.getListContest({ ...query, userId });
  }

  @Get('/get-detail-contest')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async getDetailContest(@Query() query: GetDetailContestDto) {
    return this.contestService.getDetailContest(query);
  }

  @Post('/create-contest')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async createContest(@Body() body: CreateContestDto, @User('id') userId) {
    return this.contestService.createContest({ ...body, userId });
  }

  @Post('/find-contest')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async findContest(@Body() body: FindContestDto) {
    return this.contestService.getContestByCode({ ...body });
  }

  @Post('/start-contest')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async startContest(@Body() body: StartContestDto, @User('id') userId) {
    return this.contestService.startContest({ ...body, userId });
  }

  @Post('/end-contest')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async endContest(@Body() body: EndContestDto, @User('id') userId) {
    return this.contestService.endContest({ ...body, userId });
  }

  @Post('/join-contest')
  @UsePipes(new ValidationPipe({ transform: true }))
  // @UseGuards(AuthGuard)
  @HttpCode(200)
  async joinContest(@Body() body: JoinContestDto, @User('id') userId) {
    return this.contestService.joinContest({ ...body, userId });
  }

  @Post('/submit-answer')
  @UsePipes(new ValidationPipe({ transform: true }))
  // @UseGuards(AuthGuard)
  @HttpCode(200)
  async submitAnswerContest(@Body() body: SubmitAnswerDto, @User('id') userId) {
    return this.contestService.submitAnswer({ ...body });
  }
}
