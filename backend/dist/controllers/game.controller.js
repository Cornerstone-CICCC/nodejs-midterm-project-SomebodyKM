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
const game_model_1 = __importDefault(require("../models/game.model"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Browse games from RAWG API
 * @route GET /games
 */
const getAllGames = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apiKey = process.env.RAWG_API_KEY;
        if (!apiKey)
            throw new Error("Missing RAWG API key!");
        const response = yield fetch(`https://api.rawg.io/api/games?key=${apiKey}`);
        if (!response.ok)
            throw new Error("Failed to fetch games.");
        const data = yield response.json();
        const games = data.results.map((g) => ({
            id: g.id,
            name: g.name,
            background_image: g.background_image,
            rating: g.rating,
            genres: g.genres,
            description: g.description
        }));
        res.status(200).json({ games });
    }
    catch (err) {
        res.status(500).json({
            message: err.message || "Error fetching games."
        });
    }
});
/**
 * Read game detail from RAWG API
 * @route GET /games/:id
 */
const getGameById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const apiKey = process.env.RAWG_API_KEY;
        if (!apiKey)
            throw new Error("Missing RAWG API key!");
        const response = yield fetch(`https://api.rawg.io/api/games/${id}?key=${apiKey}`);
        if (!response.ok)
            throw new Error("Failed to fetch game details.");
        const data = yield response.json();
        const game = {
            id: data.id,
            name: data.name,
            background_image: data.background_image,
            rating: data.rating,
            genres: data.genres,
            description: data.description
        };
        res.status(200).json({ game });
    }
    catch (err) {
        res.status(500).json({
            message: err.message || "Error fetching game details."
        });
    }
});
/**
 * Add a game to user's favorites
 * @route POST /games/favorites
 */
const addFave = (req, res) => {
    try {
        if (req.session) {
            const username = req.session.username;
            if (!username) {
                res.status(500).json({
                    message: "You must be logged in!"
                });
                return;
            }
            const { id, name, background_image, rating, genres } = req.body;
            if (!id || !name) {
                res.status(400).json({
                    message: "Missing game data."
                });
                return;
            }
            const newFave = game_model_1.default.addFave(username, { id, name, background_image, rating, genres });
            if (!newFave) {
                res.status(409).json({
                    message: "Game already added!"
                });
                return;
            }
            res.status(201).json({
                message: "Added to favorites",
                favorite: newFave,
                isFave: true
            });
        }
    }
    catch (err) {
        res.status(500).json({
            message: err.message || "Error adding game."
        });
    }
};
/**
 * Get all user's favorites
 * @route GET /games/favorites/list
 */
const getAllFave = (req, res) => {
    try {
        if (req.session) {
            const username = req.session.username;
            if (!username) {
                res.status(500).json({
                    message: "You must be logged in!"
                });
                return;
            }
            const favorites = game_model_1.default.getFaveByUser(username);
            if (!favorites.length) {
                res.status(200).json({
                    message: "No favorites found.",
                    favorites: []
                });
                return;
            }
            res.status(200).json({
                message: "Favorites retrieved successfully!",
                favorites
            });
        }
    }
    catch (err) {
        res.status(500).json({
            message: err.message || "Error fetching favorites."
        });
    }
};
/**
 * Update a game's status in favorites
 * @route PUT /games/favorites/:gameId
 */
const updateFave = (req, res) => {
    try {
        if (req.session) {
            const username = req.session.username;
            if (!username) {
                res.status(500).json({
                    message: "You must be logged in!"
                });
                return;
            }
            const { faveId } = req.params;
            const { status } = req.body;
            if (!status) {
                res.status(400).json({
                    message: "Missing status to update."
                });
                return;
            }
            const updated = game_model_1.default.updateFave(faveId, username, { status });
            if (!updated) {
                res.status(404).json({
                    message: "Favorite not found!"
                });
                return;
            }
            res.status(200).json({
                message: "Favorite updated successfully!",
                updated
            });
        }
    }
    catch (err) {
        res.status(500).json({
            message: err.message || "Error updating favorites."
        });
    }
};
/**
 * Delete a game from favorites
 * @route DELETE /games/favorites/:gameId
 */
const deleteFave = (req, res) => {
    try {
        if (req.session) {
            const username = req.session.username;
            if (!username) {
                res.status(500).json({
                    message: "You must be logged in!"
                });
                return;
            }
            const { faveId } = req.params;
            const success = game_model_1.default.deleteFave(faveId, username);
            if (!success) {
                res.status(404).json({
                    message: "Favorite not found!"
                });
                return;
            }
            res.status(200).json({
                message: "Favorite deleted successfully!"
            });
        }
    }
    catch (err) {
        res.status(500).json({
            message: err.message || "Error deleting favorite."
        });
    }
};
exports.default = {
    getAllGames,
    getGameById,
    addFave,
    getAllFave,
    updateFave,
    deleteFave
};
