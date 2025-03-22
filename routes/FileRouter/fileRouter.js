const express = require("express");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const extractDetails = require("../../functions/extractDetails");

const router = express.Router();
const rootFolder = process.env.ROOT_FOLDER;

// Helper function to read files in a subfolder
const readFolderContents = (folderPath) => {
    return new Promise((resolve, reject) => {
        fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
            if (err) {
                return reject(`Failed to read contents of ${folderPath}`);
            }

            const contents = files
                .filter((file) => !file.isDirectory())
                .map((file) => {
                    try {
                        const { title, year } = extractDetails(file.name);
                        return { name: file.name, title, year };
                    } catch (err) {
                        return {
                            name: file.name,
                            error: "Invalid format",
                            details: err.message,
                        };
                    }
                });

            resolve(contents);
        });
    });
};

// API endpoint to fetch folder contents separately for anime, movies, audiobook, and music
router.get("/folder-contents", async (req, res) => {
    try {
        const animePath = path.join(rootFolder, "anime");
        const moviesPath = path.join(rootFolder, "movies");
        const audiobookPath = path.join(rootFolder, "audiobook");
        const musicPath = path.join(rootFolder, "music");

        const [animeContents, movieContents, audiobookContents, musicContents] =
            await Promise.all([
                readFolderContents(animePath),
                readFolderContents(moviesPath),
                readFolderContents(audiobookPath),
                readFolderContents(musicPath),
            ]);

        res.json({
            anime: animeContents,
            movies: movieContents,
            audiobook: audiobookContents,
            music: musicContents,
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch folder contents",
            details: error,
        });
    }
});

module.exports = router;
