const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/routes')
const { globalErrorHandler } = require('./middleware/globalErrorHandler')
// const cookieParser = require('cookie-parser');
const session = require('express-session');


const app = express();
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    // secure: false,                
    httpOnly: true,
    maxAge: 3600000
  }
}))
// app.use(cookieParser());  
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('welcome to my page')
})
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.post('/echo', (req, res) => {
  res.json(req.body);
});
app.use(routes);
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });

});
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}
app.use(globalErrorHandler)

module.exports = app;


const PORT = process.env.PORT || 4444;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});







