export interface GameFavorite {
    id: string,
    userId: string,
    gameId: number,
    title: string,
    image: string,
    rating: number,
    genres: string,
    status: "Wishlist" | "Playing" | "Completed",
}