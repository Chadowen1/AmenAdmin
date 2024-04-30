import jwt from 'jsonwebtoken';

const requireAuth = async (req, res, next) => {
    const token = req.headers.authorization;

    // Check if token is provided
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, 'RANDOM-TOKEN');
        req.userId = decoded.userId; // Add userId to request object for later use
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
}

export default requireAuth;


