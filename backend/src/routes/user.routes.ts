import { Router } from "express";
import userController from "../controllers/user.controller";
import { checkLogin, checkLogout } from "../middleware/auth.middleware";

const userRouter = Router()

userRouter.post('/signup', checkLogout, userController.signup)
userRouter.post('/login', checkLogout, userController.login)
userRouter.get('/logout', checkLogin, userController.logout)
userRouter.get('/check-auth', checkLogin, userController.getUserByUsername)
userRouter.put('/profile', checkLogin, userController.updateAccount)

export default userRouter