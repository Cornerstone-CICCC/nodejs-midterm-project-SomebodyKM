import { v4 as uuidv4 } from "uuid"
import { GameFavorite } from "../types/gameFavorite"

class GameModel {
    private favorites: GameFavorite[] = []

    // Add game to favorite
    addFave(userId: string, rawgGame: { id: number, name: string, background_image: string, rating: number, genres: string }) {
        const exists = this.favorites.find(f => f.userId === userId && f.gameId === rawgGame.id)
        if (exists) return null

        const newFave: GameFavorite = {
            id: uuidv4(),
            userId,
            gameId: rawgGame.id,
            title: rawgGame.name,
            image: rawgGame.background_image || "",
            rating: rawgGame.rating,
            genres: rawgGame.genres,
            status: "Wishlist",
        }

        this.favorites.push(newFave)
        return newFave
    }

    // Get all favorite
    getFaveByUser(userId: string) {
        return this.favorites.filter(f => f.userId === userId)
    }

    // Get one favorite by ID
    getFaveById(faveId: string) {
        return this.favorites.find(f => f.id === faveId) || null
    }

    // Update favorite
    updateFave(faveId: string, userId: string, updates: Pick<GameFavorite, "status">) {
        const fave = this.favorites.find(f => f.id === faveId && f.userId === userId)
        if (!fave) return null

        if (updates.status) {
            fave.status = updates.status
        }

        return fave
    }

    // Delete Favorite from user's list
    deleteFave(faveId: string, userId: string) {
        const index = this.favorites.findIndex(f => f.id === faveId && f.userId === userId)
        if (index === -1) return false
        this.favorites.splice(index, 1)
        return true
    }

    // Clear all
    clearAll() {
        this.favorites = []
    }
}

export default new GameModel