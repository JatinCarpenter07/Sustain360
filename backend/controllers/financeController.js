const userDataModel=require('../models/usersModel');
const financeDataModel=require('../models/financeModel');

// 💰 Calculation Function
function calcFinance(entry, monthlyIncome) {
  const dailyIncome = monthlyIncome / 30;
  const exp = entry.expenses || {};

  // const totalExpenses = Object.values(exp).reduce((a, b) => a + (b || 0), 0);
  // const savingsAdded = entry.savingsAdded || 0;

  const totalExpenses = Object.values(exp).reduce((a, b) => a + (Number(b) || 0), 0);
  //const totalExpenses = Object.values(exp).reduce((a, b) => a + (b || 0), 0);
  const savingsAdded = Number(entry.savingsAdded) || 0; // Ise bhi Number() mein daal do
 // const savingsAdded = entry.savingsAdded || 0;

  const idealSavings = dailyIncome * 0.2;
  const savingsScore = Math.min(100, (savingsAdded / idealSavings) * 100);
  const expenseScore = Math.max(0, 100 - (totalExpenses / dailyIncome) * 100);
  const score = Math.round((savingsScore * 0.6) + (expenseScore * 0.4));

  const expenseDistribution = {};
  for (let k in exp) {
    expenseDistribution[k] = totalExpenses
      ? ((exp[k] || 0) / totalExpenses * 100).toFixed(2)
      : 0;
  }

  const savingsRate = ((dailyIncome - totalExpenses) / dailyIncome) * 100;

  return {
    totalExpenses,
    savingsRate,
    score,
    breakdown: { expenseScore, savingsScore, expenseDistribution }
  };
}

// ✅ POST - Add finance entry
const feedData=async (req, res) => {
  try {
    const userId=req.user._id;
    const userProfile = await userDataModel.findOne({ _id: userId });
    if (!userProfile) {
      return res.status(400).json({ error: "User profile not found. Please set monthly income first." });
    }

    const calc = calcFinance(req.body, userProfile.monthlyIncome);
    const entry = new financeDataModel({ userId,...req.body, ...calc });
    await entry.save();

    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const updateMonthlyIncome=async (req,res)=>{
  try {
    const userId=req.user._id;
    const { monthlyIncome } = req.body;
    const profile = await userDataModel.findByIdAndUpdate(
      userId,
      { monthlyIncome, lastUpdated: new Date() },
      { upsert: true, new: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET - Fetch finance history with pagination & date filter
const getHistory= async (req, res) => {
  try {
    const userId=req.user._id;
    const { start, end, page = 1, limit = 100 } = req.query;

    // Basic query for user
    const query = { userId };

    //optional date boundation
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
    const data = await financeDataModel.find(query)
      .sort({ date: -1 }) // latest to oldest
      .skip(skip)
      .limit(Number(limit));

    // Count total entries for pagination
    const total = await financeDataModel.countDocuments(query);

    // Return paginated data
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

// GET - Finance Analytics (Pie Chart, Trends, Filters)
const getAnalytics=async (req, res) => {
  try {
    const userId=req.user._id;
    const {
      groupBy = "daily", // "daily" | "weekly" | "monthly" | "yearly"
      period = "thisMonth", // "thisWeek" | "thisMonth" | "thisYear" | "custom"
      start,
      end,
    } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // --- 📅 1. Define Date Range ---
    const now = new Date();
    let startDate, endDate;

    if (period === "thisWeek") {
      const day = now.getDay();
      startDate = new Date(now);
      startDate.setDate(now.getDate() - day);
      endDate = now;
    } else if (period === "thisMonth") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = now;
    } else if (period === "thisYear") {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = now;
    } else if (period === "custom" && start && end) {
      startDate = new Date(start);
      endDate = new Date(end);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = now;
    }

    // --- 🧾 2. Fetch Data for that user ---
    const data = await financeDataModel.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    if (!data.length) {
      return res.json({
        filterUsed: { period, groupBy },
        categoryBreakdown: { savings: 0, expenses: 0 },
        timeline: {},
        summary: {
          total: "0.00",
          average: "0.00",
          max: null,
          min: null,
          count: 0,
        },
      });
    }

    // --- 📊 3. Group & Aggregate Data ---
    const timeline = {};
    const categoryBreakdown = { savings: 0, expenses: 0 };

    data.forEach((entry) => {
      const date = new Date(entry.date);
      let key;

      if (groupBy === "daily") key = date.toISOString().split("T")[0];
      else if (groupBy === "weekly")
        key = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
      else if (groupBy === "monthly")
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
      else key = date.getFullYear().toString();

      if (!timeline[key]) {
        timeline[key] = {
          totalExpenses: 0,
          savingsAdded: 0,
          savingsRate: 0,
          score: 0,
          count: 0,
        };
      }

      timeline[key].totalExpenses += entry.expenses.totalExpenses || 0;
      timeline[key].savingsAdded += entry.expenses.savingsAdded || 0;
      timeline[key].savingsRate += entry.expenses.savingsRate || 0;
      timeline[key].score += entry.score || 0;
      timeline[key].count += 1;

      // For Pie Chart
      categoryBreakdown.expenses += entry.expenses.totalExpenses || 0;
      categoryBreakdown.savings += entry.expenses.savingsAdded || 0;
    });

    // --- 📈 4. Finalize Timeline (averages per group) ---
    Object.keys(timeline).forEach((key) => {
      const t = timeline[key];
      t.avgSavingsRate = t.savingsRate / t.count;
      t.avgScore = t.score / t.count;
    });

    // --- 📉 5. Summary ---
    const allTotals = Object.values(timeline).map(
      (t) => t.totalExpenses + t.savingsAdded
    );
    const total = allTotals.reduce((a, b) => a + b, 0);
    const average = total / allTotals.length;
    const max = Math.max(...allTotals);
    const min = Math.min(...allTotals);

    // --- ✅ 6. Response ---
    res.json({
      filterUsed: { period, groupBy },
      categoryBreakdown,
      timeline,
      summary: {
        total: total.toFixed(2),
        average: average.toFixed(2),
        max,
        min,
        count: data.length,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports={feedData,updateMonthlyIncome,getHistory,getAnalytics};
