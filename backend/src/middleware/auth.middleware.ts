import { Request, Response, NextFunction } from 'express'

export const checkLogin = (req: Request, res: Response, next: NextFunction) => {

    if (!req.session || !req.session.isLoggedIn || !req.session.username) {
        res.status(401).json({
            message: "You are not allowed to access this!"
        })
        return
    }
    next()
}

export const checkLogout = (req: Request, res: Response, next: NextFunction) => {
    if (req.session && req.session.isLoggedIn) {
        res.status(500).json({
            message: "You are already logged in!"
        })
        return
    }
    next()
}