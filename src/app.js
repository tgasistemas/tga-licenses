'use strict';

const express = require('express');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
const config = require('./config');

const app = express();
// const router = express.Router();

// Connecta ao banco
// mongoose.connect(config.connectionString);

// Carrega os Models
// const Product = require('./models/product');
// const Customer = require('./models/customer');
// const Order = require('./models/order');

// Carrega as Rotas
const indexRoute = require('./routes/index-route');
// const productRoute = require('./routes/product-route');
// const customerRoute = require('./routes/customer-route');
// const orderRoute = require('./routes/order-route');
// const clientRoute = require('./routes/client-route');
const licenseRoute = require('./routes/license-route');

app.use(bodyParser.json({
    limit: '5mb'
}));
app.use(bodyParser.urlencoded({
    extended: false
}));

// Habilita o CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token, token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use('/', indexRoute);
// app.use('/produtos', productRoute);
// app.use('/customer', customerRoute);
// app.use('/orders', orderRoute);
// app.use('/clients', clientRoute);
app.use('/licenses',licenseRoute);



module.exports = app;
