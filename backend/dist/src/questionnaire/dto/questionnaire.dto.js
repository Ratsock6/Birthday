"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmitAnswersDto = exports.AnswerDto = exports.CreateQuestionDto = exports.UpdateQuestionnaireDto = exports.CreateQuestionnaireDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class CreateQuestionnaireDto {
    title;
    isOpen;
}
exports.CreateQuestionnaireDto = CreateQuestionnaireDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuestionnaireDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateQuestionnaireDto.prototype, "isOpen", void 0);
class UpdateQuestionnaireDto {
    title;
    isOpen;
}
exports.UpdateQuestionnaireDto = UpdateQuestionnaireDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateQuestionnaireDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateQuestionnaireDto.prototype, "isOpen", void 0);
class CreateQuestionDto {
    text;
    type;
    options;
    order;
}
exports.CreateQuestionDto = CreateQuestionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuestionDto.prototype, "text", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.QuestionType),
    __metadata("design:type", String)
], CreateQuestionDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateQuestionDto.prototype, "options", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateQuestionDto.prototype, "order", void 0);
class AnswerDto {
    questionId;
    value;
}
exports.AnswerDto = AnswerDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnswerDto.prototype, "questionId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnswerDto.prototype, "value", void 0);
class SubmitAnswersDto {
    answers;
}
exports.SubmitAnswersDto = SubmitAnswersDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AnswerDto),
    __metadata("design:type", Array)
], SubmitAnswersDto.prototype, "answers", void 0);
//# sourceMappingURL=questionnaire.dto.js.map