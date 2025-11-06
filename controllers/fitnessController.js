const carbonDataModel=require('../models/carbonModel');
const waterDataModel=require('../models/waterModel');
const financeDataModel=require('../models/financeModel');
const healthDataModel=require('../models/healthModel');

// Utility functions
const avg = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
const normalize = (ideal, actual, lowerIsBetter = false) => {
  if (!actual) return 0;
  const ratio = lowerIsBetter ? ideal / actual : actual / ideal;
  return Math.round(Math.min(ratio, 1) * 100);
};


const getFitness=async (req, res) => {
  try {
    const userId=req.user._id;
    const {
      gender = "male",
      age = 25,
      height = 170,
      weight = 70,
      bloodGroup,
      start,
      end
    } = req.query;

    // 🗓 Date filtering
    const fromDate = start ? new Date(start) : new Date(2020, 0, 1);
    const toDate = end ? new Date(new Date(end).setHours(23, 59, 59, 999)) : new Date();

    // 🧩 Fetch all entries
    const [carbon, water, wellness, finance] = await Promise.all([
      carbonDataModel.find({ userId, date: { $gte: fromDate, $lte: toDate } }),
      waterDataModel.find({ userId, date: { $gte: fromDate, $lte: toDate } }),
      healthDataModel.find({ userId, date: { $gte: fromDate, $lte: toDate } }),
      financeDataModel.find({ userId, date: { $gte: fromDate, $lte: toDate } })
    ]);

    // 🧠 Calculate BMI
    const bmi = weight / ((height / 100) ** 2);
    const bmiScore = bmi >= 18.5 && bmi <= 24.9 ? 100 : 80;

    // ---- IDEAL BENCHMARKS ----
    const ideals = {
      carbon: 6,           // kg CO₂ per day
      water: 3000,         // L per day
      steps: 8000,
      calories: 2200,
      sleep: 8,
      waterIntake: 3,      // L/day
      savingsRate: 20      // %
    };

    // ---- ACTUAL AVERAGES ----
    const actuals = {
      avgCarbon: avg(carbon.map(e => e.totalKgCO2)),
      avgWater: avg(water.map(e => e.totalLiters)),
      avgSteps: avg(wellness.map(e => e.steps)),
      avgCalories: avg(wellness.map(e => e.calories)),
      avgSleep: avg(wellness.map(e => e.sleepHours)),
      avgIntake: avg(wellness.map(e => e.waterIntake)),
      avgWellnessScore: avg(wellness.map(e => e.wellnessScore)),
      avgSavingsRate: avg(finance.map(e => e.savingsRate))
    };

    // ---- NORMALIZED SCORES ----
    const scores = {
      carbonScore: normalize(ideals.carbon, actuals.avgCarbon, true),
      waterScore: normalize(ideals.water, actuals.avgWater, true),
      stepsScore: normalize(ideals.steps, actuals.avgSteps),
      calorieScore: normalize(ideals.calories, actuals.avgCalories),
      sleepScore: normalize(ideals.sleep, actuals.avgSleep),
      intakeScore: normalize(ideals.waterIntake, actuals.avgIntake),
      wellnessScore: actuals.avgWellnessScore,
      financeScore: normalize(ideals.savingsRate, actuals.avgSavingsRate),
      bmiScore
    };

    // ---- OVERALL PERSONAL FITNESS INDEX (PFI) ----
    const personalFitnessIndex = Math.round(
      (scores.carbonScore * 0.15) +
      (scores.waterScore * 0.15) +
      (scores.stepsScore * 0.15) +
      (scores.sleepScore * 0.15) +
      (scores.wellnessScore * 0.15) +
      (scores.financeScore * 0.15) +
      (bmiScore * 0.10)
    );

    // ---- INSIGHTS ----
    const insights = {
      carbon: actuals.avgCarbon > ideals.carbon
        ? "High CO₂ emission — reduce travel or energy use."
        : "Carbon footprint under control.",
      water: actuals.avgWater > ideals.water
        ? "Reduce water-intensive foods like meat or dairy."
        : "Efficient water use maintained.",
      wellness: actuals.avgWellnessScore > 85
        ? "Excellent daily wellness routine."
        : "Improve consistency in steps or sleep.",
      finance: actuals.avgSavingsRate < ideals.savingsRate
        ? "Try saving at least 20% of income."
        : "Healthy savings habits.",
      bmi: bmi >= 18.5 && bmi <= 24.9
        ? "BMI optimal for your height."
        : "Consider a more balanced diet and exercise."
    };

    // ---- RESPONSE ----
    res.json({
      userId,
      profile: { gender, age, height, weight, bloodGroup, bmi },
      rangeUsed: { fromDate, toDate },
      actuals,
      ideals,
      scores,
      personalFitnessIndex,
      insights
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports={getFitness};