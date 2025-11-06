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

const getAnalytics= async(req,res)=>{
  try {
    const userId = req.user._id;
    const {
      groupBy = "daily", // "daily" | "weekly" | "monthly" | "yearly"
      period = "custom", // "thisWeek" | "thisMonth" | "thisYear" | "custom"
      start,
      end,
      year,
      month,
    } = req.query;

    if (!userId)
      return res.status(400).json({ error: "User ID is required" });

    // 🗓️ Step 1: Compute date range
    const now = new Date();
    let fromDate, toDate;

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
      fromDate = new Date(now.getFullYear(), 0, 1);
      toDate = now;
    }

    // 🧩 Step 2: Query health data
    const entries = await healthDataModel.find({
      userId,
      date: { $gte: fromDate, $lte: toDate },
    }).sort({ date: 1 });

    if (!entries.length)
      return res.json({ message: "No data found for selected filters", summary: null });

    // 🧠 Step 3: Group dynamically by chosen interval
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
      grouped[key] += e.wellnessScore || 0;
    }

    // 📊 Step 4: Calculate category breakdown
    const categoryTotals = { steps: 0, sleep: 0, calories: 0, water: 0 };
    let totalScore = 0;

    entries.forEach(e => {
      if (e.breakdown) {
        categoryTotals.steps += e.breakdown.steps || 0;
        categoryTotals.sleep += e.breakdown.sleep || 0;
        categoryTotals.calories += e.breakdown.calories || 0;
        categoryTotals.water += e.breakdown.water || 0;
      }
      totalScore += e.wellnessScore || 0;
    });

    // 🧾 Step 5: Generate summary stats
    const values = Object.values(grouped);
    const summary = {
      totalScore: totalScore.toFixed(2),
      averageScore: (totalScore / entries.length).toFixed(2),
      maxScore: Math.max(...values),
      minScore: Math.min(...values),
      entriesCount: entries.length,
    };

    // ✅ Final response
    res.json({
      filterUsed: { period, groupBy, start, end, year, month },
      categoryBreakdown: categoryTotals,
      timeline: grouped,
      summary,
    });
  } catch (err) {
    console.error("Error in health analytics:", err);
    res.status(500).json({ error: err.message });
  }
}


module.exports={feedData,getHistory,getAnalytics};