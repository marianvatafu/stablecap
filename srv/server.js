const cds = require('@sap/cds');
const cors = require('cors');
const express = require('express');

cds.on('bootstrap', (app) => {
    console.debug("Use: cors middleware");
    app.use(cors());
})
module.exports = cds.server;

const app = express();

// ...

const deleteAllFoodsRouter = require('./deleteAllFoods');
app.use('/', deleteAllFoodsRouter);

