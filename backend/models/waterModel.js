const mongoose=require('mongoose');

const waterEntrySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  // Personal usage
  drinkingL: Number,
  showerMin: Number,
  laundryLoads: Number,
  dishUses: Number,

  // Diet usage
  meatServings: Number,
  vegServings: Number,

  // Calculated results
  totalLiters: Number,
  breakdown: {
    personal: Number,
    diet: Number
  },

  date: { type: Date, default: Date.now }
});

const waterDataModel=mongoose.model("WaterEntry", waterEntrySchema,"waterData");

module.exports=waterDataModel;
