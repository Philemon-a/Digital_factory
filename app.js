const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/routes')
const {globalErrorHandler} = require('./middleware/globalErrorHandler')
const session = require('express-session');

const PORT = 4444;
const app = express();
app.use(express.json());

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));
connectDB();

app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
  try {
    app.use(routes);
    app.use(globalErrorHandler); // Ensure this is the last middleware

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
};

startServer();







