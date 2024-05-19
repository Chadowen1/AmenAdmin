import express from 'express';
import db from '../config/db.js';
import clickhouse from '../config/click.js';

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
                1: [1, 2, 3],
                2: [4, 5, 6],
                3: [7, 8, 9],
                4: [10, 11, 12]
            };
            const quarterMonthsList = quarterMonths[quarter.toUpperCase()];
            if (quarterMonthsList) {
                whereClause += ` AND Mois IN (${quarterMonthsList.join(',')})`;
            }
        }
        // Execute the SQL query with the dynamically generated WHERE   
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
        // Define your ClickHouse SQL query with named parameters
        let query = `
            SELECT
                LEFT(dp.codeproduit, 2) AS Product_Group,
                SUM(fp.nb_produits_vendus) AS product_count
            FROM
                default.fait_performance_employe_produits_vendus fp
            JOIN
                default.dimemployes dpe ON fp.employesk = dpe.employesk
            JOIN
                default.dimproduit dp ON fp.produitsk = dp.produitsk
            JOIN
                default.dimdate dd ON fp.datesk = dd.datesk
            WHERE
                dpe.codeemploye = {codeEmploye:String}
                AND dd.annee = {year:UInt32}
        `;
        const queryParams = { codeEmploye, year };
        if (month) {
            query += ` AND dd.mois = {month:UInt32}`;
            queryParams.month = month;
        }
        if (quarter) {
            query += ` AND dd.trimestre = {quarter:UInt32}`;
            queryParams.quarter = quarter;
        }
        query += `
            GROUP BY
                LEFT(dp.codeproduit, 2)
            ORDER BY
                LEFT(dp.codeproduit, 2);
        `;

        clickhouse.query(query, { params: queryParams }).toPromise()
            .then((rows) => {
                const response = {
                    BancassuranceVendus: 0,
                    BNQDigiVendus: 0,
                    CartesVendus: 0,
                    PacksVendus: 0,
                    ComptesOuverts: 0
                };
                // Iterate over the fetched data to update the response object
                rows.forEach(row => {
                    if (row.Product_Group === 'BA') {
                        response.BancassuranceVendus = row.product_count;
                    } else if (row.Product_Group === 'BN') {
                        response.BNQDigiVendus = row.product_count;
                    } else if (row.Product_Group === 'CR') {
                        response.CartesVendus = row.product_count;
                    } else if (row.Product_Group === 'PA') {
                        response.PacksVendus = row.product_count;
                    }
                });
                res.status(200).json(response);
            })
            .catch((err) => {
                console.error('Error:', err); // Handle any errors
            });
        // Initialize an object to store the response
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
