"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class GameModel {
    constructor() {
        this.favorites = [];
    }
    // Add game to favorite
    addFave(userId, rawgGame) {
        const exists = this.favorites.find(f => f.userId === userId && f.gameId === rawgGame.id);
        if (exists)
            return null;
        const newFave = {
            id: (0, uuid_1.v4)(),
            userId,
            gameId: rawgGame.id,
            title: rawgGame.name,
            image: rawgGame.background_image || "",
            rating: rawgGame.rating,
            genres: rawgGame.genres,
            status: "Wishlist",
        };
        this.favorites.push(newFave);
        return newFave;
    }
    // Get all favorite
    getFaveByUser(userId) {
        return this.favorites.filter(f => f.userId === userId);
    }
    // Get one favorite by ID
    getFaveById(faveId) {
        return this.favorites.find(f => f.id === faveId) || null;
    }
    // Update favorite
    updateFave(faveId, userId, updates) {
        const fave = this.favorites.find(f => f.id === faveId && f.userId === userId);
        if (!fave)
            return null;
        if (updates.status) {
            fave.status = updates.status;
        }
        return fave;
    }
    // Delete Favorite from user's list
    deleteFave(faveId, userId) {
        const index = this.favorites.findIndex(f => f.id === faveId && f.userId === userId);
        if (index === -1)
            return false;
        this.favorites.splice(index, 1);
        return true;
    }
    // Clear all
    clearAll() {
        this.favorites = [];
    }
}
exports.default = new GameModel;
