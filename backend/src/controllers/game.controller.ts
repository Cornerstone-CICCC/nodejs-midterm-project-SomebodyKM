import { Request, Response } from 'express'
import gameModel from '../models/game.model'
import { Game } from '../types/game'
import { GameFavorite } from '../types/gameFavorite'
import { v4 as uuidv4 } from "uuid"
import dotenv from 'dotenv'
dotenv.config()

/**
 * Browse games from RAWG API
 * @route GET /games
 */
const getAllGames = async (req: Request, res: Response) => {
    try {
        const apiKey = process.env.RAWG_API_KEY
        if (!apiKey) throw new Error("Missing RAWG API key!")

        const response = await fetch(`https://api.rawg.io/api/games?key=${apiKey}`)
        if (!response.ok) throw new Error("Failed to fetch games.")

        const data = await response.json()
        const games: Game[] = data.results.map((g: any) => ({
            id: g.id,
            name: g.name,
            background_image: g.background_image,
            rating: g.rating,
            genres: g.genres,
            description: g.description
        }))

        res.status(200).json({ games })
    } catch (err: any) {
        res.status(500).json({
            message: err.message || "Error fetching games."
        })
    }
}

/**
 * Read game detail from RAWG API
 * @route GET /games/:id
 */
const getGameById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const apiKey = process.env.RAWG_API_KEY
        if (!apiKey) throw new Error("Missing RAWG API key!")

        const response = await fetch(`https://api.rawg.io/api/games/${id}?key=${apiKey}`)
        if (!response.ok) throw new Error("Failed to fetch game details.")

        const data = await response.json()

        const game: Game = {
            id: data.id,
            name: data.name,
            background_image: data.background_image,
            rating: data.rating,
            genres: data.genres,
            description: data.description
        }

        res.status(200).json({ game })
    } catch (err: any) {
        res.status(500).json({
            message: err.message || "Error fetching game details."
        })
    }
}

/**
 * Add a game to user's favorites
 * @route POST /games/favorites
 */
const addFave = (req: Request, res: Response) => {
    try {
        if (req.session) {
            const username = req.session.username
            if (!username) {
                res.status(500).json({
                    message: "You must be logged in!"
                })
                return
            }

            const { id, name, background_image, rating, genres } = req.body
            if (!id || !name) {
                res.status(400).json({
                    message: "Missing game data."
                })
                return
            }

            const newFave = gameModel.addFave(username, { id, name, background_image, rating, genres })
            if (!newFave) {
                res.status(409).json({
                    message: "Game already added!"
                })
                return
            }
            res.status(201).json({
                message: "Added to favorites",
                favorite: newFave,
                isFave: true
            })
        }
    } catch (err: any) {
        res.status(500).json({
            message: err.message || "Error adding game."
        })
    }
}

/**
 * Get all user's favorites
 * @route GET /games/favorites/list
 */
const getAllFave = (req: Request, res: Response) => {
    try {
        if (req.session) {
            const username = req.session.username
            if (!username) {
                res.status(500).json({
                    message: "You must be logged in!"
                })
                return
            }

            const favorites = gameModel.getFaveByUser(username)
            if (!favorites.length) {
                res.status(200).json({
                    message: "No favorites found.",
                    favorites: []
                })
                return
            }

            res.status(200).json({
                message: "Favorites retrieved successfully!",
                favorites
            })
        }
    } catch (err: any) {
        res.status(500).json({
            message: err.message || "Error fetching favorites."
        })
    }
}

/**
 * Update a game's status in favorites
 * @route PUT /games/favorites/:gameId
 */
const updateFave = (req: Request, res: Response) => {
    try {
        if (req.session) {
            const username = req.session.username
            if (!username) {
                res.status(500).json({
                    message: "You must be logged in!"
                })
                return
            }

            const { faveId } = req.params
            const { status } = req.body

            if (!status) {
                res.status(400).json({
                    message: "Missing status to update."
                })
                return
            }

            const updated = gameModel.updateFave(faveId, username, { status })
            if (!updated) {
                res.status(404).json({
                    message: "Favorite not found!"
                })
                return
            }

            res.status(200).json({
                message: "Favorite updated successfully!",
                updated
            })
        }
    } catch (err: any) {
        res.status(500).json({
            message: err.message || "Error updating favorites."
        })
    }
}

/**
 * Delete a game from favorites
 * @route DELETE /games/favorites/:gameId
 */
const deleteFave = (req: Request, res: Response) => {
    try {
        if (req.session) {
            const username = req.session.username
            if (!username) {
                res.status(500).json({
                    message: "You must be logged in!"
                })
                return
            }

            const { faveId } = req.params

            const success = gameModel.deleteFave(faveId, username)
            if (!success) {
                res.status(404).json({
                    message: "Favorite not found!"
                })
                return
            }

            res.status(200).json({
                message: "Favorite deleted successfully!"
            })
        }
    } catch (err: any) {
        res.status(500).json({
            message: err.message || "Error deleting favorite."
        })
    }
}

export default {
    getAllGames,
    getGameById,
    addFave,
    getAllFave,
    updateFave,
    deleteFave
}