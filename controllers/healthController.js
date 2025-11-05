const healthDataModel=require('../models/healthModel');

// 🎯 Goal values
const goals = { steps: 10000, sleep: 8, calories: 2200, water: 3 };

// 🧠 Calculation Function
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

module.exports={feedData};