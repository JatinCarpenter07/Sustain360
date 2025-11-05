const healthDataModel=require('../models/healthModel');

//  Goal values
const goals = { steps: 10000, sleep: 8, calories: 2200, water: 3 };

//  Calculation Function
function calcWellness(entry) {
  const s = Math.min(100, (entry.steps / goals.steps) * 100);
  const sl = Math.min(100, (entry.sleepHours / goals.sleep) * 100);
  const cal = 100 - (Math.abs(entry.calories - goals.calories) / goals.calories) * 100;
  const water = Math.min(100, (entry.waterIntake / goals.water) * 100);
  const total = (s * 0.4) + (sl * 0.3) + (cal * 0.2) + (water * 0.1);
  return { score: Math.round(total), breakdown: { steps: s, sleep: sl, calories: cal, water } };
}

// Add wellness entry
const feedData= async (req, res) => {
  try {
    const calc = calcWellness(req.body);
    const userId=req.user._id;
    const entry = new healthDataModel({userId, ...req.body, wellnessScore: calc.score, breakdown: calc.breakdown });
    await entry.save();
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET - Fetch wellness history with pagination & date filter
const getHistory=async (req, res) => {
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

    // Pagination setup
    const skip = (page - 1) * limit;

    // Fetch latest-first sorted data
    const data = await healthDataModel.find(query)
      .sort({ date: -1 }) // latest to oldest
      .skip(skip)
      .limit(Number(limit));

    // Count total entries for pagination
    const total = await healthDataModel.countDocuments(query);

    // Return data response
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