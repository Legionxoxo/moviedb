const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

// Function to fetch subtitles using OpenSubtitles API
const fetchSubtitles = async (title, language) => {
    try {
        const response = await axios({
            method: "get",
            url: `https://api.opensubtitles.com/api/v1/subtitles`,
            headers: {
                "Api-Key": process.env.OPENSUBTITLES_API_KEY,
            },
            params: {
                query: title,
                languages: language,
            },
        });

        return response.data.data || [];
    } catch (error) {
        console.error(`Error fetching subtitles for ${title}:`, error.message);
        return null;
    }
};

// Route to fetch subtitles
router.get("/fetch-subtitles", async (req, res) => {
    const { title, language } = req.query;

    if (!title || !language) {
        return res.status(400).json({
            message: "Title and language are required to fetch subtitles.",
        });
    }

    try {
        console.log(`Fetching subtitles for: ${title} in ${language} language`);

        // Fetch subtitles using OpenSubtitles API
        const subtitles = await fetchSubtitles(title, language);

        if (subtitles && subtitles.length > 0) {
            res.json(subtitles);
        } else {
            res.status(404).json({
                message: `No subtitles found for ${title} in ${language}`,
            });
        }
    } catch (error) {
        console.error(`Error fetching subtitles for ${title}:`, error.message);
        res.status(500).json({
            message: "Failed to fetch subtitles",
            error: error.message,
        });
    }
});

module.exports = router;
