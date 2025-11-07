const express = require('express');
const { getFitness } = require('../controllers/fitnessController');
const router = express.Router();

router.get('/getFitness',getFitness);

module.exports = router;