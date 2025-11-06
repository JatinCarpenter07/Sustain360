const mongoose=require('mongoose');

const financeEntrySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  // Daily dynamic data
  expenses: {
    food: { type: Number, default: 0 },
    travel: { type: Number, default: 0 },
    entertainment: { type: Number, default: 0 },
    shopping: { type: Number, default: 0 },
    bills: { type: Number, default: 0 },
    misc: { type: Number, default: 0 }
  },

  savingsAdded: { type: Number, default: 0 },

  // Calculated metrics
  totalExpenses: Number,
  savingsRate: Number,
  score: Number,
  breakdown: {
    expenseScore: Number,
    savingsScore: Number,
    expenseDistribution: Object
  },

  date: { type: Date, default: Date.now }
});

const financeDataModel=mongoose.model("FinanceEntry", financeEntrySchema,'financeData');
module.exports=financeDataModel;