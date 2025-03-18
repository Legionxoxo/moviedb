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

// API endpoint to fetch folder contents separately for anime, movies, and audiobook
router.get("/folder-contents", async (req, res) => {
    try {
        const animePath = path.join(rootFolder, "anime");
        const moviesPath = path.join(rootFolder, "movies");
        const audiobookPath = path.join(rootFolder, "audiobook");

        const [animeContents, movieContents, audiobookContents] =
            await Promise.all([
                readFolderContents(animePath),
                readFolderContents(moviesPath),
                readFolderContents(audiobookPath),
            ]);

        res.json({
            anime: animeContents,
            movies: movieContents,
            audiobook: audiobookContents,
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch folder contents",
            details: error,
        });
    }
});

module.exports = router;
