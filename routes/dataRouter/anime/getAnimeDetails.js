const express = require("express");
const router = express.Router();
const pool = require("../../database/pg");
const tableNames = require("../../../data/tableNames");

router.get("/anime", async (req, res) => {
    let responsePayload = {
        success: false,
        msg: "Something went wrong while fetching anime",
        data: null,
    };

    try {
        const result = await pool.query(
            `SELECT id, title, cover_image, anilist_id FROM ${tableNames.anime_db} ORDER BY created_at DESC`
        );
        responsePayload = {
            success: true,
            msg: "Anime summary fetched successfully",
            data: result.rows,
        };
    } catch (error) {
        responsePayload.msg = `Error: ${error.message}`;
    } finally {
        res.json(responsePayload);
    }
});

router.get("/anime/:id", async (req, res) => {
    let responsePayload = {
        success: false,
        msg: "Something went wrong while fetching anime details",
        data: null,
    };

    try {
        const result = await pool.query(
            `SELECT * FROM ${tableNames.anime_db} WHERE id = $1`,
            [req.params.id]
        );

        if (result.rowCount === 0) {
            responsePayload.msg = "Anime not found";
        } else {
            responsePayload = {
                success: true,
                msg: "Anime details fetched successfully",
                data: result.rows[0],
            };
        }
    } catch (error) {
        responsePayload.msg = `Error: ${error.message}`;
    } finally {
        res.json(responsePayload);
    }
});

router.delete("/anime/:id", async (req, res) => {
    let responsePayload = {
        success: false,
        msg: "Something went wrong while deleting anime",
        data: null,
    };

    try {
        const result = await pool.query(
            `DELETE FROM ${tableNames.anime_db} WHERE id = $1 RETURNING *`,
            [req.params.id]
        );

        if (result.rowCount === 0) {
            responsePayload.msg = "Anime not found or already deleted";
        } else {
            responsePayload = {
                success: true,
                msg: "Anime deleted successfully",
                data: result.rows[0],
            };
        }
    } catch (error) {
        responsePayload.msg = `Error: ${error.message}`;
    } finally {
        res.json(responsePayload);
    }
});

router.delete("/anime", async (req, res) => {
    let responsePayload = {
        success: false,
        msg: "Something went wrong while deleting all anime",
        data: null,
    };

    try {
        await pool.query(`DELETE FROM ${tableNames.anime_db}`);
        responsePayload = {
            success: true,
            msg: "All anime deleted successfully",
            data: null,
        };
    } catch (error) {
        responsePayload.msg = `Error: ${error.message}`;
    } finally {
        res.json(responsePayload);
    }
});

module.exports = router;
