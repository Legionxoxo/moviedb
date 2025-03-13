const express = require("express");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const extractDetails = require("../../functions/extractDetails");

const router = express.Router();
const rootFolder = process.env.ROOT_FOLDER;

// API endpoint to fetch folder contents and return title and year
router.get("/folder-contents", (req, res) => {
    fs.readdir(rootFolder, { withFileTypes: true }, (err, files) => {
        if (err) {
            return res
                .status(500)
                .json({ error: "Failed to read folder contents" });
        }

        const contents = files
            .filter((file) => !file.isDirectory())
            .map((file) => {
                try {
                    console.log(`Processing file: ${file.name}`);
                    const { title, year } = extractDetails(file.name);
                    return { name: file.name, title, year };
                } catch (err) {
                    // Log the detailed error
                    console.error(
                        `Error processing ${file.name}:`,
                        err.message
                    );

                    return {
                        name: file.name,
                        error: "Invalid format",
                        details: err.message,
                    };
                }
            });
        console.log(contents);
        res.json(contents);
    });
});

module.exports = router;
