const userDataModel=require('../models/usersModel');
const financeDataModel=require('../models/financeModel');

// 💰 Calculation Function
function calcFinance(entry, monthlyIncome) {
  const dailyIncome = monthlyIncome / 30;
  const exp = entry.expenses || {};

  const totalExpenses = Object.values(exp).reduce((a, b) => a + (b || 0), 0);
  const savingsAdded = entry.savingsAdded || 0;

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

module.exports={feedData,updateMonthlyIncome,getHistory};
