const express = require("express");
const router = express.Router();
const pool = require("../../database/pg");
const tableNames = require("../../../data/tableNames");

// Summary route
router.get("/movies", async (req, res) => {
    let responsePayload = {
        success: false,
        msg: "Something went wrong while fetching movies",
        data: null,
    };

    try {
        const result = await pool.query(
            `SELECT id, tvdb_id, title, poster FROM ${tableNames.movie_db} ORDER BY created_at DESC`
        );
        responsePayload = {
            success: true,
            msg: "Movies fetched successfully",
            data: result.rows,
        };
    } catch (error) {
        console.error("Error fetching movies:", error.message);
        responsePayload = {
            success: false,
            msg: `Error: ${error.message}`,
            data: null,
        };
    } finally {
        res.json(responsePayload);
    }
});

// Detail route
router.get("/movies/:id", async (req, res) => {
    const { id } = req.params;

    let responsePayload = {
        success: false,
        msg: "Something went wrong while fetching movie details",
        data: null,
    };

    try {
        const result = await pool.query(
            `SELECT * FROM ${tableNames.movie_db} WHERE id = $1`,
            [id]
        );

        if (result.rowCount === 0) {
            responsePayload.msg = "Movie not found";
        } else {
            responsePayload = {
                success: true,
                msg: "Movie details fetched successfully",
                data: result.rows[0],
            };
        }
    } catch (error) {
        responsePayload.msg = `Error: ${error.message}`;
    } finally {
        res.json(responsePayload);
    }
});

// Delete by ID
router.delete("/movies/:id", async (req, res) => {
    const { id } = req.params;

    let responsePayload = {
        success: false,
        msg: "Something went wrong while deleting the movie",
        data: null,
    };

    try {
        const result = await pool.query(
            `DELETE FROM ${tableNames.movie_db} WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rowCount === 0) {
            responsePayload.msg = "Movie not found or already deleted";
        } else {
            responsePayload = {
                success: true,
                msg: "Movie deleted successfully",
                data: result.rows[0],
            };
        }
    } catch (error) {
        responsePayload.msg = `Error: ${error.message}`;
    } finally {
        res.json(responsePayload);
    }
});

// Delete all
router.delete("/movies", async (req, res) => {
    let responsePayload = {
        success: false,
        msg: "Something went wrong while deleting all movies",
        data: null,
    };

    try {
        await pool.query(`DELETE FROM ${tableNames.movie_db}`);
        responsePayload = {
            success: true,
            msg: "All movies deleted successfully",
            data: null,
        };
    } catch (error) {
        responsePayload.msg = `Error: ${error.message}`;
    } finally {
        res.json(responsePayload);
    }
});

module.exports = router;
