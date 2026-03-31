import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards,
} from '@nestjs/common';
import { QuestionnaireService } from './questionnaire.service';
import {
  CreateQuestionnaireDto, UpdateQuestionnaireDto,
  CreateQuestionDto, SubmitAnswersDto,
} from './dto/questionnaire.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('questionnaire')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuestionnaireController {
  constructor(private questionnaireService: QuestionnaireService) {}

  // ─── ADMIN ────────────────────────────────────────────────────────────────

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateQuestionnaireDto) {
    return this.questionnaireService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateQuestionnaireDto) {
    return this.questionnaireService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.questionnaireService.remove(id);
  }

  @Post(':id/questions')
  @Roles(Role.ADMIN)
  addQuestion(@Param('id') id: string, @Body() dto: CreateQuestionDto) {
    return this.questionnaireService.addQuestion(id, dto);
  }

  @Delete('questions/:questionId')
  @Roles(Role.ADMIN)
  removeQuestion(@Param('questionId') questionId: string) {
    return this.questionnaireService.removeQuestion(questionId);
  }

  @Get(':id/results')
  @Roles(Role.ADMIN)
  getResults(@Param('id') id: string) {
    return this.questionnaireService.getResults(id);
  }

  // ─── INVITÉS ──────────────────────────────────────────────────────────────

  @Get()
  findAll(@CurrentUser() user: { role: string }) {
    const isAdmin = user.role === Role.ADMIN;
    return this.questionnaireService.findAll(!isAdmin);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionnaireService.findOne(id);
  }

  @Post(':id/answer')
  submitAnswers(
    @CurrentUser() user: { sub: string },
    @Param('id') questionnaireId: string,
    @Body() dto: SubmitAnswersDto,
  ) {
    return this.questionnaireService.submitAnswers(user.sub, questionnaireId, dto);
  }

  @Get(':id/my-answers')
  getMyAnswers(
    @CurrentUser() user: { sub: string },
    @Param('id') questionnaireId: string,
  ) {
    return this.questionnaireService.getMyAnswers(user.sub, questionnaireId);
  }
}