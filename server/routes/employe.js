import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.get('/objectif', async (req, res) => {
    try {
        const { codeEmploye } = req.query;
        if (!codeEmploye) {
            return res.status(400).json({ message: 'codeEmploye parameter is missing' });
        }

        const [objectif] = await db.query(`
            SELECT OuvCpt, ObjectifBNQDigi, ObjectifPack, ObjectifBancassurance, ObjectifRessource, ObjectifEngagement, ObjectifCartes
            FROM Objectif
            WHERE CodeEmploye = '${codeEmploye}'
            AND Annee = YEAR(CURRENT_DATE)
            AND Mois = MONTH(CURRENT_DATE);
        `);
        res.json(objectif);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
