import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '../../common/decorators/user.decorator';
import { EUserRole } from '../../common/enums/entity.enum';
import { AuthGuard } from '../../common/guard';
import {
  CreateQuizDto,
  DeleteQuizDto,
  ExportQuizDto,
  GetDetailQuizDto,
  GetListQuizDto,
  SuggestionAnswerDto,
  SuggestionQuestionDto,
  UpdateQuizDto,
} from './dto';
import { QuizService } from './quiz.service';

@Controller('quiz')
@ApiTags('Quiz')
@ApiBearerAuth()
export class QuizController {
  constructor(private quizService: QuizService) {}

  @Get('/get-outstanding-quiz')
  @HttpCode(200)
  async getListOutstandingQuiz() {
    return this.quizService.getListOutstandingQuiz();
  }

  @Get('/get-list-quiz')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(200)
  async getListQuiz(
    @Query() query: GetListQuizDto,
    @User('id') userId: number,
    @User('role') role: EUserRole,
  ) {
    return this.quizService.getListQuiz({
      ...query,
      userId: role === EUserRole.Admin ? undefined : userId,
    });
  }

  @Get('/get-detail-quiz')
  @UsePipes(new ValidationPipe({ transform: true }))
  // @UseGuards(AuthGuard)
  @HttpCode(200)
  async getDetailQuiz(@Query() query: GetDetailQuizDto) {
    return this.quizService.getDetailQuiz(query);
  }

  @Post('/create-quiz')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async createQuiz(@Body() body: CreateQuizDto, @User('id') userId) {
    return this.quizService.createQuiz({ ...body, userId });
  }

  @Patch('/update-quiz')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async updateQuiz(@Body() body: UpdateQuizDto) {
    return this.quizService.updateQuiz(body);
  }

  @Delete('/delete-quiz')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async deleteQuiz(@Query() query: DeleteQuizDto) {
    return this.quizService.deleteQuiz(query);
  }

  @Post('/suggestion-question')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async suggestQuestionCompletion(@Body() body: SuggestionQuestionDto) {
    return this.quizService.suggestQuestionCompletion(body);
  }

  @Post('/suggestion-answer')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async suggestAnswerCompletion(@Body() body: SuggestionAnswerDto) {
    return this.quizService.suggestAnswerCompletion(body);
  }

  @Post('/export-pdf')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async exportQuizPdf(@Body() body: ExportQuizDto) {
    return this.quizService.exportQuizPdf(body);
  }
}
