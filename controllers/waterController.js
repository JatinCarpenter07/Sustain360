const waterDataModel = require('../models/waterModel');

function calcWater(entry) {
  const c = { shower: 9, laundry: 50, dish: 15, meat: 4500, veg: 322 };
  const personal = ((entry.showerMin || 0) * c.shower) +
                   ((entry.laundryLoads || 0) * c.laundry) +
                   ((entry.dishUses || 0) * c.dish) +
                   ((entry.drinkingL || 0));
  const diet = ((entry.meatServings || 0) * c.meat) +
               ((entry.vegServings || 0) * c.veg);
  const total = personal + diet;
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

module.exports={feedData};