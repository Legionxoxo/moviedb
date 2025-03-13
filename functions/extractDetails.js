// functions/extractDetails.js
const path = require("path");

function extractDetails(fileName) {
    // Get the base name without the extension, case-insensitive
    const baseName = path.basename(fileName, path.extname(fileName));

    // Debug the exact string we're working with
    console.log(`Processing: "${baseName}"`);

    // More flexible regex that allows for different title formats
    // This will match titles like:
    // - Title(2001)
    // - Title (2001)
    // - Title the something (2001)
    const match = baseName.match(/^(.+?)[\s]*\((\d{4})\)$/i);

    if (match) {
        const title = match[1].trim(); // Trim any extra spaces from title
        const year = match[2]; // Extract year
        return { title, year };
    }

    // If we get here, the regex didn't match
    console.error(`Failed to parse: "${fileName}"`);

    // Instead of throwing an error, we could return partial information
    return {
        name: fileName,
        title: baseName,
        year: null,
        error: "Could not extract year",
    };
}

module.exports = extractDetails;
