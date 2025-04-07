const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();
const storeAnimeData = require("../../functions/database/storeAnimeData");

// Define the AniList anime details route
router.get("/anilist-movie-details", async (req, res) => {
    let responsePayload = {
        success: false,
        msg: "Something went wrong",
        data: null,
    };

    try {
        console.log("🎞️ Fetching folder contents...");

        // Call local API to get anime folder contents
        const response = await axios.get(
            `${req.protocol}://${req.get("host")}/file/folder-contents`
        );
        const files = response.data.anime;
        console.log("✅ Folder contents fetched:", files);

        if (!files || files.length === 0) {
            responsePayload = {
                success: false,
                msg: "No anime found",
                data: null,
            };
            return res.json(responsePayload);
        }

        // Processing API (external or local)
        const processingApiUrl =
            process.env.PROCESSING_API_URL ||
            "http://localhost:4000/details/anime-details";

        console.log(`🚀 Sending anime details to ${processingApiUrl}...`);
        const processingResponse = await axios.post(processingApiUrl, {
            animes: files,
        });

        const processedAnimes = processingResponse.data?.data || [];

        // Store each anime entry into the DB
        for (const anime of processedAnimes) {
            const result = await storeAnimeData(anime);
            if (!result.success) {
                console.warn(`⚠️ Failed to store anime: ${anime.title}`);
            }
        }

        responsePayload = {
            success: true,
            msg: "Anime processed and stored successfully",
            data: processedAnimes,
        };
    } catch (error) {
        console.error("❌ Error processing anime details:", error.message);
        responsePayload = {
            success: false,
            msg: `Failed to process anime: ${error.message}`,
            data: null,
        };
    } finally {
        console.log(
            "✅ Request processing completed for /anilist-movie-details"
        );
        res.json(responsePayload);
    }
});

module.exports = router;
