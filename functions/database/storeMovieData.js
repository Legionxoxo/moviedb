const tableNames = require("../../data/tableNames");
const pool = require("../../database/pg");

/**
 * store the movie data in the db
 */
async function storeMovieData() {
    let msg = "Status fetched successfully!";
    let success = false;
    try {
        await pool.query(
            `UPDATE ${tableNames.movie_db} 
			SET end_time = $1, max_files = $2, processed_files = $3, error = $4, error_msg = $5, status = $6
				WHERE acc_id = $7 AND sync_id = $8`,
            [
                endTime,
                maxFiles,
                processed_files,
                error,
                error_msg,
                status,
                acc_id,
                syncId,
            ]
        );
        console.log(`Sync request for syncId: ${syncId} updated successfully!`);

        success = true;
        msg = "movie data stored successfully!";
    } catch (error) {
        console.error(
            `An error occurred while updating the movie data in the database! Error ->`,
            error
        );
        msg =
            "An error occurred while updating the movie data in the database!";
    }
    return { success, msg };
}

module.exports = storeMovieData;
