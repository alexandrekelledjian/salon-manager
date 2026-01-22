const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { listSalons, createSalon, updateSalon } = require('../controllers/adminSalonController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', listSalons);
router.post('/', createSalon);
router.patch('/:id', updateSalon);

module.exports = router;
