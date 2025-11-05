const express = require('express');
const router = express.Router();
const { feedData ,updateMonthlyIncome,getHistory} = require('../controllers/financeController');

router.post('/feedData', feedData);
router.put('/updateMonthlyIncome',updateMonthlyIncome);
router.get('/getHistory',getHistory)

module.exports = router;
