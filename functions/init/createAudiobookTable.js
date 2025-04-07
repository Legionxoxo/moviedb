const pool = require("../../database/pg");
const winston = require("winston");
const loggerTypes = require("../logger/logger");

const logger = winston.loggers.get(loggerTypes.default);

async function createAudiobookTable() {
    try {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS audiobooks (
                id SERIAL PRIMARY KEY,
                openlibrary_id TEXT UNIQUE NOT NULL,
                title TEXT,
                author TEXT,
                year TEXT,
                cover_image TEXT,
                ebook_available BOOLEAN DEFAULT FALSE,
                audiobook_available BOOLEAN DEFAULT FALSE,
                description TEXT,
                parsed BOOLEAN DEFAULT FALSE,
                error TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        logger.info("✅ Audiobooks table created or already exists.");
    } catch (error) {
        logger.error(`❌ createAudiobookTable(): ${error?.message}`);
        console.error(`createAudiobookTable(): ${error?.message}`);
    }
}

module.exports = createAudiobookTable;
