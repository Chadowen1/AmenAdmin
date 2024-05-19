import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.get('/data', async (req, res) => {
    try {
        const { codeCompte } = req.query;
        if (!codeCompte) {
            return res.status(400).json({ error: 'codeCompte must be provided' });
        }
        const [data] = await db.query(`
            SELECT 
                c.CodeCompte, 
                tc.Libelle, 
                c.DateCreation,
                c.DateValidation,
                a.Agence,
                c.CodeEmploye,
                c.EtatCompte
            FROM Comptes c
            LEFT JOIN TypeCompte tc ON tc.CodeTypeCompte = c.CodeTypeCompte
            LEFT JOIN Agences a ON a.CodeAgence = c.CodeAgence
            WHERE c.CodeCompte = ?;
            `, [codeCompte]);
        res.json(data);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;