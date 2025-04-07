const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();
const storeAudiobookData = require("../../functions/database/storeAudiobookData");

// Define the Open Library route for audiobook details
router.get("/book-details", async (req, res) => {
    let responsePayload = {
        success: false,
        msg: "Something went wrong",
        data: null,
    };

    try {
        console.log("📁 Fetching folder contents...");

        const response = await axios.get(
            `${req.protocol}://${req.get("host")}/file/folder-contents`
        );
        const files = response.data.audiobook;
        console.log("✅ Folder contents fetched:", files);

        if (!files || files.length === 0) {
            responsePayload = {
                success: false,
                msg: "No audiobooks found",
                data: null,
            };
            return res.json(responsePayload);
        }

        const processingApiUrl =
            process.env.PROCESSING_API_URL ||
            "http://localhost:4000/details/book-details";

        console.log(`📦 Sending audiobook details to ${processingApiUrl}...`);
        const processingResponse = await axios.post(processingApiUrl, {
            books: files,
        });

        const processedBooks = processingResponse.data?.data || [];

        console.log("📚 Processed data received:", processedBooks.length);

        for (const book of processedBooks) {
            const result = await storeAudiobookData(book);
            if (!result.success) {
                console.warn("⚠️ Failed to store audiobook:", book.title);
            }
        }

        responsePayload = {
            success: true,
            msg: "Audiobooks processed and stored successfully",
            data: processedBooks,
        };
    } catch (error) {
        console.error("❌ Error processing audiobook details:", error.message);
        responsePayload = {
            success: false,
            msg: `Failed to process audiobooks: ${error.message}`,
            data: null,
        };
    } finally {
        console.log("✅ Request processing completed for /book-details");
        res.json(responsePayload);
    }
});

module.exports = router;
