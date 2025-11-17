// Create your server
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import cookieSession from 'cookie-session'
import dotenv from 'dotenv'
dotenv.config()
import userRouter from './routes/user.routes'
import gameRouter from './routes/game.routes'

// Create server
const app = express()

// Middleware
app.use(cors({
    origin: "http://localhost:4321",
    credentials: true
}))
if (!process.env.COOKIE_PRIMARY_KEY || !process.env.COOKIE_SECONDARY_KEY) {
    throw new Error("Missing cookie keys!")
}

app.use(express.json())

app.use(cookieSession({
    name: "session",
    keys: [
        process.env.COOKIE_PRIMARY_KEY,
        process.env.COOKIE_SECONDARY_KEY
    ],
    maxAge: 3 * 30 * 24 * 60 * 60 * 1000, // 3 months
}))

// Routes
app.use('/users', userRouter)
app.use('/games', gameRouter)

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        message: "Invalid route!"
    })
})

// Start server
const PORT = process.env.PORT
if (!PORT) {
    throw new Error("Missing port!")
}
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})