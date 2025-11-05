const waterDataModel = require('../models/waterModel');

function calcWater(entry) {
  const c = { shower: 9, laundry: 50, dish: 15, meat: 4500, veg: 322 };
  const personal = ((entry.showerMin || 0) * c.shower) +
                   ((entry.laundryLoads || 0) * c.laundry) +
                   ((entry.dishUses || 0) * c.dish) +
                   ((entry.drinkingL || 0));
  const diet = ((entry.meatServings || 0) * c.meat) +
               ((entry.vegServings || 0) * c.veg);
  const total = personal + diet;
  return { totalLiters: total, breakdown: { personal, diet } };
}

const feedData=async (req, res) => {
  try {
    const calc = calcWater(req.body);
    const userId=req.user._id;
    const entry = new waterDataModel({ userId,...req.body, ...calc });
    await entry.save();
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET - Fetch water footprint history with pagination & date filter
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

    // Pagination calculations
    const skip = (page - 1) * limit;

    // Fetch sorted data (latest first)
    const data = await waterDataModel.find(query)
      .sort({ date: -1 }) // latest to oldest
      .skip(skip)
      .limit(Number(limit));

    // Count total for frontend pagination
    const total = await waterDataModel.countDocuments(query);

    // Return response
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