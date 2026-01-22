const express = require('express');
const publicRoutes = require('./publicRoutes');
const authRoutes = require('./authRoutes');
const adminSalonRoutes = require('./adminSalonRoutes');

const router = express.Router();

router.use('/public', publicRoutes);
router.use('/admin/auth', authRoutes);
router.use('/admin/salons', adminSalonRoutes);

module.exports = router;
