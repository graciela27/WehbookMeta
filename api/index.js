var express = require('express');
const app = express();

app.use('/webhook', require('./webhook'));

module.exports = app;