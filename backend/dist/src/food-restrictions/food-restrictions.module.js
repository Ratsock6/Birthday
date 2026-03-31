"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodRestrictionsModule = void 0;
const common_1 = require("@nestjs/common");
const food_restrictions_service_1 = require("./food-restrictions.service");
const food_restrictions_controller_1 = require("./food-restrictions.controller");
let FoodRestrictionsModule = class FoodRestrictionsModule {
};
exports.FoodRestrictionsModule = FoodRestrictionsModule;
exports.FoodRestrictionsModule = FoodRestrictionsModule = __decorate([
    (0, common_1.Module)({
        controllers: [food_restrictions_controller_1.FoodRestrictionsController],
        providers: [food_restrictions_service_1.FoodRestrictionsService],
    })
], FoodRestrictionsModule);
//# sourceMappingURL=food-restrictions.module.js.map