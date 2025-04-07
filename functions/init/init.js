const winston = require("winston");
const loggerTypes = require("../logger/logger");

const createMovieTable = require("./CreateMovieTable");
const createAnimeTable = require("./createAnimeTable");
const createAudiobookTable = require("./createAudiobookTable");
const createMusicTable = require("./createMusicTable");

const logger = winston.loggers.get(loggerTypes.default);

async function initPg() {
    try {
        await createMovieTable();
        await createAnimeTable();
        await createMusicTable();
        await createAudiobookTable();
    } catch (/** @type {any} */ error) {
        logger.error(`initPg(): ${error?.message}`);
        console.error(`initPg(): ${error?.message}`);
    }
}

module.exports = initPg;
