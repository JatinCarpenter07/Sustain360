const express = require('express');
const router = express.Router();
const { feedData } = require('../controllers/healthController');

router.post('/feedData', feedData);

module.exports = router;
