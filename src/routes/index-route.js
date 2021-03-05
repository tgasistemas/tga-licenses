'use strict';

const express = require('express');
const router = express.Router();
const authService = require('../services/auth-service');

router.get('/', authService.authorize, (req, res, next) => {
    res.status(200).send({
        title: "Licenças TGA Mobile",
        content: "TGA MOBILE"
    });
});

module.exports = router;