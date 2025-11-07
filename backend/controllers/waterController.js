const waterDataModel = require('../models/waterModel');

function calcWater(entry) {
//   const c = { shower: 9, laundry: 50, dish: 15, meat: 4500, veg: 322 };
//   const personal = ((entry.showerMin || 0) * c.shower) +
//                    ((entry.laundryLoads || 0) * c.laundry) +
//                    ((entry.dishUses || 0) * c.dish) +
//                    ((entry.drinkingL || 0));
//   const diet = ((entry.meatServings || 0) * c.meat) +
//                ((entry.vegServings || 0) * c.veg);
//   const total = personal + diet;
//   return { totalLiters: total, breakdown: { personal, diet } };

const c = { shower: 9, laundry: 50, dish: 15, meat: 4500, veg: 322 };
  const personal = ((Number(entry.showerMin) || 0) * c.shower) +
                   ((Number(entry.laundryLoads) || 0) * c.laundry) +
                   ((Number(entry.dishUses) || 0) * c.dish) +
                   (Number(entry.drinkingL) || 0); // <-- YEH HAI FIX

  const diet = ((Number(entry.meatServings) || 0) * c.meat) +
               ((Number(entry.vegServings) || 0) * c.veg);
  
  const total = personal + diet; // Ab yeh Number + Number hoga
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

// ✅ GET - Smart Water Analytics API (supports all date combinations)
const getAnalytics=async (req, res) => {
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

    if (!userId) return res.status(400).json({ error: "User ID required" });

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
      fromDate = new Date(now.getFullYear(), 0, 1); // default current year
      toDate = now;
    }

    // 🧩 Step 2: Query data
    const entries = await waterDataModel.find({
      userId,
      date: { $gte: fromDate, $lte: toDate },
    }).sort({ date: 1 });

    if (!entries.length)
      return res.json({ message: "No data found", summary: null });

    // 🧠 Step 3: Group dynamically (for timeline)
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
      grouped[key] += e.totalLiters || 0; // ✅ correct field
    }

    // 💧 Step 4: Calculate category-wise breakdown
    const categoryTotals = { personal: 0, diet: 0 };
    let total = 0;

    entries.forEach(e => {
      if (e.breakdown) {
        categoryTotals.personal += e.breakdown.personal || 0;
        categoryTotals.diet += e.breakdown.diet || 0;
      }
      total += e.totalLiters || 0;
    });

    // 📊 Step 5: Summary stats
    const values = Object.values(grouped);
    const summary = {
      total: total.toFixed(2),
      average: (total / entries.length).toFixed(2),
      max: Math.max(...values),
      min: Math.min(...values),
      count: entries.length,
    };

    // 🧾 Step 6: Response
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