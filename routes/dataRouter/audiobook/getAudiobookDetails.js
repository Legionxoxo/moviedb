const express = require("express");
const router = express.Router();
const pool = require("../../database/pg");
const tableNames = require("../../../data/tableNames");

router.get("/audiobooks", async (req, res) => {
    let responsePayload = {
        success: false,
        msg: "Something went wrong while fetching audiobooks",
        data: null,
    };

    try {
        const result = await pool.query(
            `SELECT id, title, cover_image, openlibrary_id FROM ${tableNames.audiobook_db} ORDER BY created_at DESC`
        );
        responsePayload = {
            success: true,
            msg: "Audiobook summary fetched successfully",
            data: result.rows,
        };
    } catch (error) {
        responsePayload.msg = `Error: ${error.message}`;
    } finally {
        res.json(responsePayload);
    }
});

router.get("/audiobooks/:id", async (req, res) => {
    let responsePayload = {
        success: false,
        msg: "Something went wrong while fetching audiobook details",
        data: null,
    };

    try {
        const result = await pool.query(
            `SELECT * FROM ${tableNames.audiobook_db} WHERE id = $1`,
            [req.params.id]
        );

        if (result.rowCount === 0) {
            responsePayload.msg = "Audiobook not found";
        } else {
            responsePayload = {
                success: true,
                msg: "Audiobook details fetched successfully",
                data: result.rows[0],
            };
        }
    } catch (error) {
        responsePayload.msg = `Error: ${error.message}`;
    } finally {
        res.json(responsePayload);
    }
});

router.delete("/audiobooks/:id", async (req, res) => {
    let responsePayload = {
        success: false,
        msg: "Something went wrong while deleting audiobook",
        data: null,
    };

    try {
        const result = await pool.query(
            `DELETE FROM ${tableNames.audiobook_db} WHERE id = $1 RETURNING *`,
            [req.params.id]
        );

        if (result.rowCount === 0) {
            responsePayload.msg = "Audiobook not found or already deleted";
        } else {
            responsePayload = {
                success: true,
                msg: "Audiobook deleted successfully",
                data: result.rows[0],
            };
        }
    } catch (error) {
        responsePayload.msg = `Error: ${error.message}`;
    } finally {
        res.json(responsePayload);
    }
});

router.delete("/audiobooks", async (req, res) => {
    let responsePayload = {
        success: false,
        msg: "Something went wrong while deleting all audiobooks",
        data: null,
    };

    try {
        await pool.query(`DELETE FROM ${tableNames.audiobook_db}`);
        responsePayload = {
            success: true,
            msg: "All audiobooks deleted successfully",
            data: null,
        };
    } catch (error) {
        responsePayload.msg = `Error: ${error.message}`;
    } finally {
        res.json(responsePayload);
    }
});

module.exports = router;
