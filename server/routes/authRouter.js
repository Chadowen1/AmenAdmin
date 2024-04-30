import express from 'express';
import pool from '../config/db.js';


const authRouter = express.Router();

// Login Route
authRouter.post('/auth', async (req, res) => {
    const { codeemploye, passkey } = req.body;
    try {
        // Check if the codeemploye exists in the database
        const [rows, fields] = await pool.execute('SELECT * FROM Employes WHERE CodeEmploye = ?', [codeemploye]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid codeemploye' });
        }
        // If codeemploye exists, check if the passkey matches
        const [profileRows, profileFields] = await pool.execute('SELECT * FROM ProfileEmploye WHERE CodeEmploye = ?', [codeemploye]);
        if (profileRows.length === 0 || profileRows[0].PassKey !== passkey) {
            return res.status(401).json({ message: 'Invalid passkey' });
        }
        // If both codeemploye and passkey are valid, you can generate a token here and send it back
        // For simplicity, let's just send a success message
        return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error in login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Logout Route
authRouter.post('/logout', (req, res) => {
    // Implement logout logic here
    return res.status(200).json({ message: 'Logout successful' });
});

export default authRouter;
