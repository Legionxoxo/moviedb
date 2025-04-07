const pool = require("../../database/pg");
const winston = require("winston");
const loggerTypes = require("../logger/logger");

const logger = winston.loggers.get(loggerTypes.default);

async function createMusicTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS music (
                id SERIAL PRIMARY KEY,
                genius_id INTEGER UNIQUE NOT NULL
                album_title TEXT NOT NULL,
                artist TEXT NOT NULL,
                release_year TEXT DEFAULT 'Unknown',
                cover_image TEXT,
                description TEXT,
                featured_artists TEXT[], -- For future-proofing, even if empty now
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        logger.info("🎶 Music table created or already exists.");
    } catch (error) {
        logger.error(`❌ createMusicTable(): ${error?.message}`);
        console.error(`createMusicTable(): ${error?.message}`);
    }
}

module.exports = createMusicTable;
