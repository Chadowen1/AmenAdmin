import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.get('/data', async (req, res) => {
    try {
        const { codeGouvernerat } = req.query;
        if (!codeGouvernerat) {
            return res.status(400).json({ message: 'CodeGouvernerat parameter is missing' });
        }

        const [agences] = await db.query('SELECT CodeAgence, Agence, CodeGouvernerat FROM Agences WHERE CodeGouvernerat = ?', [codeGouvernerat]);
        res.json(agences);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/zones', async (req, res) => {
    try {
        // Use the query function to execute MySQL query
        const [zones] = await db.query('SELECT CodeZone, Zone FROM Zones');
        res.json(zones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/gouvernerats', async (req, res) => {
    try {
        const codeZone = req.query.codeZone;
        if (!codeZone) {
            return res.status(400).json({ message: 'Missing codeZone parameter' });
        }

        // Use the query function to execute MySQL query
        const [gouvernerats] = await db.query('SELECT CodeGouvernerat, Gouvernerat, CodeZone FROM Gouvernerat WHERE CodeZone = ?', [codeZone]);
        res.json(gouvernerats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;