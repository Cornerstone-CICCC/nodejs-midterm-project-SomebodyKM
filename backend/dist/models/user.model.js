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
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
class UserModel {
    constructor() {
        this.users = [];
    }
    // Create user
    createUser(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password } = newUser;
            const foundIndex = this.users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
            if (foundIndex !== -1)
                return false;
            const hashedPassword = yield bcrypt_1.default.hash(password, 12);
            this.users.push({
                id: (0, uuid_1.v4)(),
                username,
                email,
                password: hashedPassword
            });
            return true;
        });
    }
    // Check user
    loginUser(details) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = details;
            const found = this.users.find(u => u.email === email);
            if (!found)
                return null;
            const isMatch = yield bcrypt_1.default.compare(password, found.password);
            if (!isMatch)
                return null;
            return found;
        });
    }
    // Find user by username
    findByUsername(username) {
        const user = this.users.find(u => u.username === username);
        if (!user)
            return false;
        return {
            username: user.username,
            email: user.email
        };
    }
    // Find user by id
    findById(id) {
        var _a;
        return (_a = this.users.find(u => u.id === id)) !== null && _a !== void 0 ? _a : null;
    }
    // Get user by id
    getUserById(id) {
        const user = this.findById(id);
        if (!user)
            return null;
        return {
            username: user.username,
            email: user.email
        };
    }
    // Update user
    updateUser(id, update) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.findById(id);
            if (!user)
                return null;
            if (update.username) {
                const newUsername = update.username.trim();
                if (newUsername.toLowerCase() !== user.username.toLowerCase() && this.users.some(u => u.username.toLowerCase() === newUsername.toLowerCase())) {
                    return null;
                }
                user.username = newUsername;
            }
            if (update.password) {
                user.password = yield bcrypt_1.default.hash(update.password, 12);
            }
            return {
                username: user.username,
                email: user.email
            };
        });
    }
    // Delete user
    deleteUser(id) {
        const index = this.users.findIndex(u => u.id === id);
        if (index === -1)
            return false;
        this.users.splice(index, 1);
        return true;
    }
}
exports.default = new UserModel;
