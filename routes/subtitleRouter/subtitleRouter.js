const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

// Use environment variable for API URL, default to localhost if not set
const BASE_URL = process.env.SUBTITLES_API_URL || "http://localhost:4000";

/**
 * Proxy route to fetch subtitles from another server
 */
router.get("/fetch-subtitles", async (req, res) => {
    const { title, language } = req.query;

    if (!title || !language) {
        return res
            .status(400)
            .json({ success: false, msg: "Title and language are required." });
    }

    try {
        console.log(
            `Proxy: Fetching subtitles for ${title} in ${language} language`
        );

        // Call the original subtitles API internally
        const response = await axios.post(`${BASE_URL}/fetch-subtitles`, {
            title,
            language,
        });

        res.json(response.data);
    } catch (error) {
        console.error(
            `Error fetching subtitles via proxy for ${title}:`,
            error.message
        );
        res.status(500).json({
            success: false,
            msg: "Failed to fetch subtitles",
            error: error.message,
        });
    }
});

module.exports = router;
