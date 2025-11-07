const express = require('express');
const router = express.Router();
const { feedData ,getHistory, getAnalytics} = require('../controllers/healthController');

router.post('/feedData', feedData);
router.get('/getHistory',getHistory);
router.get('/getAnalytics',getAnalytics)

module.exports = router;