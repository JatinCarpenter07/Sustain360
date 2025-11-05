const express = require('express');
const router = express.Router();
const { feedData } = require('../controllers/financeController');

router.post('/feedData', feedData);

module.exports = router;
