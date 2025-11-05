const carbonDataModel = require('../models/carbonModel');

function calcCarbon(entry) {
  const coeffs = {
    car: 0.21,
    bike: 0.08,
    bus: 0.05,
    train: 0.035,
    flight: 0.25,
    electricity: 0.85,
    gas: 3,
    meat: 5,
    dairy: 1.5,
    veg: 0.5,
  };

  const travel =
    entry.carKm * coeffs.car +
    entry.bikeKm * coeffs.bike +
    entry.busKm * coeffs.bus +
    entry.trainKm * coeffs.train +
    entry.flightKm * coeffs.flight;

  const energy =
    entry.electricityKwh * coeffs.electricity +
    entry.gasKg * coeffs.gas;

  const food =
    entry.meatServings * coeffs.meat +
    entry.dairyServings * coeffs.dairy +
    entry.vegServings * coeffs.veg;

  const total = travel + energy + food;

  return { totalKgCO2: total, breakdown: { travel, energy, food } };
}

const feedData = async (req, res) => {
  try {
    const entry = req.body;
    const { totalKgCO2, breakdown } = calcCarbon(entry);
    const userId=req.user._id;

    const newRecord = await carbonDataModel.create({
      userId,
      ...entry,
      totalKgCO2,
      breakdown,
    });

    res.status(201).json(newRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports={feedData};
