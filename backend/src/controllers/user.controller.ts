import { Request, Response } from 'express'
import userModel from '../models/user.model'
import { User } from '../types/user'

/**
 * Sign up (add user)
 * 
 * @route POST /users
 * @param {Request<{}, {}, Omit<User, 'id'>>} req
 * @param {Response} res
 * @returns Respond with success/fail.
 */
const signup = async (req: Request<{}, {}, Omit<User, 'id'>>, res: Response) => {
    const { username, email, password } = req.body
    if (!username.trim() || !email.trim() || !password.trim()) {
        res.status(500).json({
            message: "Missing username, email, or password!"
        })
        return
    }
    const isSuccess = await userModel.createUser({ username, email, password })
    if (!isSuccess) {
        res.status(409).json({
            message: "Username or email already taken!"
        })
        return
    }
    res.status(201).json({
        message: "User successfully added!"
    })
}

/**
 * Log in (check user)
 * 
 * @route POST /users/login
 * @param {Request<{}, {}, Omit<User,'id' | 'username'>>} req
 * @param {Response} res
 * @returns {void} Returns success and cookie.
 */
const login = async (req: Request<{}, {}, Omit<User, 'id' | 'username'>>, res: Response) => {
    const { email, password } = req.body
    if (!email.trim() || !password.trim()) {
        res.status(500).json({
            message: "Email or password cannot be empty!"
        })
        return
    }
    const user = await userModel.loginUser({ email, password })
    if (!user) {
        res.status(500).json({
            message: "Incorrect email or password!"
        })
        return
    }
    if (req.session) {
        req.session.isLoggedIn = true
        req.session.userId = user.id
        req.session.username = user.username
    }
    res.status(200).json({
        message: "Login successful!"
    })
}

/**
 * Get user by username
 * 
 * @route GET /users/check-auth
 * @param {Request} req
 * @param {Response} res
 * @returns {void} return user data.
 */
const getUserByUsername = (req: Request, res: Response) => {
    if (!req.session || !req.session.username) {
        res.status(401).json({
            message: "Only logged-in user can access this page!"
        })
        return
    }
    const { username } = req.session
    const user = userModel.findByUsername(username)
    if (!user) {
        res.status(404).json({
            message: "User does not exist!"
        })
        return
    }
    res.status(200).json({
        username: user.username,
        email: user.email,
    })
}

/**
 * Update username or password
 * 
 * @route PUT /users/profile
 * @param {Request} req
 * @param {Response} res
 * @returns {void} updated profile.
 */
const updateAccount = async (
    req: Request<{}, {}, Partial<User>>,
    res: Response
) => {
    if (req.session) {
        if (!req.session.userId) {
            res.status(500).json({
                message: "Not logged in!"
            })
            return
        }

        const { username, password } = req.body

        if (!username?.trim() && !password?.trim()) {
            return res.status(400).json({ message: "Nothing to update!" })
        }

        const updated = await userModel.updateUser(req.session.userId, { username, password })

        if (!updated) {
            return res.status(400).json({ message: "Update failed (username may be taken)." });
        }

        req.session.username = updated.username
    }

    res.status(200).json({
        message: "Profile updated successfully!"
    })
}

/**
 * Log out
 * 
 * @route GET /users/logout
 * @param {Request} req
 * @param {Response} res
 * @returns {void} Clear session cookie.
 */
const logout = (req: Request, res: Response) => {
    if (req.session) {
        req.session = null
    }
    res.status(200).json({
        message: "Logout successful!"
    })
}


export default {
    signup,
    login,
    getUserByUsername,
    updateAccount,
    logout,
}