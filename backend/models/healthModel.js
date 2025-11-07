const mongoose=require('mongoose');

const wellnessEntrySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  // Input fields
  steps: Number,
  calories: Number,
  sleepHours: Number,
  waterIntake: Number,

  // Calculated fields
  wellnessScore: Number,
  breakdown: {
    steps: Number,
    sleep: Number,
    calories: Number,
    water: Number
  },

  date: { type: Date, default: Date.now }
});

const healthDataModel=mongoose.model("WellnessEntry", wellnessEntrySchema,"healthData");

module.exports=healthDataModel;