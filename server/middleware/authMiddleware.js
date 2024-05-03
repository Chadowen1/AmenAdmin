import jwt from 'jsonwebtoken';

const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if Authorization header is provided
    if (!authHeader) {
        return res.status(401).json({ message: 'No Authorization header provided' });
    }

    try {
        // Extract token from Authorization header
        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, 'admin');
        req.userId = decoded.userId; // Add userId to request object for later use
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
}

export default requireAuth;
