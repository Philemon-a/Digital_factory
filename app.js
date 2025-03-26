const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/routes')
const {globalErrorHandler} = require('./middleware/globalErrorHandler')
// const cookieParser = require('cookie-parser');
const session = require('express-session');

connectDB()
const PORT = 4444;
const app = express();
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET, // Required for session signing
    resave: false,                     // Avoid saving unmodified sessions
    saveUninitialized: true,           // Save new but uninitialized sessions
    cookie: {
        secure: false,                 // `true` for HTTPS; `false` for HTTP
        httpOnly: true,                // Prevent client-side JS access
        maxAge: 3600000                // Session expiry (1 hour)
    }
}))
// app.use(cookieParser());  
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(routes);
app.use(globalErrorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});







