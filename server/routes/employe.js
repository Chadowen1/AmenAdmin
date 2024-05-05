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
                LEFT(dp.codeproduit, 2) AS Product_Group,
                COUNT(fpe.produitsk) AS Product_Count
            FROM 
                fait_performance_employe fpe 
            LEFT JOIN 
                dimemployes de ON de.employesk = fpe.employesk 
            LEFT JOIN
                dimproduit dp ON dp.produitsk = fpe.produitsk 
            LEFT JOIN 
                dimdate da ON da.datesk = fpe.date_activation_sk
            WHERE 
                de.codeemploye = $1
                AND da.annee = $2
        `;
        const queryParams = [codeEmploye, year];
        let paramIndex = 3; // Initialize the parameter index for additional parameters
        if (month) {
            query += ` AND da.mois = $${paramIndex}`;
            queryParams.push(month);
            paramIndex++; // Increment the parameter index
        }
        if (quarter) {
            query += ` AND da.trimestre = $${paramIndex}`;
            queryParams.push(quarter);
        }
        query += `
                AND LEFT(dp.codeproduit, 2) IN ('BA', 'BN', 'CR', 'PA')
                GROUP BY 
                    LEFT(dp.codeproduit, 2);
        `;
        // Execute the query with named parameters
        const { rows: data } = await client.query(query, queryParams);
        // Additional query for counting distinct accounts
        let accountsQuery = `
            SELECT
                COUNT(distinct fpe.comptesk) AS Accounts_Count
            FROM 
                fait_performance_employe fpe 
            LEFT JOIN 
                dimemployes de ON de.employesk = fpe.employesk
            LEFT JOIN 
                dimdate da ON da.datesk = fpe.date_creation_sk 
            WHERE 
                de.codeemploye = $1
                AND da.annee = $2
        `;
        const accountsQueryParams = [codeEmploye, year];
        if (month) {
            accountsQuery += ` AND da.mois = $3`;
            accountsQueryParams.push(month);
            if (quarter) {
                accountsQuery += ` AND da.trimestre = $4`;
                accountsQueryParams.push(quarter);
            }
        }
        if (quarter) {
            accountsQuery += ` AND da.trimestre = $3`;
            accountsQueryParams.push(quarter);
            if (month) {
                accountsQuery += ` AND da.mois = $4`;
                accountsQueryParams.push(month);
            }
        }
        // Execute the accounts query
        const { rows: accountsData } = await client.query(accountsQuery, accountsQueryParams);
        client.release();
        // Initialize an object to store the response
        const response = {
            BancassuranceVendus: 0,
            BNQDigiVendus: 0,
            CartesVendus: 0,
            PacksVendus: 0,
            ComptesOuverts: 0
        };
        // Iterate over the fetched data to update the response object
        data.forEach(row => {
            if (row.product_group === 'BA') {
                response.BancassuranceVendus = row.product_count;
            } else if (row.product_group === 'BN') {
                response.BNQDigiVendus = row.product_count;
            } else if (row.product_group === 'CR') {
                response.CartesVendus = row.product_count;
            } else if (row.product_group === 'PA') {
                response.PacksVendus = row.product_count;
            }
        });
        // Extract accounts_opened from the first row if data is available
        if (accountsData.length > 0) {
            response.ComptesOuverts = accountsData[0].accounts_count;
        }
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/produitStats', async (req, res) => {
    try {
        const { codeEmploye, relation, year, quarter, month, codeProduit} = req.query;
        // Check if codeEmploye or year parameters are missing
        if (!codeEmploye || !year || !relation) {
            return res.status(400).json({ message: 'codeEmploye, year and relation parameters are required' });
        }
        const client = await dw.connect();
        // Define your SQL query with named parameters
        let query = `
                select 
                    dc.segment,
                    COUNT(distinct fpe.produitsk)
                from
                    fait_performance_employe fpe 
                left join 
                    dimproduit d on d.produitsk = fpe.produitsk 
                left join 
                    dimdate da on da.datesk = fpe.date_activation_sk 
                left join 
                    dimemployes de on de.employesk = fpe.employesk
                left join 
                    fait_vente_produits fvp on fvp.produitsk = fpe.produitsk
                left join
                dimclient dc on dc.clientsk = fvp.clientsk 
                where 
                    de.codeemploye = $1
                    and dc.typerelation = $2
                    and da.annee = $3
        `;
        const queryParams = [codeEmploye, relation, year];
        let paramIndex = 4; // Initialize the parameter index for additional parameters
        if (month) {
            query += ` AND da.mois = $${paramIndex}`;
            queryParams.push(month);
            paramIndex++; // Increment the parameter index
        }
        if (quarter) {
            query += ` AND da.trimestre = $${paramIndex}`;
            queryParams.push(quarter);
        }
        if (codeProduit){
            query += ` and LEFT(d.codeproduit, 2) = $${paramIndex}`;
            queryParams.push(codeProduit);
        }
        query += `
                group by 
                    dc.segment;
        `;
        // Execute the query with named parameters
        const {rows} = await client.query(query, queryParams);
        // Additional query for counting distinct accounts
        client.release();
        const result = rows.map(row => {
            return {
                segment: row.segment,
                [year]: parseInt(row.count)
            };
        });
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
