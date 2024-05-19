import express from 'express';
import jwt from 'jsonwebtoken';

import pool from '../config/db.js';

const authRouter = express.Router();

// Login Route
authRouter.post('/login', async (req, res) => {
    const { codeemploye, passkey } = req.body;
    try {
        // Check if the codeemploye exists in the database
        const [rows, fields] = await pool.execute('SELECT CodeEmploye FROM Employes WHERE CodeEmploye = ?', [codeemploye]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Code employe invalide' });
        }
        // If codeemploye exists, check if the passkey matches
        const [profileRows, profileFields] = await pool.execute('SELECT PassKey FROM ProfileEmploye WHERE CodeEmploye = ?', [codeemploye]);
        if (profileRows.length === 0 || profileRows[0].PassKey !== passkey) {
            return res.status(401).json({ message: 'Clé d\'accès invalide' });
        }

        const { CodeEmploye } = rows[0];
        // If both codeemploye and passkey are valid, you can generate a token here and send it back
        const token = jwt.sign(
            {
                userId: CodeEmploye,
            },
            'admin',
            { expiresIn: "8h" }
        );
        // For simplicity, let's just send a success message
        return res.status(200).json({ message: 'Connexion réussie', token, CodeEmploye });
    } catch (error) {
        console.error('Error in login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default authRouter;
