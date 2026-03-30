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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KillerController = void 0;
const common_1 = require("@nestjs/common");
const killer_service_1 = require("./killer.service");
const killer_dto_1 = require("./dto/killer.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
let KillerController = class KillerController {
    killerService;
    constructor(killerService) {
        this.killerService = killerService;
    }
    getMissions() { return this.killerService.getMissions(); }
    createMission(dto) { return this.killerService.createMission(dto); }
    deleteMission(id) { return this.killerService.deleteMission(id); }
    getGame() { return this.killerService.getOrCreateGame(); }
    updateSettings(id, dto) {
        return this.killerService.updateSettings(id, dto);
    }
    toggleParticipant(gameId, dto) {
        return this.killerService.toggleParticipant(gameId, dto.userId);
    }
    startGame(id) { return this.killerService.startGame(id); }
    resetGame(id) { return this.killerService.resetGame(id); }
    getLeaderboard(id) { return this.killerService.getLeaderboard(id); }
    getMyAssignment(user) {
        return this.killerService.getMyAssignment(user.sub);
    }
    requestElimination(user) {
        return this.killerService.requestElimination(user.sub);
    }
    resolveElimination(user, dto) {
        return this.killerService.resolveElimination(user.sub, dto);
    }
};
exports.KillerController = KillerController;
__decorate([
    (0, common_1.Get)('missions'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KillerController.prototype, "getMissions", null);
__decorate([
    (0, common_1.Post)('missions'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [killer_dto_1.CreateMissionDto]),
    __metadata("design:returntype", void 0)
], KillerController.prototype, "createMission", null);
__decorate([
    (0, common_1.Delete)('missions/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KillerController.prototype, "deleteMission", null);
__decorate([
    (0, common_1.Get)('game'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KillerController.prototype, "getGame", null);
__decorate([
    (0, common_1.Patch)('game/:id/settings'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, killer_dto_1.UpdateGameSettingsDto]),
    __metadata("design:returntype", void 0)
], KillerController.prototype, "updateSettings", null);
__decorate([
    (0, common_1.Post)('game/:id/participants'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, killer_dto_1.ToggleParticipantDto]),
    __metadata("design:returntype", void 0)
], KillerController.prototype, "toggleParticipant", null);
__decorate([
    (0, common_1.Post)('game/:id/start'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KillerController.prototype, "startGame", null);
__decorate([
    (0, common_1.Post)('game/:id/reset'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KillerController.prototype, "resetGame", null);
__decorate([
    (0, common_1.Get)('game/:id/leaderboard'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KillerController.prototype, "getLeaderboard", null);
__decorate([
    (0, common_1.Get)('assignment/me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KillerController.prototype, "getMyAssignment", null);
__decorate([
    (0, common_1.Post)('eliminate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KillerController.prototype, "requestElimination", null);
__decorate([
    (0, common_1.Post)('eliminate/resolve'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, killer_dto_1.ResolveEliminationDto]),
    __metadata("design:returntype", void 0)
], KillerController.prototype, "resolveElimination", null);
exports.KillerController = KillerController = __decorate([
    (0, common_1.Controller)('killer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [killer_service_1.KillerService])
], KillerController);
//# sourceMappingURL=killer.controller.js.map