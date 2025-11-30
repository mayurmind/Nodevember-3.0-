import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const loginUser = async (req, res) => {
    try {
        console.log('🔐 Login attempt:', req.body);
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                message: "Email and password are required" 
            });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        console.log('👤 User found:', user ? `Yes (${user.email})` : 'No');

        if (!user) {
            return res.status(400).json({ 
                message: "Invalid credentials" 
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        console.log('✅ Password valid:', isPasswordValid);

        if (!isPasswordValid) {
            return res.status(400).json({ 
                message: "Invalid credentials" 
            });
        }

        // Use YOUR variable name from .env
        const JWT_SECRET = process.env.Jwt_SECRET_KEY || process.env.JWT_SECRET;
        
        if (!JWT_SECRET) {
            console.error('❌ JWT Secret is missing');
            return res.status(500).json({ 
                message: "Server configuration error" 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user._id, 
                email: user.email,
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('🎉 Login successful for:', user.email);

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('💥 Login error:', error);
        res.status(500).json({ 
            message: "Server error during login",
            error: error.message 
        });
    }
};

// Also update the registerUser function with the same JWT_SECRET fix
const registerUser = async (req, res) => {
    try {
        console.log('📝 Registration attempt:', req.body);
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(400).json({ 
                message: "User already exists with this email" 
            });
        }

        // Create new user
        const user = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: password
        });

        await user.save();
        console.log('✅ User created successfully:', user.email);

        // Use YOUR variable name from .env
        const JWT_SECRET = process.env.Jwt_SECRET_KEY || process.env.JWT_SECRET;
        
        if (!JWT_SECRET) {
            console.error('❌ JWT Secret is missing');
            return res.status(500).json({ 
                message: "Server configuration error" 
            });
        }

        // Generate token
        const token = jwt.sign(
            { 
                id: user._id, 
                email: user.email,
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('💥 Registration error:', error);
        res.status(500).json({ 
            message: "Server error during registration",
            error: error.message 
        });
    }
};

const getMe = async (req, res) => {
    try {
        // req.user is set by the auth middleware
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "Profile retrieved successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        console.error('💥 Get profile error:', error);
        res.status(500).json({
            message: "Server error while fetching profile",
            error: error.message
        });
    }
};

export { loginUser, registerUser, getMe };