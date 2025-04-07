const express = require("express");
const path = require("path");
const router = express.Router();
const rootFolder = require("../../data/env");
const readFolderContents = require("../../functions/files/readFolderContents");

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
        console.log(
            animeContents,
            movieContents,
            audiobookContents,
            musicContents
        );
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch folder contents",
            details: error,
        });
    }
});

module.exports = router;
