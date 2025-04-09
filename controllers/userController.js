/**
 * @module userController
 * @description Controller for handling user authentication and session management.
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.models');


/**
 * Registers a new user.
 * @function signUp
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing user details.
 * @param {string} req.body.username - Username of the new user.
 * @param {string} req.body.email - Email of the new user.
 * @param {string} req.body.password - Password of the new user.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a response with a success message or an error.
 */
module.exports.signUp = async (req, res, next) => {

    try {
        const { username, email, password } = req.body;
        // check to see if user already exists and throw error when user does
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        await user.save();

        res.cookie("fortune", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
            maxAge: 3600000, // 1 hour
        })
        const cookie = res.getHeader('Set-Cookie');
        const parts = cookie.split('; ');         
        const k = parts[0].slice(8);
        console.log("cookie:", k);
        res.status(201).json({ message: 'User registered successfully', cookie: res.cookies });
    } catch (err) {
        next(err)
    }

};

/**
 * Logs in an existing user.
 * 
 * @function signIn
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing login credentials.
 * @param {string} req.body.email - Email of the user.
 * @param {string} req.body.password - Password of the user.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a response with a success message or an error.
 */
module.exports.signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user)
            return res.status(401).json({ message: 'Invalid credentials' });

        // Compare provided password with hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch)
            return res.status(401).json({ message: 'Invalid credentials' });

        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        await user.save();
        res.cookie("fortune", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
            maxAge: 3600000, // 1 hour
        })
        const cookie = res.getHeader('Set-Cookie');
        const parts = cookie.split('; ');         
        const k = parts[0].slice(8);
        console.log("cookie:", k);
        res.json({
            message: "Logged in successfully"
        });
    } catch (err) {
        next(err)
    }
};




/**
 * Logs out the currently authenticated user.
 * 
 * @function signOut
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a response with a success message or an error.
 */
module.exports.signOut = async (req, res, next) => {
    try {
        res.clearCookie("fortune");
        res.status(200).json({ message: 'User signed out successfully' });
    } catch (err) {
        next(err);
    }
};



