const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const recipeRoute = require('./routes/recipes');
const userRoute = require('./routes/user');
const imageRoute = require('./routes/images');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use('/recipes', recipeRoute);
app.use('/user', userRoute);
app.use('/image', imageRoute);

module.exports = app;
