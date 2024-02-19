const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const recipeRoute = require('./routes/recipes');
const userRoute = require('./routes/user');
const imageRoute = require('./routes/images');

const app = express();

var corsOptions = {
  origin: function (origin, callback) {
    callback(null, true);
  },
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'device-remember-token',
    'Access-Control-Allow-Origin',
    'Origin',
    'Accept',
  ],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use('/recipes', recipeRoute);
app.use('/user', userRoute);
app.use('/image', imageRoute);

module.exports = app;
