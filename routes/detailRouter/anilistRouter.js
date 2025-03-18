const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

// Define the AniList movie details route
router.get("/anilist-movie-details", async (req, res) => {
    try {
        console.log("Fetching folder contents...");

        // Call your existing folder-contents endpoint
        const response = await axios.get(
            `${req.protocol}://${req.get("host")}/file/folder-contents`
        );
        const files = response.data.anime;

        console.log("Folder contents fetched:", files);

        // Function to search for movies using AniList API
        const searchAniListMovie = async (title) => {
            const query = `
            query ($search: String) {
                Media(search: $search, type: ANIME) {
                    id
                    title {
                        romaji
                        english
                        native
                    }
                    type
                    format
                    status
                    description
                    startDate {
                        year
                    }
                    genres
                    averageScore
                    coverImage {
                        large
                    }
                }
            }`;

            const variables = {
                search: title,
            };

            const config = {
                method: "post",
                url: "https://graphql.anilist.co",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify({
                    query: query,
                    variables: variables,
                }),
            };

            try {
                const anilistResponse = await axios(config);
                return anilistResponse.data.data.Media;
            } catch (error) {
                console.error(
                    `Error fetching details from AniList for ${title}:`,
                    error.message
                );
                return null;
            }
        };

        // Process each file to get details from AniList
        const movieDetailsPromises = files.map(async (file) => {
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

            const movieData = await searchAniListMovie(file.title);

            if (movieData) {
                return {
                    title: movieData.title.english || movieData.title.romaji,
                    year: movieData.startDate.year,
                    genres: movieData.genres,
                    description: movieData.description,
                    score: movieData.averageScore,
                    coverImage: movieData.coverImage.large,
                };
            } else {
                console.log(`No matches found for ${file.title} in AniList`);
                return {
                    name: file.name,
                    title: file.title,
                    parsed: true,
                    error: "No matches found in AniList",
                };
            }
        });

        // Wait for all promises to resolve
        const movieDetails = await Promise.all(movieDetailsPromises);

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
