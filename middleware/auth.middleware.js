import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Main authentication middleware (protect)
export const protect = async (req, res, next) => {
    try {
        console.log('🔐 Auth middleware checking token...');
        
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        console.log('📋 Token received:', token ? 'Yes' : 'No');
        
        if (!token) {
            return res.status(401).json({ 
                message: "No token provided, access denied" 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ Token decoded:', decoded);
        
        // Get user from token
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ 
                message: "Token is not valid - user not found" 
            });
        }

        // Add user to request object
        req.user = user;
        console.log('👤 User authenticated:', user.email);
        next();
        
    } catch (error) {
        console.error('💥 Auth middleware error:', error.message);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: "Invalid token" 
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: "Token expired" 
            });
        }
        
        res.status(500).json({ 
            message: "Server error in authentication" 
        });
    }
};

// Admin authorization middleware
export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            message: "Access denied. Admin role required."
        });
    }
};

// Alias for protect (for backward compatibility)
export const authMiddleware = protect;