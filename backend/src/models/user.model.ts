import { User } from "../types/user";
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

class UserModel {
    private users: User[] = []

    // Create user
    async createUser(newUser: Omit<User, 'id'>) {
        const { username, email, password } = newUser
        const foundIndex = this.users.findIndex(
            u => u.username.toLowerCase() === username.toLowerCase()
        )
        if (foundIndex !== -1) return false
        const hashedPassword = await bcrypt.hash(password, 12)
        this.users.push({
            id: uuidv4(),
            username,
            email,
            password: hashedPassword
        })
        return true
    }

    // Check user
    async loginUser(details: Omit<User, 'username' | 'id'>) {
        const { email, password } = details
        const found = this.users.find(u => u.email === email)
        if (!found) return null
        const isMatch = await bcrypt.compare(password, found.password)
        if (!isMatch) return null
        return found
    }

    // Find user by username
    findByUsername(username: string) {
        const user = this.users.find(u => u.username === username)
        if (!user) return false
        return {
            username: user.username,
            email: user.email
        }
    }

    // Find user by id
    findById(id: string) {
        return this.users.find(u => u.id === id) ?? null
    }

    // Get user by id
    getUserById(id: string) {
        const user = this.findById(id);
        if (!user) return null;
        return {
            username: user.username,
            email: user.email
        }
    }

    // Update user
    async updateUser(id: string, update: Partial<User>) {
        const user = this.findById(id)
        if (!user) return null

        if (update.username) {
            const newUsername = update.username.trim()

            if (newUsername.toLowerCase() !== user.username.toLowerCase() && this.users.some(u => u.username.toLowerCase() === newUsername.toLowerCase())) {
                return null
            }
            user.username = newUsername
        }

        if (update.password) {
            user.password = await bcrypt.hash(update.password, 12)
        }

        return {
            username: user.username,
            email: user.email
        }
    }

    // Delete user
    deleteUser(id: string) {
        const index = this.users.findIndex(u => u.id === id)
        if (index === -1) return false
        this.users.splice(index, 1)
        return true
    }
}

export default new UserModel