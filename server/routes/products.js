import express from 'express';
import dw from '../config/dw.js';
import db from '../config/db.js';
import clickhouse from '../config/click.js';

const router = express.Router();

router.get('/stats', async (req, res) => {
    try {
        const { codeEmploye, relation, year, quarter, month, codeProduit } = req.query;
        // Check if codeEmploye or year parameters are missing
        if (!codeEmploye || !year || !relation) {
            return res.status(400).json({ message: 'codeEmploye, year and relation parameters are required' });
        }
        // Define your SQL query with named parameters
        let query = `
            SELECT
                ds.libelle as segment,
                SUM(fp.nb_produits_vendus) AS total_products_sold
            FROM
                default.fait_performance_employe_produits_vendus fp
            JOIN
                default.dimemployes dpe ON fp.employesk = dpe.employesk
            JOIN
                default.dimproduit dp ON fp.produitsk = dp.produitsk
            JOIN
                default.dimdate dd ON fp.datesk = dd.datesk
            JOIN
                default.dimsegment ds ON fp.segmentsk = ds.segmentsk
            WHERE
                dpe.codeemploye = {codeEmploye:String}
                AND ds.typerelation = {relation:String}
                AND dd.annee = {year:UInt32}
        `;
        const queryParams ={codeEmploye, relation, year};
        if (month) {
            query += ` AND dd.mois = {month:UInt32}`;
            queryParams.month = month;
        }
        if (quarter) {
            query += ` AND dd.trimestre = {quarter:UInt32}`;
            queryParams.quarter = quarter;
        }
        if (codeProduit) {
            query += ` and LEFT(dp.codeproduit, 2) = {codeProduit:String}`;
            queryParams.codeProduit = codeProduit;
        }
        query += `
            GROUP BY
                ds.libelle;
        `;
        console.log(query);
        // Execute the query with named parameters
        clickhouse.query(query, { params: queryParams }).toPromise()
            .then((rows) => {
                console.log(rows);
                const result = rows.map(row => {
                    return {
                        segment: row.segment,
                        [year]: parseInt(row.total_products_sold)
                    };
                });
                res.status(200).json(result);
            })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/bnq', async (req, res) => {
    try {
        const { codeCompte } = req.query;
        if (!codeCompte) {
            return res.status(400).json({ error: 'codeCompte must be provided' });
        }
        const [data] = await db.query(`
            SELECT 
                bp.Libelle AS Nom, b.DateActivation, b.DateExpiration, b.EtatBNQDigital AS Etat
            FROM BNQDigital b 
            LEFT JOIN BNQDigitalProduit bp ON bp.CodeBNQDigitalProduit = b.CodeBNQDigitalProduit 
            WHERE b.CodeCompte = ?;
            `, [codeCompte]);
        res.json(data);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/bnq/stats', async (req, res) => {
    try {
        const { codeEmploye, year, quarter, month } = req.query;
        // Check if codeEmploye or year parameters are missing
        if (!codeEmploye || !year) {
            return res.status(400).json({ message: 'codeEmploye and year parameters are required' });
        }
        let query = `
            SELECT bp.Libelle AS NomProduit, COUNT(b.CodeBNQDigital) AS QuantitySold
            FROM BNQDigital b 
            LEFT JOIN Comptes c ON c.CodeCompte = b.CodeCompte 
            LEFT JOIN BNQDigitalProduit bp ON bp.CodeBNQDigitalProduit = b.CodeBNQDigitalProduit 
            WHERE c.CodeEmploye = ?
            AND YEAR(b.DateActivation) = ?
        `;
        const queryParams = [codeEmploye, year];
        if (month) {
            query += ` AND Month(b.DateActivation) = ?`;
            queryParams.push(month);
        }
        if (quarter) {
            query += ` AND QUARTER(b.DateActivation) = ?`;
            queryParams.push(quarter);
        }
        query += `GROUP BY (bp.Libelle);`;
        const [data] = await db.query(query, queryParams);
        res.json(data);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/bna', async (req, res) => {
    try {
        const { codeCompte } = req.query;
        if (!codeCompte) {
            return res.status(400).json({ error: 'codeCompte must be provided' });
        }
        const [data] = await db.query(`
            SELECT 
                bp.Libelle AS Nom, b.DateExpiration, b.DateExpiration, b.BancassuranceEtat AS Etat
            FROM Bancassurance b 
            LEFT JOIN BancassuranceProduit bp ON bp.CodeBancassuranceProduit = b.CodeBancassuranceProduit 
            WHERE b.CodeCompte = ?;
            `, [codeCompte]);
        res.json(data);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/bnq/stats', async (req, res) => {
    try {
        const { codeEmploye, year, quarter, month } = req.query;
        // Check if codeEmploye or year parameters are missing
        if (!codeEmploye || !year) {
            return res.status(400).json({ message: 'codeEmploye and year parameters are required' });
        }
        let query = `
            SELECT bp.Libelle AS NomProduit, COUNT(b.CodeBNQDigital) AS QuantitySold
            FROM Bancassurance b 
            LEFT JOIN Comptes c ON c.CodeCompte = b.CodeCompte 
            LEFT JOIN BancassuranceProduit bp ON bp.CodeBancassuranceProduit = b.CodeBancassuranceProduit 
            WHERE c.CodeEmploye = ?
            AND YEAR(b.DateActivation) = ?
        `;
        const queryParams = [codeEmploye, year];
        if (month) {
            query += ` AND Month(b.DateActivation) = ?`;
            queryParams.push(month);
        }
        if (quarter) {
            query += ` AND QUARTER(b.DateActivation) = ?`;
            queryParams.push(quarter);
        }
        query += `GROUP BY (bp.Libelle);`;
        const [data] = await db.query(query, queryParams);
        res.json(data);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/crt', async (req, res) => {
    try {
        const { codeCompte } = req.query;
        if (!codeCompte) {
            return res.status(400).json({ error: 'codeCompte must be provided' });
        }
        const [data] = await db.query(`
            SELECT 
                tc.Libelle AS Nom, c.DateActivation, c.DateExpiration, c.EtatCarte AS Etat
            FROM Cartes c 
            LEFT JOIN TypeCarte tc ON tc.CodeTypeCarte = c.CodeTypeCarte 
            WHERE c.CodeCompte = ?;
            `, [codeCompte]);
        res.json(data);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/pac', async (req, res) => {
    try {
        const { codeCompte } = req.query;
        if (!codeCompte) {
            return res.status(400).json({ error: 'codeCompte must be provided' });
        }
        const [data] = await db.query(`
            SELECT 
                tc.Libelle AS Nom, p.DateActivation, p.DateExpiration, p.PackEtat AS Etat
            FROM Packs p 
            LEFT JOIN TypePacks tc ON tc.CodeTypePack = p.CodeTypePack 
            WHERE p.CodeCompte = ?;
            `, [codeCompte]);
        res.json(data);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;