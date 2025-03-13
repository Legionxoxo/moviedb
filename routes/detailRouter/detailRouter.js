const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

// Define the movie details route
router.get("/movie-details", async (req, res) => {
    try {
        console.log("Fetching folder contents...");

        // Call your existing folder-contents endpoint
        const response = await axios.get(
            `${req.protocol}://${req.get("host")}/file/folder-contents`
        );
        const files = response.data;

        console.log("Folder contents fetched:", files);

        // OMDb API Key from environment variables
        const omdbApiKey = process.env.OMDB_API_KEY;

        // Process each file to get details from OMDb
        const movieDetailsPromises = files.map(async (file) => {
            // If the file had an error during extraction, return basic info
            if (file.error) {
                console.log(
                    `Error in file: ${file.name}, error: ${file.error}`
                );
                return {
                    name: file.name,
                    error: file.error,
                    parsed: false,
                };
            }

            try {
                console.log(
                    `Fetching details from OMDb for: ${file.title}, ${file.year}`
                );

                // Search for the movie in OMDb
                const searchResponse = await axios.get(
                    `http://www.omdbapi.com/`,
                    {
                        params: {
                            apikey: omdbApiKey,
                            t: file.title, // Search by title
                            y: file.year, // Search by year
                            type: "movie", // Specify that it's a movie
                        },
                    }
                );

                const movieData = searchResponse.data;

                console.log(`OMDb response for ${file.title}:`, movieData);

                // Check if a movie was found
                if (movieData.Response === "True") {
                    // Return the entire OMDb response
                    return movieData;
                } else {
                    console.log(`No matches found for ${file.title} in OMDb`);
                    return {
                        name: file.name,
                        title: file.title,
                        year: file.year,
                        parsed: true,
                        error: "No matches found in OMDb",
                    };
                }
            } catch (error) {
                console.error(
                    `Error fetching OMDb details for ${file.name}:`,
                    error.message
                );
                return {
                    name: file.name,
                    title: file.title,
                    year: file.year,
                    parsed: true,
                    error: "Failed to fetch OMDb details",
                };
            }
        });

        // Wait for all promises to resolve
        const movieDetails = await Promise.all(movieDetailsPromises);

        console.log("Final movie details:", movieDetails);

        res.json(movieDetails);
    } catch (error) {
        console.error("Error fetching movie details:", error.message);
        res.status(500).json({
            error: "Failed to fetch movie details",
            details: error.message,
        });
    }
});

module.exports = router;
