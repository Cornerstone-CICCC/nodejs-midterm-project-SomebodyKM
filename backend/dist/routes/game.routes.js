"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const game_controller_1 = __importDefault(require("../controllers/game.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const gameRouter = (0, express_1.Router)();
gameRouter.get("/", game_controller_1.default.getAllGames);
gameRouter.get("/:id", game_controller_1.default.getGameById);
gameRouter.get("/favorites/list", auth_middleware_1.checkLogin, game_controller_1.default.getAllFave);
gameRouter.post("/favorites", auth_middleware_1.checkLogin, game_controller_1.default.addFave);
gameRouter.put("/favorites/:faveId", auth_middleware_1.checkLogin, game_controller_1.default.updateFave);
gameRouter.delete("/favorites/:faveId", auth_middleware_1.checkLogin, game_controller_1.default.deleteFave);
exports.default = gameRouter;
