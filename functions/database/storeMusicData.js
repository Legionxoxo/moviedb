const pool = require("../../database/pg");
const tableNames = require("../../data/tableNames");

/**
 * Stores or updates music data in the 'music' table.
 * @param {Object} music - The music data to store.
 */
async function storeMusicData(music) {
    let msg = "Music data stored successfully!";
    let success = false;

    const {
        genius_id,
        album_title,
        artist,
        release_year,
        cover_image,
        description,
        featured_artists,
    } = music;

    try {
        await pool.query(
            `
            INSERT INTO ${tableNames.music_db} (
                genius_id,
                album_title,
                artist,
                release_year,
                cover_image,
                description,
                featured_artists,
                created_at,
                updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT (genius_id) DO UPDATE SET
                album_title = EXCLUDED.album_title,
                artist = EXCLUDED.artist,
                release_year = EXCLUDED.release_year,
                cover_image = EXCLUDED.cover_image,
                description = EXCLUDED.description,
                featured_artists = EXCLUDED.featured_artists,
                updated_at = CURRENT_TIMESTAMP;
            `,
            [
                genius_id,
                album_title,
                artist,
                release_year || "Unknown",
                cover_image,
                description,
                featured_artists || [],
            ]
        );

        success = true;
    } catch (error) {
        console.error("❌ Error storing music data:", error.message);
        msg = "An error occurred while storing music data.";
    }

    return { success, msg };
}

module.exports = storeMusicData;
