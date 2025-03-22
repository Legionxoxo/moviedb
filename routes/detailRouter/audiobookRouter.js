const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

// Define the Open Library route for audiobook details
router.get("/book-details", async (req, res) => {
    try {
        console.log("Fetching folder contents...");

        const response = await axios.get(
            `${req.protocol}://${req.get("host")}/file/folder-contents`
        );
        const files = response.data.audiobook;

        console.log("Folder contents fetched:", files);

        // Function to search for books using Open Library API
        const searchOpenLibrary = async (title) => {
            const openLibraryURL = `https://openlibrary.org/search.json?title=${encodeURIComponent(
                title
            )}`;

            try {
                const libraryResponse = await axios.get(openLibraryURL);
                return libraryResponse.data;
            } catch (error) {
                console.error(
                    `Error fetching details from Open Library for ${title}:`,
                    error.message
                );
                return null;
            }
        };

        // Process each file to get details from Open Library
        const bookDetailsPromises = files.map(async (file) => {
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

            const openLibraryData = await searchOpenLibrary(file.title);

            let bookDetails = {};

            // If data is found from Open Library
            if (openLibraryData && openLibraryData.numFound > 0) {
                const book = openLibraryData.docs[0]; // Get the first match

                bookDetails = {
                    title: book.title,
                    author: book.author_name
                        ? book.author_name.join(", ")
                        : "Unknown",
                    first_publish_year: book.first_publish_year,
                    cover_image: book.cover_i
                        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
                        : null,
                    ebook_available: book.ebook_count_i > 0,
                    audiobook_available: book.has_fulltext, // Fulltext available indicates audio/ebook
                };
            }

            // If no data is found in Open Library, return an error
            if (!openLibraryData) {
                console.log(`No matches found for ${file.title}`);
                return {
                    name: file.name,
                    title: file.title,
                    parsed: true,
                    error: "No matches found in Open Library",
                };
            }

            return bookDetails;
        });

        // Wait for all promises to resolve
        const bookDetails = await Promise.all(bookDetailsPromises);
        console.log(bookDetails);
        res.json(bookDetails);
    } catch (error) {
        console.error("Error fetching book details:", error.message);
        res.status(500).json({
            error: "Failed to fetch book details",
            details: error.message,
        });
    }
});

module.exports = router;
