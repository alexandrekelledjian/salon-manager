const express = require('express');
const { getSalonByCode, getProductsBySalonCode } = require('../controllers/publicController');

const router = express.Router();

router.get('/salons/by-code/:code_url', getSalonByCode);

router.get('/salons/:code_url/products', getProductsBySalonCode);

module.exports = router;
