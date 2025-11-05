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

module.exports={feedData};
