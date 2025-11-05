const express = require('express');
const router = express.Router();
const { feedData}  = require('../controllers/waterController');

router.post('/feedData', feedData);

module.exports = router;
