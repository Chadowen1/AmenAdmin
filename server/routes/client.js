import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.get('/check', async (req, res) => {
    try {
        const { codeCompte, cin, ncrt } = req.query;
        if (!codeCompte && !cin && !ncrt) {
            return res.status(400).json({ error: 'Either codeCompte, cin, or ncrt must be provided' });
        }
        let data;
        if (codeCompte || cin) {
            [data] = await db.query(`
                SELECT c.CodeClient, co.CodeCompte
                FROM Client c
                LEFT JOIN Comptes co ON c.CodeClient = co.CodeClient
                LEFT JOIN Segment s ON s.CodeSegment = c.CodeSegment
                LEFT JOIN Gouvernerat g ON g.CodeGouvernerat = c.CodeGouvernerat
                LEFT JOIN Zones z ON z.CodeZone = g.CodeZone
                WHERE co.CodeCompte = ? OR c.Identifiant = ?;
            `, [codeCompte, cin]);
        } else if (ncrt) {
            [data] = await db.query(`
                SELECT c.CodeClient, cp.CodeCompte
                FROM Cartes ct
                LEFT JOIN Comptes cp ON cp.CodeCompte = ct.CodeCompte 
                LEFT JOIN Client c ON c.CodeClient = cp.CodeClient 
                WHERE ct.IdCarte = ?;
            `, [ncrt]);
        }
        res.json(data);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/data', async (req, res) => {
    try {
        const { codeClient } = req.query;
        if (!codeClient) {
            return res.status(400).json({ error: 'codeClient must be provided' });
        }
        const [data] = await db.query(`
                SELECT 
                    c.Nom, 
                    c.Prenom, 
                    c.Identifiant,
                    c.DateNaissance,
                    c.Sexe,
                    c.EtatCivil,
                    c.Telephone,
                    c.DateRejoindre,
                    s.Libelle,
                    s.TypeRelation,
                    c.Adresse,
                    z.Zone,
                    g.Gouvernerat,
                    c.CodePostal
                FROM Client c
                LEFT JOIN Segment s ON s.CodeSegment = c.CodeSegment
                LEFT JOIN Gouvernerat g ON g.CodeGouvernerat = c.CodeGouvernerat
                LEFT JOIN Zones z ON z.CodeZone = g.CodeZone
                WHERE c.CodeClient = ?;
            `, [codeClient]);
        res.json(data);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;