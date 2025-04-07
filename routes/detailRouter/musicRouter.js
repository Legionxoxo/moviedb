const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();
const storeMusicData = require("../../functions/database/storeMusicData");

router.get("/music-details", async (req, res) => {
    let responsePayload = {
        success: false,
        msg: "Something went wrong",
        data: null,
    };

    try {
        // Step 1: Fetch folder contents
        const response = await axios.get(
            `${req.protocol}://${req.get("host")}/file/folder-contents`
        );
        const files = response.data.music;
        console.log("🎵 Music files found:", files);

        if (!files || files.length === 0) {
            responsePayload = {
                success: false,
                msg: "No music found",
                data: null,
            };
            return res.json(responsePayload);
        }

        // Step 2: Send files to processing server
        const processingApiUrl =
            process.env.PROCESSING_API_URL ||
            "http://localhost:4000/details/music-details";

        console.log(`🚀 Sending music details to ${processingApiUrl}...`);
        const processingResponse = await axios.post(processingApiUrl, {
            music: files,
        });

        const processedMusic = processingResponse.data?.data || [];
        console.log("✅ Processed music received:", processedMusic.length);

        // Step 3: Store processed music data in DB
        for (const music of processedMusic) {
            const result = await storeMusicData(music);
            if (!result.success) {
                console.warn(`⚠️ Failed to store music: ${music.album_title}`);
            }
        }

        responsePayload = {
            success: true,
            msg: "Music processed and stored successfully",
            data: processedMusic,
        };
    } catch (error) {
        console.error("❌ Error processing music details:", error.message);
        responsePayload = {
            success: false,
            msg: `Failed to process music: ${error.message}`,
            data: null,
        };
    } finally {
        console.log("✅ Request completed for /music-details");
        res.json(responsePayload);
    }
});

module.exports = router;
