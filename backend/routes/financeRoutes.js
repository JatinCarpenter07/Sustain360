const express = require('express');
const router = express.Router();
const { feedData ,updateMonthlyIncome,getHistory, getAnalytics} = require('../controllers/financeController');

router.post('/feedData', feedData);
router.put('/updateMonthlyIncome',updateMonthlyIncome);
router.get('/getHistory',getHistory);
router.get('/getAnalytics',getAnalytics);

module.exports = router;