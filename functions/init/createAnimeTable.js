// CreateAnimeTable.js
const pool = require("../../database/pg");
const winston = require("winston");
const loggerTypes = require("../logger/logger");

const logger = winston.loggers.get(loggerTypes.default);

async function createAnimeTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS animes (
                id SERIAL PRIMARY KEY,
                anilist_id INTEGER UNIQUE NOT NULL
                title TEXT NOT NULL,
                year INTEGER,
                genres TEXT[],
                description TEXT,
                score INTEGER,
                cover_image TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        logger.info("✅ Anime table created or already exists.");
    } catch (error) {
        logger.error(`❌ createAnimeTable(): ${error?.message}`);
        console.error(`createAnimeTable(): ${error?.message}`);
    }
}

module.exports = createAnimeTable;
