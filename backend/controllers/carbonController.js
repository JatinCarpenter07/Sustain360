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

//  GET - Smart Carbon Analytics API (supports all date combinations)
const getAnalytics= async (req, res) => {
  try {
    const userId=req.user._id;
    const {
      groupBy = "daily", // "daily" | "weekly" | "monthly" | "yearly"
      period = "custom", // "thisWeek" | "thisMonth" | "thisYear" | "custom"
      start,
      end,
      year,
      month,
    } = req.query;


    // 🗓️ Step 1: Compute start & end based on period
    let fromDate, toDate;
    const now = new Date();

    if (period === "thisWeek") {
      const day = now.getDay();
      fromDate = new Date(now);
      fromDate.setDate(now.getDate() - day + 1);
      toDate = new Date(now);
    } else if (period === "thisMonth") {
      fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
      toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (period === "thisYear") {
      fromDate = new Date(now.getFullYear(), 0, 1);
      toDate = new Date(now.getFullYear(), 11, 31);
    } else if (year && month) {
      fromDate = new Date(year, month - 1, 1);
      toDate = new Date(year, month, 0, 23, 59, 59);
    } else if (year) {
      fromDate = new Date(year, 0, 1);
      toDate = new Date(year, 11, 31, 23, 59, 59);
    } else if (start && end) {
      fromDate = new Date(start);
      toDate = new Date(end);
    } else {
      fromDate = new Date(now.getFullYear(), 0, 1); // default = current year
      toDate = now;
    }

    // 🧩 Step 2: Query data
    const entries = await carbonDataModel.find({
      userId,
      date: { $gte: fromDate, $lte: toDate },
    }).sort({ date: 1 });

    if (!entries.length)
      return res.json({ message: "No data found", summary: null });

    // 🧠 Step 3: Group dynamically
    const grouped = {};
    for (const e of entries) {
      const d = new Date(e.date);
      let key;

      if (groupBy === "daily") key = d.toISOString().split("T")[0];
      else if (groupBy === "weekly")
        key = `${d.getFullYear()}-W${Math.ceil(d.getDate() / 7)}`;
      else if (groupBy === "monthly")
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      else key = `${d.getFullYear()}`;

      if (!grouped[key]) grouped[key] = 0;
      grouped[key] += e.totalKgCO2 || 0; // ✅ use correct field
    }

    // 🧮 Step 4: Calculate pie categories
    const categoryTotals = { travel: 0, energy: 0, food: 0 };
    let total = 0;

    entries.forEach(e => {
      if (e.breakdown) {
        categoryTotals.travel += e.breakdown.travel || 0;
        categoryTotals.energy += e.breakdown.energy || 0;
        categoryTotals.food += e.breakdown.food || 0;
      }
      total += e.totalKgCO2 || 0;
    });

    // 🧾 Step 5: Stats
    const values = Object.values(grouped);
    const summary = {
      total: total.toFixed(2),
      average: (total / entries.length).toFixed(2),
      max: Math.max(...values),
      min: Math.min(...values),
      count: entries.length,
    };

    const dummy={
      filterUsed: { period, groupBy, start, end, year, month },
      categoryBreakdown: categoryTotals,
      timeline: grouped,
      summary,
    };

    console.log("Analytics Response carbon:", dummy);

    res.json({
      filterUsed: { period, groupBy, start, end, year, month },
      categoryBreakdown: categoryTotals,
      timeline: grouped,
      summary,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}



module.exports={feedData,getHistory,getAnalytics};