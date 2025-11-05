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

const getHistory= async (req, res) => {
  try {
    const userId=req.user._id;
    const { start, end, page = 1, limit = 100 } = req.query;

    // Basic query for user
    const query = { userId };

    // Optional date filtering
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999); // include full end day

      query.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    // Skip and limit for pagination
    const skip = (page - 1) * limit;

    // Fetch sorted data (latest first)
    const data = await carbonDataModel.find(query)
      .sort({ date: -1 }) // latest to oldest
      .skip(skip)
      .limit(Number(limit));

    // Count total records for frontend scroll
    const total = await carbonDataModel.countDocuments(query);

    res.json({
      page: Number(page),
      limit: Number(limit),
      totalRecords: total,
      totalPages: Math.ceil(total / limit),
      data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}



module.exports={feedData,getHistory};
