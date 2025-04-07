const fs = require("fs");
const extractDetails = require("./extractDetails");

const readFolderContents = (folderPath) => {
    return new Promise((resolve, reject) => {
        fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
            if (err) {
                return reject(`Failed to read contents of ${folderPath}`);
            }

            const contents = files
                .filter((file) => !file.isDirectory())
                .map((file) => {
                    try {
                        const { title, year } = extractDetails(file.name);
                        return { name: file.name, title, year };
                    } catch (err) {
                        return {
                            name: file.name,
                            error: "Invalid format",
                            details: err.message,
                        };
                    }
                });

            resolve(contents);
        });
    });
};

module.exports = readFolderContents;
