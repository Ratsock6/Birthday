"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const rsvp_module_1 = require("./rsvp/rsvp.module");
const food_restrictions_module_1 = require("./food-restrictions/food-restrictions.module");
const wall_module_1 = require("./wall/wall.module");
const websocket_module_1 = require("./websocket/websocket.module");
const killer_module_1 = require("./killer/killer.module");
const media_module_1 = require("./media/media.module");
const questionnaire_module_1 = require("./questionnaire/questionnaire.module");
const anecdotes_module_1 = require("./anecdotes/anecdotes.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            jwt_1.JwtModule.register({
                global: true,
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '15m' },
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'uploads'),
                serveRoot: '/uploads',
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            rsvp_module_1.RsvpModule,
            food_restrictions_module_1.FoodRestrictionsModule,
            wall_module_1.WallModule,
            websocket_module_1.WebsocketModule,
            killer_module_1.KillerModule,
            media_module_1.MediaModule,
            questionnaire_module_1.QuestionnaireModule,
            anecdotes_module_1.AnecdotesModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map