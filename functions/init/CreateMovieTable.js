const pool = require("../../database/pg");
const tableNames = require("../../data/tableNames");

/**
 * Store the movie data in the 'movies' table
 * @param {Object} movie - movie data
 */
async function storeMovieData(movie) {
    let msg = "Movie data stored successfully!";
    let success = false;

    const {
        tvdb_id,
        title,
        year,
        tvdb_title,
        overview,
        runtime,
        genres,
        directors,
        rating,
        poster,
        release_date,
        cast,
    } = movie;

    try {
        await pool.query(
            `
            INSERT INTO ${tableNames.movie_db} (
                tvdb_id, title, year, tvdb_title, overview, runtime,
                genres, directors, rating, poster, release_date, cast
            ) VALUES (
                $1, $2, $3, $4, $5, $6,
                $7, $8, $9, $10, $11, $12
            )
            ON CONFLICT (tvdb_id)
            DO UPDATE SET
                title = EXCLUDED.title,
                year = EXCLUDED.year,
                tvdb_title = EXCLUDED.tvdb_title,
                overview = EXCLUDED.overview,
                runtime = EXCLUDED.runtime,
                genres = EXCLUDED.genres,
                directors = EXCLUDED.directors,
                rating = EXCLUDED.rating,
                poster = EXCLUDED.poster,
                release_date = EXCLUDED.release_date,
                cast = EXCLUDED.cast,
                updated_at = CURRENT_TIMESTAMP;
        `,
            [
                tvdb_id,
                title,
                year,
                tvdb_title,
                overview,
                runtime,
                genres,
                directors,
                rating,
                poster,
                release_date,
                cast,
            ]
        );

        console.log(
            `🎬 Movie with TVDB ID ${tvdb_id} stored/updated successfully!`
        );
        success = true;
    } catch (error) {
        console.error("❌ Error storing movie data:", error);
        msg = "An error occurred while storing the movie data.";
    }

    return { success, msg };
}

module.exports = storeMovieData;
