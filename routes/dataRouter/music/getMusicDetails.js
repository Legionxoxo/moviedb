const express = require("express");
const router = express.Router();
const pool = require("../../database/pg");
const tableNames = require("../../../data/tableNames");

router.get("/music", async (req, res) => {
    let responsePayload = {
        success: false,
        msg: "Something went wrong while fetching music",
        data: null,
    };

    try {
        const result = await pool.query(
            `SELECT id, album_title, cover_image, genius_id FROM ${tableNames.music_db} ORDER BY created_at DESC`
        );
        responsePayload = {
            success: true,
            msg: "Music summary fetched successfully",
            data: result.rows,
        };
    } catch (error) {
        responsePayload.msg = `Error: ${error.message}`;
    } finally {
        res.json(responsePayload);
    }
});

router.get("/music/:id", async (req, res) => {
    let responsePayload = {
        success: false,
        msg: "Something went wrong while fetching music details",
        data: null,
    };

    try {
        const result = await pool.query(
            `SELECT * FROM ${tableNames.music_db} WHERE id = $1`,
            [req.params.id]
        );

        if (result.rowCount === 0) {
            responsePayload.msg = "Music not found";
        } else {
            responsePayload = {
                success: true,
                msg: "Music details fetched successfully",
                data: result.rows[0],
            };
        }
    } catch (error) {
        responsePayload.msg = `Error: ${error.message}`;
    } finally {
        res.json(responsePayload);
    }
});

router.delete("/music/:id", async (req, res) => {
    let responsePayload = {
        success: false,
        msg: "Something went wrong while deleting music",
        data: null,
    };

    try {
        const result = await pool.query(
            `DELETE FROM ${tableNames.music_db} WHERE id = $1 RETURNING *`,
            [req.params.id]
        );

        if (result.rowCount === 0) {
            responsePayload.msg = "Music not found or already deleted";
        } else {
            responsePayload = {
                success: true,
                msg: "Music deleted successfully",
                data: result.rows[0],
            };
        }
    } catch (error) {
        responsePayload.msg = `Error: ${error.message}`;
    } finally {
        res.json(responsePayload);
    }
});

router.delete("/music", async (req, res) => {
    let responsePayload = {
        success: false,
        msg: "Something went wrong while deleting all music",
        data: null,
    };

    try {
        await pool.query(`DELETE FROM ${tableNames.music_db}`);
        responsePayload = {
            success: true,
            msg: "All music deleted successfully",
            data: null,
        };
    } catch (error) {
        responsePayload.msg = `Error: ${error.message}`;
    } finally {
        res.json(responsePayload);
    }
});
module.exports = router;
