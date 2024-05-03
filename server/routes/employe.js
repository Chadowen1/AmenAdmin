import express from 'express';
import db from '../config/db.js';
import dw from '../config/dw.js';

const router = express.Router();

router.get('/objectif', async (req, res) => {
    try {
        const { codeEmploye, year, month, quarter } = req.query;
        // Check if codeEmploye or year parameters are missing
        if (!codeEmploye || !year) {
            return res.status(400).json({ message: 'codeEmploye and year parameters are required' });
        }
        // Build the WHERE clause dynamically based on the parameters
        let whereClause = `CodeEmploye = '${codeEmploye}' AND Annee = ${parseInt(year, 10)}`;
        if (month) {
            whereClause += ` AND Mois = ${parseInt(month, 10)}`;
        }
        if (quarter) {
            const quarterMonths = {
                Q1: [1, 2, 3],
                Q2: [4, 5, 6],
                Q3: [7, 8, 9],
                Q4: [10, 11, 12]
            };
            const quarterMonthsList = quarterMonths[quarter.toUpperCase()];
            if (quarterMonthsList) {
                whereClause += ` AND Mois IN (${quarterMonthsList.join(',')})`;
            }
        }
        // Execute the SQL query with the dynamically generated WHERE clause
        const [objectif] = await db.query(`
            SELECT  
                SUM(OuvCpt) AS SumOuvCpt,
                SUM(ObjectifBNQDigi) AS SumObjectifBNQDigi,
                SUM(ObjectifPack) AS SumObjectifPack,
                SUM(ObjectifBancassurance) AS SumObjectifBancassurance,
                SUM(ObjectifRessource) AS SumObjectifRessource,
                SUM(ObjectifEngagement) AS SumObjectifEngagement,
                SUM(ObjectifCartes) AS SumObjectifCartes
            FROM Objectif
            WHERE ${whereClause};
        `);
        res.json(objectif);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/data', async (req, res) => {
    try {
        const { codeEmploye } = req.query;
        if (!codeEmploye) {
            return res.status(400).json({ message: 'codeEmploye parameter is missing' });
        }
        const [data] = await db.query(`
            SELECT 
                Nom, Prenom, Affectation
            FROM 
                Employes
            WHERE 
                CodeEmploye = '${codeEmploye}'
        `);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/stats', async (req, res) => {
    try {
        const { codeEmploye, year, month, quarter } = req.query;
        // Check if codeEmploye or year parameters are missing
        if (!codeEmploye || !year) {
            return res.status(400).json({ message: 'codeEmploye and year parameters are required' });
        }
        const client = await dw.connect();
        // Define your SQL query with named parameters
        let query = `
            SELECT
                CASE
                    WHEN LEFT(dp.codeproduit, 2) = 'BN' THEN 'BNQDigiVendus'
                    WHEN LEFT(dp.codeproduit, 2) = 'BA' THEN 'BancassuranceVendu'
                    WHEN LEFT(dp.codeproduit, 2) = 'PA' THEN 'PacksVendu'
                    WHEN LEFT(dp.codeproduit, 2) = 'CR' THEN 'CartesVendus'
                    ELSE 'Other'
                END AS produit_category,
                COUNT(DISTINCT fp.comptesk) AS accounts_opened,
                COUNT(DISTINCT fp.produitsk) AS products_sold
            FROM
                fait_performance_employe fp
            JOIN
                dimemployes de ON fp.employesk = de.employesk
            JOIN
                dimdate dd ON fp.date_creation_sk = dd.datesk
            JOIN
                dimcomptes dc ON fp.comptesk = dc.comptesk
            JOIN
                dimproduit dp ON fp.produitsk = dp.produitsk
            WHERE
                de.codeemploye = $1
                AND EXTRACT(YEAR FROM dd."date") = $2
        `;
        const queryParams = [codeEmploye, year];
        if (month) {
            query += ` AND EXTRACT(MONTH FROM dd."date") = $3`;
            queryParams.push(month);
        }
        if (quarter) {
            // Assuming quarter is in the format 'Q1', 'Q2', 'Q3', 'Q4'
            const quarterMonths = {
                Q1: [1, 2, 3],
                Q2: [4, 5, 6],
                Q3: [7, 8, 9],
                Q4: [10, 11, 12]
            };
            const quarterMonthsList = quarterMonths[quarter.toUpperCase()];
            if (quarterMonthsList) {
                query += ` AND EXTRACT(MONTH FROM dd."date") IN (${quarterMonthsList.join(',')})`;
            }
        }
        query += `
            AND LEFT(dp.codeproduit, 2) IN ('BN', 'BA', 'PA', 'CR')
            GROUP BY produit_category;
        `;
        // Execute the query with named parameters
        const { rows: data } = await client.query(query, queryParams);
        client.release();
        // Initialize an object to store the response
        const response = {
            BancassuranceVendu: 0,
            BNQDigiVendus: 0,
            CartesVendus: 0,
            PacksVendu: 0,
            ComptesOuverts: 0 // Initialize to 0 initially
        };
        // Iterate over the fetched data to update the response object
        data.forEach(row => {
            if (row.produit_category === 'BancassuranceVendu') {
                response.BancassuranceVendu = row.products_sold;
            } else if (row.produit_category === 'BNQDigiVendus') {
                response.BNQDigiVendus = row.products_sold;
            } else if (row.produit_category === 'CartesVendus') {
                response.CartesVendus = row.products_sold;
            } else if (row.produit_category === 'PacksVendu') {
                response.PacksVendu = row.products_sold;
            }
        });
        // Extract accounts_opened from the first row if data is available
        if (data.length > 0) {
            response.ComptesOuverts = data[0].accounts_opened;
        }
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
