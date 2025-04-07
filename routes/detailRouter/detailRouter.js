const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();
const storeMovieData = require("../../functions/database/storeMovieData");

router.get("/movie-details", async (req, res) => {
    let responsePayload = {
        success: false,
        msg: "Something went wrong",
        data: null,
    };

    try {
        console.log("🎬 Fetching folder contents...");

        // Step 1: Get files from folder-contents route
        const response = await axios.get(
            `${req.protocol}://${req.get("host")}/file/folder-contents`
        );
        const files = response.data.movies;
        console.log("✅ Folder contents fetched:", files);

        if (!files || files.length === 0) {
            responsePayload = {
                success: false,
                msg: "No movies found",
                data: null,
            };
            return res.json(responsePayload);
        }

        // Step 2: Send to processing API
        const processingApiUrl =
            process.env.PROCESSING_API_URL ||
            "http://localhost:4000/details/movie-details";

        console.log(`📡 Sending movie details to ${processingApiUrl}...`);
        const processingResponse = await axios.post(processingApiUrl, {
            movies: files,
        });

        const processedMovies = processingResponse.data?.data || [];
        console.log("🎞️ Processed movies received:", processedMovies.length);

        // Step 3: Store each movie in DB
        for (const movie of processedMovies) {
            const result = await storeMovieData(movie);
            if (!result.success) {
                console.warn(`⚠️ Failed to store movie: ${movie.title}`);
            }
        }

        responsePayload = {
            success: true,
            msg: "Movies processed and stored successfully",
            data: processedMovies,
        };
    } catch (error) {
        console.error("❌ Error processing movie details:", error.message);
        responsePayload = {
            success: false,
            msg: `Failed to process movies: ${error.message}`,
            data: null,
        };
    } finally {
        console.log("✅ Request completed for /movie-details");
        res.json(responsePayload);
    }
});

module.exports = router;
