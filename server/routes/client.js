import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.get('/data', async (req, res) => {
    const { codeCompte, cin, codeZone, codeGouvernerat, codeAgence } = req.query;

    let query = 'SELECT * FROM Client';

    if (codeCompte) {
        query += ` INNER JOIN Comptes ON Client.CodeClient = Comptes.CodeClient WHERE Comptes.CodeCompte = '${codeCompte}'`;
    } else if (cin) {
        query += ` WHERE Client.Identifiant = '${cin}'`;
    }

    if (codeZone) {
        query += ` AND Client.CodeGouvernerat IN (SELECT CodeGouvernerat FROM Gouvernerat WHERE CodeZone = '${codeZone}')`;
    }
    if (codeGouvernerat) {
        query += ` AND Client.CodeGouvernerat = '${codeGouvernerat}'`;
    }
    if (codeAgence) {
        query += ` AND Client.CodeGouvernerat IN (SELECT CodeGouvernerat FROM Agences WHERE CodeAgence = '${codeAgence}')`;
    }

    try {
        const [clients] = await db.query(query);
        res.json(clients);
        console.log(query)
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;