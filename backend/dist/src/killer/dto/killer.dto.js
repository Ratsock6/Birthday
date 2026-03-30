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
exports.ResolveEliminationDto = exports.ToggleParticipantDto = exports.UpdateGameSettingsDto = exports.CreateMissionDto = void 0;
const class_validator_1 = require("class-validator");
class CreateMissionDto {
    description;
}
exports.CreateMissionDto = CreateMissionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMissionDto.prototype, "description", void 0);
class UpdateGameSettingsDto {
    showLeaderboard;
}
exports.UpdateGameSettingsDto = UpdateGameSettingsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateGameSettingsDto.prototype, "showLeaderboard", void 0);
class ToggleParticipantDto {
    userId;
}
exports.ToggleParticipantDto = ToggleParticipantDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ToggleParticipantDto.prototype, "userId", void 0);
class ResolveEliminationDto {
    requestId;
    confirm;
}
exports.ResolveEliminationDto = ResolveEliminationDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ResolveEliminationDto.prototype, "requestId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ResolveEliminationDto.prototype, "confirm", void 0);
//# sourceMappingURL=killer.dto.js.map