const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/routes')
const {globalErrorHandler} = require('./middleware/globalErrorHandler')
const cookieParser = require('cookie-parser')

const PORT = 4444;
const app = express();
app.use(express.json());

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(routes);
app.use(globalErrorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});







