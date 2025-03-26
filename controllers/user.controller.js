require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.models');


/**
 * Handles user sign-up by creating a new user with hashed password.
 * 
 * @async
 * @function signUp
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.username - The username of the user.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The plain text password of the user.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Sends a JSON response with a success message or an error message.
 */
module.exports.signUp = async(req, res) => {
    try {
        const { username, email, password } = req.body;
         // check to see if user already exists and throw error when user does
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        next(err)
    }

};

/**
 * Handles user sign-in by authenticating the user and generating a JWT.
 * 
 * @async
 * @function signIn
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The plain text password of the user.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Sends a JSON response with a JWT token or an error message.
 */
module.exports.signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Compare provided password with hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // Set the token as a cookie
        req.session.token = token
        console.log(token, req.session.token)
        res.json({ 
            message: "Logged in successfully",
            username: user.username
        });
    } catch (err) {
        next(err);
    }
};



/**
 * Handles user sign-out by clearing the token or session.
 * 
 * @async
 * @function signOut
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Sends a JSON response with a success message or an error message.
 */
module.exports.signOut = async(req, res) => {
    try {
        // Clear the token or session (example: clearing a cookie)
        res.clearCookie('token');
        res.status(200).json({ message: 'User signed out successfully' });
    } catch (err) {
        next(err)
    }
};


module.exports.getUser = async (req, res) =>{
    try {
        const user = await User.findOne({_id : res.local.useId})
        res.send(user)

    } catch (err) {
        next(err)
        
    }
}