const express = require('express');
const router = express.Router();
const {feedData}  = require('../controllers/carbonController');

// POST /api/carbon/feedData
router.post('/feedData', feedData);

module.exports = router;