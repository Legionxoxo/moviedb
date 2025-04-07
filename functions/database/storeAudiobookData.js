const pool = require("../../database/pg");

/**
 * Stores or updates audiobook data in the 'audiobooks' table.
 * @param {Object} audiobook - The audiobook data to store.
 */
async function storeAudiobookData(audiobook) {
    let msg = "Audiobook data stored successfully!";
    let success = false;

    const {
        openlibrary_id,
        title,
        author,
        year,
        cover_image,
        ebook_available = false,
        audiobook_available = false,
        description,
        parsed = false,
        error = null,
    } = audiobook;

    try {
        await pool.query(
            `
            INSERT INTO audiobooks (
                openlibrary_id,
                title,
                author,
                year,
                cover_image,
                ebook_available,
                audiobook_available,
                description,
                parsed,
                error,
                created_at,
                updated_at
            ) VALUES (
                $1, $2, $3, $4, $5,
                $6, $7, $8, $9, $10,
                CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )
            ON CONFLICT (openlibrary_id) DO UPDATE SET
                title = EXCLUDED.title,
                author = EXCLUDED.author,
                year = EXCLUDED.year,
                cover_image = EXCLUDED.cover_image,
                ebook_available = EXCLUDED.ebook_available,
                audiobook_available = EXCLUDED.audiobook_available,
                description = EXCLUDED.description,
                parsed = EXCLUDED.parsed,
                error = EXCLUDED.error,
                updated_at = CURRENT_TIMESTAMP;
            `,
            [
                openlibrary_id,
                title,
                author,
                year,
                cover_image,
                ebook_available,
                audiobook_available,
                description,
                parsed,
                error,
            ]
        );

        success = true;
    } catch (error) {
        console.error("❌ Error storing audiobook data:", error.message);
        msg = "An error occurred while storing audiobook data.";
    }

    return { success, msg };
}

module.exports = storeAudiobookData;
