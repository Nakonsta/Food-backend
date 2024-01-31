const express = require('express');
const bodyParser = require('body-parser');
const recipeRoute = require('./routes/recipes');

const app = express();

app.use(bodyParser.json());
app.use('/recipes', recipeRoute);

module.exports = app;
