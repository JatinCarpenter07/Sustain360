const mongoose = require('mongoose');

const carbonDataSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  carKm: Number,
  bikeKm: Number,
  busKm: Number,
  trainKm: Number,
  flightKm: Number,
  electricityKwh: Number,
  gasKg: Number,
  meatServings: Number,
  dairyServings: Number,
  vegServings: Number,
  totalKgCO2: Number,
  breakdown: {
    travel: Number,
    energy: Number,
    food: Number,
  },
  date: { type: Date, default: Date.now },
});

const carbonDataModel = mongoose.model('carbon', carbonDataSchema,"carbonData");

module.exports=carbonDataModel;