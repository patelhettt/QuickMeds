const mongoose = require('mongoose');

const medicineSchema = mongoose.Schema({
  tradeName: { type: String, required: true, default: "Unknown Trade Name" },
  genericName: { type: String, required: true, default: "Unknown Generic Name" },
  strength: { type: String, required: true },
  category: { type: String, required: true, default: "General" },
  company: { type: String, required: true, default: "Unknown Company" },
  stock: { type: Number, required: true, default: 100 },
  packType: { type: String, required: true },
  unitMrp: { type: Number, required: true },
  addedBy: { type: String, required: true, default: "admin" },
  addedToDbAt: { type: Date, required: true, default: Date.now }
});

const Pharmacy = new mongoose.model('pharmacy', medicineSchema);

module.exports = { Pharmacy };
