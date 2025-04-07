const tableNames = require("../../data/tableNames");
const pool = require("../../database/pg");

/**
 * Stores or updates anime data in the 'animes' table.
 * @param {Object} anime - The anime data to store.
 */
async function storeAnimeData(anime) {
    let msg = "Anime data stored successfully!";
    let success = false;

    const { anilist_id, title, year, genres, description, score, cover_image } =
        anime;

    try {
        await pool.query(
            `
            INSERT INTO ${tableNames.anime_db} (
                anilist_id,
                title,
                year,
                genres,
                description,
                score,
                cover_image,
                created_at,
                updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT (anilist_id) DO UPDATE SET
                title = EXCLUDED.title,
                year = EXCLUDED.year,
                genres = EXCLUDED.genres,
                description = EXCLUDED.description,
                score = EXCLUDED.score,
                cover_image = EXCLUDED.cover_image,
                updated_at = CURRENT_TIMESTAMP;
            `,
            [anilist_id, title, year, genres, description, score, cover_image]
        );

        success = true;
    } catch (error) {
        console.error("❌ Error storing anime data:", error.message);
        msg = "An error occurred while storing anime data.";
    }

    return { success, msg };
}

module.exports = storeAnimeData;
