import { Router } from "express";
import gameController from "../controllers/game.controller";
import { checkLogin } from "../middleware/auth.middleware";

const gameRouter = Router()

gameRouter.get("/", gameController.getAllGames)
gameRouter.get("/:id", gameController.getGameById)
gameRouter.get("/favorites/list", checkLogin, gameController.getAllFave)
gameRouter.post("/favorites", checkLogin, gameController.addFave)
gameRouter.put("/favorites/:faveId", checkLogin, gameController.updateFave)
gameRouter.delete("/favorites/:faveId", checkLogin, gameController.deleteFave)

export default gameRouter