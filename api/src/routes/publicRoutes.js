const express = require('express');
const { getSalonByCode } = require('../controllers/publicController');

const router = express.Router();

router.get('/salons/by-code/:code_url', getSalonByCode);

module.exports = router;
