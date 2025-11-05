const express = require('express');
const router = express.Router();
const { feedData,getHistory}  = require('../controllers/waterController');

router.post('/feedData', feedData);
router.get('/getHistory',getHistory);

module.exports = router;
