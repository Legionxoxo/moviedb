require("dotenv").config();

/** function to check if a variable is set in the environment
 * @param {{[key: string]: any}} obj - The environment variables to check
 */
function check(obj) {
    for (const key in obj) {
        if (!process.env[key]) {
            throw new Error(`${key} is not set in the environment variables!`);
        }
    }
}

const ROOT_FOLDER = process.env.ROOT_FOLDER || "";

check({
    ROOT_FOLDER,
});

module.exports = {
    ROOT_FOLDER,
};
