const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

router.get("/music-details", async (req, res) => {
    try {
        // Call your existing folder-contents endpoint
        const response = await axios.get(
            `${req.protocol}://${req.get("host")}/file/folder-contents`
        );
        const files = response.data.music; // Assuming 'music' is an array of music files
        console.log(files);

        // Validate the response
        if (!Array.isArray(files) || files.length === 0) {
            return res.status(400).json({
                error: "No music files found",
            });
        }

        // Process each file
        const musicDetails = await Promise.all(
            files.map(async (file) => {
                const title = file.title || ""; // Get title from file
                const year = file.year; // Get year from file
                const artist = file.artist || ""; // Get artist from file (optional)

                // Enhanced input validation for title
                if (
                    !title ||
                    typeof title !== "string" ||
                    title.trim().length === 0
                ) {
                    return {
                        error: "Invalid title parameter",
                        message: "Title must be a non-empty string",
                    };
                }

                // Validate year if provided
                if (year !== undefined) {
                    const yearNum = parseInt(year);
                    if (
                        isNaN(yearNum) ||
                        yearNum < 1900 ||
                        yearNum > new Date().getFullYear()
                    ) {
                        return {
                            error: "Invalid year parameter",
                            message:
                                "Year must be a valid number between 1900 and current year",
                        };
                    }
                }

                console.log(
                    `Fetching music details for: ${title.trim()} (${
                        year || "Unknown Year"
                    }, ${artist || "Unknown Artist"})`
                );

                // Function to search for music using Genius API
                const searchGeniusMusic = async (title) => {
                    const config = {
                        method: "get",
                        url: `https://api.genius.com/search?q=${encodeURIComponent(
                            title
                        )}`,
                        headers: {
                            Authorization: `Bearer ${process.env.GENIUS_API_KEY}`,
                        },
                    };

                    try {
                        const geniusResponse = await axios(config);
                        const hits = geniusResponse.data.response.hits;

                        if (hits.length > 0) {
                            return hits.map((hit) => hit.result);
                        } else {
                            return [];
                        }
                    } catch (error) {
                        console.error(
                            `Error fetching details from Genius for ${title}:`,
                            error.message
                        );
                        return [];
                    }
                };

                // Search for music and lyrics using Genius API
                const results = await searchGeniusMusic(title.trim());

                if (results.length === 0) {
                    return { error: `No matches found in Genius for ${title}` };
                }

                // Filter by year if year is provided
                let filteredResults = results;
                if (year) {
                    filteredResults = filteredResults.filter((song) => {
                        const songYear = song.release_date
                            ? new Date(song.release_date).getFullYear()
                            : null;
                        return songYear === parseInt(year);
                    });
                }

                // Filter by artist if artist is provided
                if (artist) {
                    filteredResults = filteredResults.filter((song) =>
                        song.primary_artist.name
                            .toLowerCase()
                            .includes(artist.toLowerCase())
                    );
                }

                // If filtered results are still available, pick the best match, else return the first original result
                const musicData =
                    filteredResults.length > 0
                        ? filteredResults[0]
                        : results[0];

                // Format the response to match the frontend expectations
                return {
                    albumTitle: musicData.title,
                    artist: musicData.primary_artist.name,
                    releaseYear: year || "Unknown",
                    coverImage: musicData.song_art_image_url,
                    description: "View lyrics at: " + musicData.url,
                    featuredArtists: musicData.primary_artists.map(
                        (artist) => ({
                            name: artist.name,
                            image: artist.image_url,
                        })
                    ),
                };
            })
        );

        res.json(musicDetails);
    } catch (error) {
        console.error("Error fetching music details:", error.message);
        res.status(500).json({
            error: "Failed to fetch music details",
            details: error.message,
        });
    }
});

module.exports = router;
