"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
/**
 * Sign up (add user)
 *
 * @route POST /users
 * @param {Request<{}, {}, Omit<User, 'id'>>} req
 * @param {Response} res
 * @returns Respond with success/fail.
 */
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    if (!username.trim() || !email.trim() || !password.trim()) {
        res.status(500).json({
            message: "Missing username, email, or password!"
        });
        return;
    }
    const isSuccess = yield user_model_1.default.createUser({ username, email, password });
    if (!isSuccess) {
        res.status(409).json({
            message: "Username or email already taken!"
        });
        return;
    }
    res.status(201).json({
        message: "User successfully added!"
    });
});
/**
 * Log in (check user)
 *
 * @route POST /users/login
 * @param {Request<{}, {}, Omit<User,'id' | 'username'>>} req
 * @param {Response} res
 * @returns {void} Returns success and cookie.
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email.trim() || !password.trim()) {
        res.status(500).json({
            message: "Email or password cannot be empty!"
        });
        return;
    }
    const user = yield user_model_1.default.loginUser({ email, password });
    if (!user) {
        res.status(500).json({
            message: "Incorrect email or password!"
        });
        return;
    }
    if (req.session) {
        req.session.isLoggedIn = true;
        req.session.userId = user.id;
        req.session.username = user.username;
    }
    res.status(200).json({
        message: "Login successful!"
    });
});
/**
 * Get user by username
 *
 * @route GET /users/check-auth
 * @param {Request} req
 * @param {Response} res
 * @returns {void} return user data.
 */
const getUserByUsername = (req, res) => {
    if (!req.session || !req.session.username) {
        res.status(401).json({
            message: "Only logged-in user can access this page!"
        });
        return;
    }
    const { username } = req.session;
    const user = user_model_1.default.findByUsername(username);
    if (!user) {
        res.status(404).json({
            message: "User does not exist!"
        });
        return;
    }
    res.status(200).json({
        username: user.username,
        email: user.email,
    });
};
/**
 * Update username or password
 *
 * @route PUT /users/profile
 * @param {Request} req
 * @param {Response} res
 * @returns {void} updated profile.
 */
const updateAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session) {
        if (!req.session.userId) {
            res.status(500).json({
                message: "Not logged in!"
            });
            return;
        }
        const { username, password } = req.body;
        if (!(username === null || username === void 0 ? void 0 : username.trim()) && !(password === null || password === void 0 ? void 0 : password.trim())) {
            return res.status(400).json({ message: "Nothing to update!" });
        }
        const updated = yield user_model_1.default.updateUser(req.session.userId, { username, password });
        if (!updated) {
            return res.status(400).json({ message: "Update failed (username may be taken)." });
        }
        req.session.username = updated.username;
    }
    res.status(200).json({
        message: "Profile updated successfully!"
    });
});
/**
 * Log out
 *
 * @route GET /users/logout
 * @param {Request} req
 * @param {Response} res
 * @returns {void} Clear session cookie.
 */
const logout = (req, res) => {
    if (req.session) {
        req.session = null;
    }
    res.status(200).json({
        message: "Logout successful!"
    });
};
exports.default = {
    signup,
    login,
    getUserByUsername,
    updateAccount,
    logout,
};
